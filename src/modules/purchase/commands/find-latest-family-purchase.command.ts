import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { PurchaseEntity } from '../entities/purchase.entity';

export class FindLatestFamilyPurchaseCommand implements ICommand {
  constructor(public familyId: Uuid) {}
}

@CommandHandler(FindLatestFamilyPurchaseCommand)
export class FindLatestFamilyPurchaseCommandHandler
  implements
    ICommandHandler<FindLatestFamilyPurchaseCommand, PurchaseEntity | null>
{
  constructor(
    @InjectRepository(PurchaseEntity)
    private purchaseRepository: Repository<PurchaseEntity>,
  ) {}

  async execute(command: FindLatestFamilyPurchaseCommand) {
    const queryBuilder = this.purchaseRepository
      .createQueryBuilder('purchase')
      .leftJoinAndSelect('purchase.family', 'family')
      .where({
        family: {
          id: command.familyId,
        },
      })
      .orderBy('purchase.created_at', 'DESC');

    return queryBuilder.getOne();
  }
}
