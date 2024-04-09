import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '../../../common/abstract.entity';
import { UseDto } from '../../../decorators';
import { OptionDto } from '../dto/option/option.dto';
import { QuestionEntity } from './question.entity';

@Entity('options')
@UseDto(OptionDto)
export class OptionEntity extends AbstractEntity<OptionDto> {
  @Column()
  name: string;

  @Column()
  questionId: Uuid;

  @ManyToOne(() => QuestionEntity, (question) => question.options, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ foreignKeyConstraintName: 'option_question_fk' })
  question: QuestionEntity;
}
