import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { FamilyEntity } from '../../family/entities/family.entity';
import MealDto from '../dto/meal.dto';

@Entity('meals')
@UseDto(MealDto)
export class MealEntity extends AbstractEntity<MealDto> {
  @Column()
  name: string;

  @Column({ nullable: true })
  familyId?: Uuid;

  @ManyToOne(() => FamilyEntity, (family) => family.meals, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    foreignKeyConstraintName: 'fk_meal_family',
  })
  family: FamilyEntity;
}
