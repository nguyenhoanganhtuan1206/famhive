import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UserEntity } from '../../user/user.entity';
import { OptionEntity } from './option.entity';
import { QuestionEntity } from './question.entity';

@Entity('answers')
export class AnswerEntity extends AbstractEntity {
  //-- User
  @Column()
  userId: Uuid;

  @Column()
  familyId: Uuid;

  @ManyToOne(() => UserEntity, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ foreignKeyConstraintName: 'answer_user_fk' })
  user: UserEntity;

  // -- Question (to easier for querying later)
  @Column()
  questionId: Uuid;

  @ManyToOne(() => QuestionEntity, {
    onUpdate: 'RESTRICT',
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ foreignKeyConstraintName: 'answer_question_fk' })
  question: QuestionEntity;

  // -- Answers
  @ManyToMany(() => OptionEntity, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinTable({ name: 'answer_options' })
  options: OptionEntity[];
}
