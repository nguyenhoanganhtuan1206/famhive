import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DishEntity } from '../entities/dish.entity';

@Injectable()
export class DishService {
  constructor(
    @InjectRepository(DishEntity)
    private readonly dishRepository: Repository<DishEntity>,
  ) {}

  async create(dish: Partial<DishEntity>) {
    return this.dishRepository.save(
      this.dishRepository.create({
        ...dish,
        ingredients: [],
      }),
    );
  }

  async findAllEnabled() {
    return this.dishRepository.find({
      where: {
        enabled: true,
      },
      relations: {
        ingredients: true,
      },
    });
  }

  async findAll() {
    return this.dishRepository.find({
      relations: {
        ingredients: true,
      },
    });
  }

  async findOneOrFail(id: Uuid) {
    return this.dishRepository.findOneOrFail({
      where: { id },
      relations: {
        ingredients: true,
      },
    });
  }

  async update(id: Uuid, dish: Partial<DishEntity>) {
    const existing = await this.findOneOrFail(id);

    await this.dishRepository.save({
      ...existing,
      ...dish,
      id,
    });
  }

  async remove(id: Uuid) {
    const existing = await this.findOneOrFail(id);
    await this.dishRepository.remove(existing);
  }
}
