import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type { FindOptionsWhere } from 'typeorm/find-options/FindOptionsWhere';

import { FamilyEntity } from '../entities/family.entity';

export class FindFamilyCommand implements ICommand {
  constructor(public where: FindOptionsWhere<FamilyEntity>) {}
}

@CommandHandler(FindFamilyCommand)
export class FindFamilyCommandHandler
  implements ICommandHandler<FindFamilyCommand, FamilyEntity | null>
{
  constructor(
    @InjectRepository(FamilyEntity)
    private familyRepository: Repository<FamilyEntity>,
  ) {}

  async execute(command: FindFamilyCommand) {
    return this.familyRepository.findOneBy(command.where);
  }
}
