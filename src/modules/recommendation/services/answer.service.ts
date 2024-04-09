import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import type { UserEntity } from '../../user/user.entity';
import { AnswerEntity } from '../entities/answer.entity';
import { OptionEntity } from '../entities/option.entity';
import { QuestionEntity } from '../entities/question.entity';
import { QuestionType } from '../entities/question-type';

@Injectable()
export class AnswerService {
  constructor(
    @InjectRepository(AnswerEntity)
    private readonly userAnswerRepository: Repository<AnswerEntity>,
    @InjectRepository(OptionEntity)
    private readonly optionRepository: Repository<OptionEntity>,
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
  ) {}

  async store(
    user: UserEntity,
    question: QuestionEntity,
    options: OptionEntity[],
  ) {
    return this.userAnswerRepository.save(
      this.userAnswerRepository.create({
        userId: user.id,
        familyId: user.familyId,
        questionId: question.id,
        options,
      }),
    );
  }

  async create(user: UserEntity, answerIds: Uuid[]) {
    this.validateEmptyAnswer(answerIds);
    const options = await this.findOptionsByIds(answerIds);
    const question = await this.findQuestionFromAnswers(options, answerIds);

    return this.store(user, question, options);
  }

  async update(user: UserEntity, answerIds: Uuid[]) {
    this.validateEmptyAnswer(answerIds);
    const options = await this.findOptionsByIds(answerIds);
    const question = await this.findQuestionFromAnswers(options, answerIds);
    await this.removeOldAnswer(user, question);

    return this.store(user, question, options);
  }

  private async removeOldAnswer(user: UserEntity, question: QuestionEntity) {
    const oldAnswers = await this.userAnswerRepository.find({
      where: {
        userId: user.id,
        familyId: user.familyId,
        questionId: question.id,
      },
    });

    if (oldAnswers.length > 0) {
      await this.userAnswerRepository.remove(oldAnswers);
    }
  }

  private findOptionsByIds(answerIds: Uuid[]) {
    return this.optionRepository.findBy({
      id: In(answerIds),
    });
  }

  private validateEmptyAnswer(answerIds: Uuid[]) {
    if (answerIds.length === 0) {
      throw new BadRequestException('You have to select at least an answer');
    }
  }

  private async findQuestionFromAnswers(
    options: OptionEntity[],
    answerIds: Uuid[],
  ): Promise<QuestionEntity> {
    if (options.length !== answerIds.length) {
      throw new BadRequestException(
        'Invalid answers, some answers could has been removed.',
      );
    }

    if (new Set(options.map((x) => x.questionId)).size > 1) {
      throw new BadRequestException(
        'The answers should belong to an only question.',
      );
    }

    const question = await this.questionRepository.findOneByOrFail({
      id: options[0].questionId,
    });

    if (!question.enabled) {
      throw new BadRequestException(
        'Sorry, something went wrong or this question is not ready to answer',
      );
    }

    if (question.type === QuestionType.SINGLE_CHOICE && options.length > 1) {
      throw new BadRequestException(
        "You can't select more than 1 answer for this question",
      );
    }

    return question;
  }

  async findLastAnswerDate(user: UserEntity) {
    const oldestAnswer = await this.userAnswerRepository.findOne({
      where: {
        userId: user.id,
        familyId: user.familyId,
      },
      order: {
        createdAt: 'DESC',
      },
    });

    return {
      lastAnswerDate: oldestAnswer?.createdAt,
    };
  }
}
