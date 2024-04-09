import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { LangCode } from '../../../constants';
import { UseDto } from '../../../decorators';
import { DishDto } from '../dto/dishes/dish.dto';
import { IngredientEntity } from './ingredient.entity';

@Entity('dishes')
@UseDto(DishDto)
export class DishEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column({ default: '' })
  instructions: string;

  @Column({ default: LangCode.EN })
  language: LangCode;

  @Column()
  enabled: boolean;

  @OneToMany(() => IngredientEntity, (ingredient) => ingredient.dish, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  ingredients: IngredientEntity[];
}
