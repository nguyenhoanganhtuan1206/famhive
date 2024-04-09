import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { IngredientDto } from '../dto/ingredients/ingredient.dto';
import { DishEntity } from './dish.entity';

@Entity('ingredients')
@UseDto(IngredientDto)
export class IngredientEntity extends AbstractEntity {
  @Column()
  name: string;

  @Column({ default: '' })
  unit: string;

  @Column({ default: '1' })
  quantity: string;

  @Column()
  dishId: Uuid;

  @ManyToOne(() => DishEntity, (dishEntity) => dishEntity.ingredients, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ foreignKeyConstraintName: 'dish_ingredient_fk' })
  dish: DishEntity;
}
