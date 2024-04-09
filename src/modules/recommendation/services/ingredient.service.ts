import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IngredientEntity } from '../entities/ingredient.entity';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(IngredientEntity)
    private readonly ingredientRepository: Repository<IngredientEntity>,
  ) {}

  async create(dish: Partial<IngredientEntity>) {
    return this.ingredientRepository.save(
      this.ingredientRepository.create({
        ...dish,
      }),
    );
  }

  async findOne(id: Uuid) {
    return this.ingredientRepository.findOneByOrFail({ id });
  }

  async update(id: Uuid, dish: Partial<IngredientEntity>) {
    const existing = await this.findOne(id);

    await this.ingredientRepository.save({
      ...existing,
      ...dish,
      id,
    });
  }

  async remove(id: Uuid) {
    await this.ingredientRepository.remove(await this.findOne(id));
  }
}
