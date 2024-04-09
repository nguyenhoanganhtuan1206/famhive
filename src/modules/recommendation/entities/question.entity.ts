import { Column, Entity, JoinColumn, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { QuestionDto } from '../dto/question/question.dto';
import { OptionEntity } from './option.entity';
import { QuestionType } from './question-type';

@Entity('questions')
@UseDto(QuestionDto)
export class QuestionEntity extends AbstractEntity<QuestionDto> {
  @Column()
  name: string;

  @Column()
  enabled: boolean;

  @Column({
    type: 'enum',
    enum: QuestionType,
    default: QuestionType.SINGLE_CHOICE,
  })
  type: QuestionType;

  @OneToMany(() => OptionEntity, (option) => option.question, {
    cascade: ['insert', 'update', 'remove'],
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn()
  options: OptionEntity[];
}
