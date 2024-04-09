import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FamilyEntity } from '../entities/family.entity';

export class DeleteFamilyCommand implements ICommand {
  constructor(public familyId: Uuid) {}
}

@CommandHandler(DeleteFamilyCommand)
export class DeleteFamilyCommandHandler
  implements ICommandHandler<DeleteFamilyCommand>
{
  constructor(
    @InjectRepository(FamilyEntity)
    private familyRepository: Repository<FamilyEntity>,
  ) {}

  async execute(command: DeleteFamilyCommand) {
    await this.familyRepository.delete(command.familyId);
  }
}
