import { Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import {
  ArrayContains,
  ILike,
  In,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

import { removeEmptyQuery } from '../../common/utils';
import type { LangCode } from '../../constants';
import { RoleType } from '../../constants';
import { GetUsersCommand } from '../user/commands/get-users.command';
import type { UserEntity } from '../user/user.entity';
import { AnnouncementForUserType } from './constants/announcement-for-user-type';
import type { AnnouncementsQuery } from './dto/announcements.query';
import type { CreateAnnouncementDto } from './dto/create-announcement.dto';
import type { UpdateAnnouncementDto } from './dto/update-announcement.dto';
import { AnnouncementEntity } from './entities/announcement.entity';
import { AnnouncementByLocaleEntity } from './entities/announcement-by-locale.entity';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(AnnouncementEntity)
    private readonly announcementRepository: Repository<AnnouncementEntity>,
    @InjectRepository(AnnouncementByLocaleEntity)
    private readonly announcementByLocaleRepository: Repository<AnnouncementByLocaleEntity>,
    private readonly commandBus: CommandBus,
  ) {}

  async findAll(announcementsQuery: AnnouncementsQuery) {
    const announcements = await this.announcementRepository.find({
      where: this.getFindAnnouncementsOptions(announcementsQuery),
      relations: {
        announcementByLocales: true,
      },
    });

    return announcements.toDtos();
  }

  async findOne(id: Uuid) {
    const announcement = await this.findOneById(id, true);

    return announcement.toDto();
  }

  async create(createAnnouncementDto: CreateAnnouncementDto) {
    const announcement = await this.announcementRepository.save(
      this.announcementRepository.create({
        ...createAnnouncementDto,
        announcementByLocales: createAnnouncementDto.announcementByLocales.map(
          (item) => this.announcementByLocaleRepository.create(item),
        ),
      }),
    );

    return announcement.toDto();
  }

  async getCurrentAnnouncements(user: UserEntity) {
    // get user and user's family
    const userFound: UserEntity | undefined = _.first(
      await this.commandBus.execute(
        new GetUsersCommand({
          where: {
            id: user.id,
          },
          relations: {
            family: true,
          },
        }),
      ),
    );

    // premium or not
    let sendTos = [
      AnnouncementForUserType.ALL_USER,
      AnnouncementForUserType.NORMAL_USER,
    ];

    if (userFound?.family.productId) {
      sendTos = [
        AnnouncementForUserType.ALL_USER,
        AnnouncementForUserType.PREMIUM_USER,
      ];
    }

    if (userFound?.role === RoleType.SUPERUSER) {
      sendTos = [
        AnnouncementForUserType.ALL_USER,
        AnnouncementForUserType.SUPER_USER,
      ];
    }

    const announcements = await this.announcementRepository.find({
      where: [
        {
          ...this.getCurrentAnnouncementBasicFindOptions(userFound?.langCode),
          to: In(sendTos),
        },
        {
          ...this.getCurrentAnnouncementBasicFindOptions(userFound?.langCode),
          to: AnnouncementForUserType.SPECIFIC,
          specificEmails: ArrayContains([userFound?.email]),
        },
      ],
      relations: {
        announcementByLocales: true,
      },
    });

    return announcements.toDtos();
  }

  private getCurrentAnnouncementBasicFindOptions(
    langCode: LangCode | undefined,
  ) {
    const currentTime = new Date();

    return {
      enabled: true,
      startDateTime: LessThanOrEqual(currentTime),
      endDateTime: MoreThanOrEqual(currentTime),
      announcementByLocales: {
        langCode,
      },
    };
  }

  async update(id: Uuid, updateAnnouncementDto: UpdateAnnouncementDto) {
    const announcement = await this.findOneById(id, true);

    await this.announcementRepository.save({
      ...announcement,
      ...updateAnnouncementDto,
      announcementByLocales: updateAnnouncementDto.announcementByLocales.map(
        (announcementByLocale) => {
          if (!announcementByLocale.id) {
            delete announcementByLocale.id;
          }

          return this.announcementByLocaleRepository.create(
            announcementByLocale,
          );
        },
      ),
    });
  }

  async remove(id: Uuid) {
    const announcement = await this.findOneById(id);

    return this.announcementRepository.delete(announcement.id);
  }

  private async findOneById(id: Uuid, includeDetails = false) {
    return this.announcementRepository.findOneOrFail({
      where: { id },
      relations: {
        announcementByLocales: includeDetails,
      },
    });
  }

  private getFindAnnouncementsOptions(announcementsQuery: AnnouncementsQuery) {
    const options = {
      title: announcementsQuery.q && ILike(`%${announcementsQuery.q}%`),
      startDateTime:
        announcementsQuery.fromDate &&
        MoreThanOrEqual(announcementsQuery.fromDate),
      endDateTime:
        announcementsQuery.toDate && LessThanOrEqual(announcementsQuery.toDate),
      to: announcementsQuery.to,
    };

    return removeEmptyQuery(options);
  }
}
