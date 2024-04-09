import { Column, Entity, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { ChoreEntity } from '../../../modules/chore/entities/chore.entity';
import { MealPlannerEntity } from '../..//meal-planner/entities/meal-planner.entity';
import { ContactEntity } from '../../contact/entities/contact.entity';
import { EventEntity } from '../../event/entities/event.entity';
import { MealEntity } from '../../meal/entities/meal.entity';
import { PurchaseEntity } from '../../purchase/entities/purchase.entity';
import type { IPurchaseInfo } from '../../purchase/purchase-info';
import { TodoEntity } from '../../todo/entities/todo.entity';
import { UserEntity } from '../../user/user.entity';

@Entity('families')
export class FamilyEntity extends AbstractEntity implements IPurchaseInfo {
  @OneToMany(() => UserEntity, (user) => user.family)
  members: UserEntity[];

  @OneToMany(() => TodoEntity, (todo) => todo.family)
  todos: TodoEntity[];

  @OneToMany(() => EventEntity, (event) => event.family)
  events: EventEntity[];

  @OneToMany(() => ChoreEntity, (chore) => chore.family)
  chores: ChoreEntity[];

  @OneToMany(() => PurchaseEntity, (purchase) => purchase.family, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  purchases: PurchaseEntity[];

  @OneToMany(() => ContactEntity, (contact) => contact.family)
  contacts?: ContactEntity[];

  @OneToMany(() => MealEntity, (meal) => meal.familyId)
  meals: MealEntity[];

  @OneToMany(() => MealPlannerEntity, (mealPlanner) => mealPlanner.familyId)
  mealPlanners: MealPlannerEntity[];

  @Column({ default: false })
  completedSetup: boolean;

  @Column({ nullable: true })
  transactionId?: string;

  @Column({ nullable: true })
  originalTransactionId?: string;

  @Column({ nullable: true })
  productId?: string;

  @Column({ nullable: true })
  autoRenewProductId?: string;

  @Column({ nullable: true })
  autoRenewStatus?: boolean;

  @Column({ nullable: true })
  purchaseDate?: Date;

  @Column({ nullable: true })
  originalPurchaseDate?: Date;

  @Column({ nullable: true })
  expiresDate?: Date;

  @Column({ default: 'star' })
  rewardType: string;
}
