import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { OptionEntity } from '../entities/option.entity';

@Injectable()
export class OptionService {
  constructor(
    @InjectRepository(OptionEntity)
    private readonly optionRepository: Repository<OptionEntity>,
  ) {}

  async create(option: Partial<OptionEntity>) {
    return this.optionRepository.save(
      this.optionRepository.create({
        ...option,
      }),
    );
  }

  async findOne(id: Uuid) {
    return this.optionRepository.findOneByOrFail({ id });
  }

  async update(id: Uuid, option: Partial<OptionEntity>) {
    const existing = await this.findOne(id);

    await this.optionRepository.save({
      ...existing,
      ...option,
      id,
    });
  }

  async remove(id: Uuid) {
    await this.optionRepository.remove(await this.findOne(id));
  }
}
