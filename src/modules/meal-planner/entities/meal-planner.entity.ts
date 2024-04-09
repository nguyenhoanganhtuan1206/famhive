import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { FamilyEntity } from '../../../modules/family/entities/family.entity';
import { MealPlannerType } from '../constants/meal-planner-type';
import MealPlannerDto from '../dto/meal-planner.dto';

@Entity('meal-planners')
@UseDto(MealPlannerDto)
export class MealPlannerEntity extends AbstractEntity<MealPlannerDto> {
  @Column()
  date: Date;

  @Column({
    type: 'enum',
    enum: MealPlannerType,
  })
  type: MealPlannerType;

  @Column({
    type: 'varchar',
    array: true,
  })
  meals: string[];

  @Column()
  familyId: Uuid;

  @ManyToOne(() => FamilyEntity, (family) => family.mealPlanners, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({
    foreignKeyConstraintName: 'fk_meal_planner_family',
  })
  family: FamilyEntity;
}
