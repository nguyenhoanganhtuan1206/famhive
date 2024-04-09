import { BadRequestException, Injectable } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { I18nContext } from 'nestjs-i18n';
import { In, Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';

import type { PageDto } from '../../common/dto/page.dto';
import type { LangCode } from '../../constants';
import { RoleType } from '../../constants';
import { ApiConfigService } from '../../shared/services/api-config.service';
import { DeleteBirthdayByUsersCommand } from '../event/commands/delete-birthday-by-users.command';
import { SendMailCommand } from '../mailer/commands/send-mail.command';
import { FindFamilyPurchaseCommand } from '../purchase/commands/find-family-purchase.command';
import type { PurchaseInfoDto } from '../purchase/dto/purchase-info.dto';
import type { PurchasePageOptionsDto } from '../purchase/dto/purchase-page-options.dto';
import { UpdateUserConfigurationCommand } from '../user/commands/update-configuration.command';
import { UserBalanceDto } from '../user/dtos/user-balance.dto';
import { UserEntity } from '../user/user.entity';
import type { UserConfigurationEntity } from '../user/user-configuration.entity';
import { ConfigDto } from './dto/config.dto';
import type CreateKidDto from './dto/create-kid.dto';
import type UpdateKidDto from './dto/update-kid.dto';
import { UpdateMeDto } from './dto/update-me.dto';
import type { UpdateMyConfigurationDto } from './dto/update-my-configuration.dto';
import { UpdateSpouseDto } from './dto/update-spouse.dto';
import type UpsertKidDto from './dto/upsert-kid.dto';
import { FamilyEntity } from './entities/family.entity';

@Injectable()
export class FamilyService {
  constructor(
    @InjectRepository(FamilyEntity)
    private readonly familyRepository: Repository<FamilyEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private commandBus: CommandBus,
    private apiConfigService: ApiConfigService,
  ) {}

  async getFamily(user: UserEntity) {
    return this.findFamilyOrFailed(user.familyId);
  }

  async getById(familyId: Uuid) {
    return this.findFamilyOrFailed(familyId);
  }

  async getMembersByFamilyId(familyId: Uuid) {
    const roleOrders = [RoleType.ADMIN, RoleType.SPOUSE, RoleType.KID];
    const members = await this.userRepository.findBy({ familyId });

    return _.orderBy(members, [(x) => roleOrders.indexOf(x.role), 'order']);
  }

  async getFamilyBalances(familyId: Uuid) {
    const family = await this.familyRepository.findOneOrFail({
      where: {
        id: familyId,
      },
      relations: {
        members: true,
      },
    });

    return UserBalanceDto.toUserBalanceDtos(family.members, family.rewardType);
  }

  async getMembers(user: UserEntity) {
    return this.getMembersByFamilyId(user.familyId);
  }

  async getSpouse(user: UserEntity) {
    return this.userRepository.findOneBy({
      familyId: user.familyId,
      role: RoleType.SPOUSE,
    });
  }

  async getFamilyPurchases(
    familyId: Uuid,
    pageOptionsDto: PurchasePageOptionsDto,
  ) {
    return this.commandBus.execute<
      FindFamilyPurchaseCommand,
      PageDto<PurchaseInfoDto>
    >(new FindFamilyPurchaseCommand(familyId, pageOptionsDto));
  }

  @Transactional()
  async updateSpouse(user: UserEntity, updateSpouseDto: UpdateSpouseDto) {
    const spouse = await this.findOrCreateSpouse(user);

    const existingUserByEmail = await this.userRepository.findOneBy({
      email: updateSpouseDto.email,
    });

    if (existingUserByEmail !== null && existingUserByEmail.id !== spouse.id) {
      throw new BadRequestException(
        `The email ${updateSpouseDto.email} is being used by someone else`,
      );
    }

    if (spouse.email !== updateSpouseDto.email) {
      if (spouse.activated) {
        throw new BadRequestException('Spouse is activated');
      }

      await this.sendInvitationEmail(user, updateSpouseDto);
    }

    return this.userRepository.save({
      ...spouse,
      ...updateSpouseDto,
    });
  }

  @Transactional()
  async config(user: UserEntity, configDto: ConfigDto) {
    return this.familyRepository.save({
      ...user.family,
      ...configDto,
    });
  }

  private async sendInviteSpouse(
    to: string,
    data: {
      inviterName?: string;
      inviterEmail?: string;
      email: string;
      fullName: string;
      joinViaWebLink: string;
    },
  ) {
    await this.commandBus.execute(
      new SendMailCommand({
        to,
        templateName: 'invite-family-member',
        data,
      }),
    );
  }

  @Transactional()
  async updateMe(user: UserEntity, updateMe: UpdateMeDto) {
    if (Boolean(updateMe.fullName) && Boolean(updateMe.color)) {
      await this.markAsCompletedSetup(user.familyId);
    }

    return this.userRepository.save({
      ...user,
      ...updateMe,
      birthday: updateMe.birthday ? new Date(updateMe.birthday) : undefined,
    });
  }

  @Transactional()
  async updateLanguage(user: UserEntity) {
    const langCode = I18nContext.current()?.lang as LangCode;

    return this.userRepository.save({
      ...user,
      langCode,
    });
  }

  async updateMyConfiguration(
    user: UserEntity,
    configurationDto: UpdateMyConfigurationDto,
  ) {
    user.configuration = await this.commandBus.execute<
      UpdateUserConfigurationCommand,
      UserConfigurationEntity
    >(new UpdateUserConfigurationCommand(user.id, configurationDto));

    return user;
  }

  private async markAsCompletedSetup(id: Uuid) {
    const family = await this.findFamilyOrFailed(id);

    if (!family.completedSetup) {
      family.completedSetup = true;
      await this.familyRepository.save(family);
    }
  }

  private async findFamilyOrFailed(id: Uuid) {
    return this.familyRepository.findOneByOrFail({ id });
  }

  private async findOrCreateSpouse(user: UserEntity) {
    const spouse = await this.userRepository.findOneBy({
      familyId: user.familyId,
      role: RoleType.SPOUSE,
    });

    if (spouse) {
      return spouse;
    }

    return this.userRepository.create({
      familyId: user.familyId,
      role: RoleType.SPOUSE,
      activated: false,
    });
  }

  @Transactional()
  async batchUpdateKids(user: UserEntity, upsertKidDtos: UpsertKidDto[]) {
    await this.removeOldFamilyKids(user, _.map(upsertKidDtos, 'id'));

    this.checkUniqueEmails(upsertKidDtos);

    // Get existing kids to be updated before upsert
    const updateKids = await this.userRepository.find({
      where: {
        id: In(_.compact(_.map(upsertKidDtos, 'id'))),
      },
    });

    const kids = await Promise.all(
      upsertKidDtos.map(async (kid, order) =>
        this.upsertKid(user, { ...kid, order }),
      ),
    );

    // This condition will return kids with updated email or new kids
    // For updated kids, the upsert email if exist will be compared with their existing email before upsert
    // For new kids, will always send invitation email since they don't exist inside the existing email list
    const sendEmailUsers = kids.filter(
      (kid) =>
        kid.email &&
        kid.email !== _.find(updateKids, { id: kid.id })?.email &&
        !kid.activated,
    );

    await Promise.all(
      sendEmailUsers.map(async (kid) => {
        if (kid.email && !kid.activated) {
          return this.sendInvitationEmail(user, kid);
        }
      }),
    );

    return kids;
  }

  private async upsertKid(user: UserEntity, upsertKid: Partial<UserEntity>) {
    if (user.role === RoleType.KID) {
      return this.handleKidSelfUpdate(user, upsertKid);
    }

    if (!upsertKid.id) {
      if (!upsertKid.email) {
        return this.userRepository.save(
          this.userRepository.create({
            fullName: upsertKid.fullName,
            color: upsertKid.color,
            familyId: user.familyId,
            birthday: upsertKid.birthday,
            order: upsertKid.order,
            role: RoleType.KID,
            activated: false,
          }),
        );
      }

      await this.checkExistingEmail(upsertKid);

      return this.userRepository.save(
        this.userRepository.create({
          fullName: upsertKid.fullName,
          email: upsertKid.email,
          color: upsertKid.color,
          familyId: user.familyId,
          birthday: upsertKid.birthday,
          order: upsertKid.order,
          role: RoleType.KID,
          activated: false,
        }),
      );
    }

    if (upsertKid.email) {
      await this.checkExistingEmail(upsertKid);
    }

    const existingKid = await this.findMember(user, upsertKid.id);

    if (
      existingKid.activated &&
      existingKid.email &&
      existingKid.email !== upsertKid.email
    ) {
      throw new BadRequestException(
        'Account is activated, cannot change email',
      );
    }

    return this.userRepository.save({
      ...existingKid,
      ...upsertKid,
    });
  }

  private async removeOldFamilyKids(
    user: UserEntity,
    newKidIds: Array<Uuid | undefined>,
  ) {
    const existingKids = await this.getKids(user);

    const toRemoveKids = existingKids.filter(
      (x) => !_.includes(newKidIds, x.id),
    );

    const kidIds = _.map(toRemoveKids, 'id');

    await this.commandBus.execute(new DeleteBirthdayByUsersCommand(kidIds));

    await this.userRepository.remove(toRemoveKids);
  }

  private async findMember(user: UserEntity, id: Uuid) {
    return this.userRepository.findOneByOrFail({ id, familyId: user.familyId });
  }

  private async handleKidSelfUpdate(
    user: UserEntity,
    upsertKid: Partial<UserEntity>,
  ) {
    if (user.id === upsertKid.id) {
      const existingKidUser = await this.findMember(user, user.id);

      if (existingKidUser.email !== upsertKid.email) {
        throw new BadRequestException('Kid is unable to change self email');
      }

      return this.userRepository.save({
        ...existingKidUser,
        ...upsertKid,
      });
    }

    // return the userEntity if kid is not self
    return user;
  }

  private async checkExistingEmail(upsertUser: Partial<UserEntity>) {
    const existingUser = await this.userRepository.findOneBy({
      email: upsertUser.email,
    });

    if (existingUser !== null && existingUser.id !== upsertUser.id) {
      throw new BadRequestException(
        `The email ${upsertUser.email} is being used by someone else`,
      );
    }
  }

  private async sendInvitationEmail(
    user: UserEntity,
    invitedMember: Partial<UserEntity>,
  ) {
    if (
      !invitedMember.email ||
      (invitedMember.email && invitedMember.activated)
    ) {
      return;
    }

    if (!invitedMember.fullName) {
      throw new BadRequestException('Full name is required');
    }

    const webURL = this.apiConfigService.appInfos.WEB_URL;
    const joinViaWebLink = `${webURL}/auth/register?email=${invitedMember.email}`;
    await this.sendInviteSpouse(invitedMember.email, {
      inviterName: user.fullName!,
      inviterEmail: user.email,
      email: invitedMember.email,
      fullName: invitedMember.fullName,
      joinViaWebLink,
    });
  }

  async createKid(user: UserEntity, createKidDto: CreateKidDto) {
    return this.userRepository.save(
      this.userRepository.create({
        ...createKidDto,
        role: RoleType.KID,
        familyId: user.familyId,
      }),
    );
  }

  async updateKid(user: UserEntity, id: Uuid, updateKidDto: UpdateKidDto) {
    const kid = await this.findMember(user, id);

    return this.userRepository.save({
      ...kid,
      ...updateKidDto,
    });
  }

  async deleteKid(user: UserEntity, id: Uuid) {
    const kid = await this.findMember(user, id);

    await this.commandBus.execute(new DeleteBirthdayByUsersCommand([id]));

    await this.userRepository.delete(kid.id);
  }

  async getKids(user: UserEntity) {
    const members = await this.getMembers(user);

    return _.filter(members, ['role', RoleType.KID]);
  }

  private checkUniqueEmails(upsertUsers: Array<Partial<UserEntity>>) {
    const emails = _.compact(_.map(upsertUsers, 'email'));

    if (_.uniq(emails).length !== emails.length) {
      throw new BadRequestException('Email must be unique');
    }
  }
}
