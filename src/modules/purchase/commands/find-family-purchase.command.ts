import { BadRequestException } from '@nestjs/common';
import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { ILike, Repository } from 'typeorm';

import type { PurchaseInfoDto } from '../dto/purchase-info.dto';
import { PurchaseEntity } from '../entities/purchase.entity';
import type { PageDto } from './../../../common/dto/page.dto';
import type { PurchasePageOptionsDto } from './../dto/purchase-page-options.dto';

export class FindFamilyPurchaseCommand implements ICommand {
  constructor(
    public familyId: Uuid,
    public pageOptions: PurchasePageOptionsDto,
  ) {}
}

@CommandHandler(FindFamilyPurchaseCommand)
export class FindFamilyPurchaseCommandHandler
  implements
    ICommandHandler<FindFamilyPurchaseCommand, PageDto<PurchaseInfoDto>>
{
  constructor(
    @InjectRepository(PurchaseEntity)
    private purchaseRepository: Repository<PurchaseEntity>,
  ) {}

  async execute(command: FindFamilyPurchaseCommand) {
    const queryBuilder = this.purchaseRepository
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.family', 'family');

    const {
      product,
      q: queryStr,
      order,
      orderKey = 'createdAt',
    } = command.pageOptions;

    const acceptanceOrderKeys = ['createdAt', 'updatedAt', 'productId'];

    if (orderKey && !acceptanceOrderKeys.includes(orderKey)) {
      throw new BadRequestException(
        `Order key allows one of the values: ${acceptanceOrderKeys.join(', ')}`,
      );
    }

    queryBuilder.andWhere({
      family: {
        id: command.familyId,
      },
    });

    if (queryStr) {
      queryBuilder.andWhere({
        productId: ILike(`%${queryStr}%`),
      });
    }

    if (product) {
      queryBuilder.andWhere({
        productId: product,
      });
    }

    queryBuilder.orderBy(`purchase.${orderKey}`, order);
    const [items, pageMetaDto] = await queryBuilder.paginate(
      command.pageOptions,
    );

    return {
      data: items.toDtos(),
      meta: pageMetaDto,
    };
  }
}
