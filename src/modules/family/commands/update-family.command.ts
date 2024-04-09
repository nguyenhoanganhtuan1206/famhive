import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FamilyEntity } from '../entities/family.entity';

export class UpdateFamilyCommand implements ICommand {
  constructor(public family: FamilyEntity) {}
}

@CommandHandler(UpdateFamilyCommand)
export class UpdateFamilyCommandHandler
  implements ICommandHandler<UpdateFamilyCommand, FamilyEntity>
{
  constructor(
    @InjectRepository(FamilyEntity)
    private familyRepository: Repository<FamilyEntity>,
  ) {}

  async execute(command: UpdateFamilyCommand) {
    return this.familyRepository.save(command.family);
  }
}
