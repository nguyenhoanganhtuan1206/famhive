import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { ILike, LessThanOrEqual, Repository } from 'typeorm';
import { MoreThanOrEqual } from 'typeorm/find-options/operator/MoreThanOrEqual';

import { removeEmptyQuery } from '../../common/utils';
import { DiscountSubscriptionPlanType } from './constants/discount-subscription-plan-type';
import type { CreateDiscountDto } from './dto/create-discount.dto';
import type { GetDiscountsDto } from './dto/get-discounts.dto';
import { DiscountEntity } from './entities/discount.entity';

@Injectable()
export class DiscountService {
  constructor(
    @InjectRepository(DiscountEntity)
    private readonly discountRepository: Repository<DiscountEntity>,
  ) {}

  async findAll(getDiscountsDto: GetDiscountsDto) {
    const discounts = await this.discountRepository.find({
      where: this.getFindDiscountsOptions(getDiscountsDto),
    });

    return discounts.toDtos();
  }

  async findOne(id: Uuid) {
    const discount = await this.findByIdOrFail(id);

    return discount.toDto();
  }

  async create(createDiscountDto: CreateDiscountDto) {
    const discount = await this.discountRepository.save(
      this.discountRepository.create(createDiscountDto),
    );

    return discount.toDto();
  }

  async update(id: Uuid, updateDiscountDto: Partial<CreateDiscountDto>) {
    const discount = await this.findByIdOrFail(id);

    await this.discountRepository.save({ ...discount, ...updateDiscountDto });
  }

  async delete(id: Uuid) {
    const discount = await this.findByIdOrFail(id);

    await this.discountRepository.remove(discount);
  }

  async getCurrent() {
    const now = new Date();
    const discountEntity = await this.discountRepository.findBy({
      enabled: true,
      startDateTime: LessThanOrEqual(now),
      endDateTime: MoreThanOrEqual(now),
    });

    return discountEntity.toDtos();
  }

  private async findByIdOrFail(id: Uuid) {
    return this.discountRepository.findOneByOrFail({
      id,
    });
  }

  private getFindDiscountsOptions(getDiscountsDto: GetDiscountsDto) {
    const options: FindOptionsWhere<DiscountEntity> = {
      name: getDiscountsDto.q && ILike(`%${getDiscountsDto.q}%`),
      startDateTime:
        getDiscountsDto.fromDate && MoreThanOrEqual(getDiscountsDto.fromDate),
      endDateTime:
        getDiscountsDto.toDate && LessThanOrEqual(getDiscountsDto.toDate),
      subscriptionPlan: this.getSubscriptionPlanQuery(
        getDiscountsDto.subscriptionPlan,
      ),
    };

    return removeEmptyQuery(options);
  }

  private getSubscriptionPlanQuery(
    subscriptionPlan: DiscountSubscriptionPlanType | undefined,
  ) {
    if (subscriptionPlan === DiscountSubscriptionPlanType.All) {
      return;
    }

    return subscriptionPlan;
  }
}
