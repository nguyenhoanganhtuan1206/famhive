import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import type { FindOptionsWhere } from 'typeorm';
import { Repository } from 'typeorm';

import { PurchaseEntity } from '../entities/purchase.entity';

export class FindFamilyInPurchaseCommand implements ICommand {
  constructor(public where: FindOptionsWhere<PurchaseEntity>) {}
}

@CommandHandler(FindFamilyInPurchaseCommand)
export class FindFamilyInPurchaseCommandHandler
  implements
    ICommandHandler<FindFamilyInPurchaseCommand, PurchaseEntity | null>
{
  constructor(
    @InjectRepository(PurchaseEntity)
    private purchaseRepository: Repository<PurchaseEntity>,
  ) {}

  async execute(command: FindFamilyInPurchaseCommand) {
    const queryBuilder = this.purchaseRepository
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.family', 'family')
      .where(command.where)
      .orderBy('purchase.created_at', 'DESC');

    return queryBuilder.getOne();
  }
}
