import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FamilyEntity } from '../entities/family.entity';

export class CreateFamilyCommand implements ICommand {}

@CommandHandler(CreateFamilyCommand)
export class CreateFamilyCommandHandler
  implements ICommandHandler<CreateFamilyCommand, FamilyEntity>
{
  constructor(
    @InjectRepository(FamilyEntity)
    private familyRepository: Repository<FamilyEntity>,
  ) {}

  async execute(_command: CreateFamilyCommand) {
    return this.familyRepository.save(this.familyRepository.create());
  }
}
