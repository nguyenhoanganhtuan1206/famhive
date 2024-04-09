import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';

import type { UserEntity } from '../user/user.entity';
import type { CreateGiftDto } from './dto/create-gift.dto';
import type { UpdateGiftDto } from './dto/update-gift.dto';
import { GiftEntity } from './entities/gift.entity';
import { GiftRedemptionHistoryEntity } from './entities/gift-redemption-history.entity';

@Injectable()
export class GiftService {
  constructor(
    @InjectRepository(GiftEntity)
    private readonly giftRepository: Repository<GiftEntity>,
    @InjectRepository(GiftRedemptionHistoryEntity)
    private readonly giftRedemptionHistoryRepository: Repository<GiftRedemptionHistoryEntity>,
    private readonly i18nService: I18nService,
  ) {}

  findOne(user: UserEntity, id: Uuid) {
    return this.giftRepository.findOneByOrFail({
      id,
      familyId: user.familyId,
    });
  }

  findAll(user: UserEntity) {
    return this.giftRepository.find({
      where: {
        familyId: user.familyId,
      },
      order: {
        createdAt: 'desc',
      },
    });
  }

  create(user: UserEntity, createGiftDto: CreateGiftDto) {
    const newGift = this.giftRepository.create({
      ...createGiftDto,
      familyId: user.familyId,
      createdById: user.id,
    });

    return this.giftRepository.save(newGift);
  }

  async update(user: UserEntity, id: Uuid, updateGiftDto: UpdateGiftDto) {
    const gift = await this.findOne(user, id);

    return this.giftRepository.save({
      ...gift,
      ...updateGiftDto,
    });
  }

  async remove(user: UserEntity, id: Uuid) {
    const todo = await this.findOne(user, id);

    await this.giftRepository.delete(todo.id);
  }

  getGiftRecommendation(): string[] {
    const giftDefaults = this.i18nService.t('gift-defaults', {
      lang: I18nContext.current()?.lang,
    });

    return _.values(giftDefaults);
  }

  async getGiftSuggestion(user: UserEntity) {
    const gifts = await this.giftRepository
      .createQueryBuilder('gift')
      .select('DISTINCT(title)', 'title')
      .where({
        familyId: user.familyId,
      })
      .getRawMany();

    const giftRedemptionHistories = await this.giftRedemptionHistoryRepository
      .createQueryBuilder('giftRedemptionHistory')
      .select('DISTINCT(title)', 'title')
      .where({
        familyId: user.familyId,
      })
      .getRawMany();

    const giftRecommendation = this.getGiftRecommendation();

    return _.uniq([
      ..._.map([...gifts, ...giftRedemptionHistories], 'title'),
      ...giftRecommendation,
    ]).sort();
  }
}
