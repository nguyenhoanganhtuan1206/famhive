import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import _ from 'lodash';
import type { UserEntity } from 'modules/user/user.entity';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { Repository } from 'typeorm';

import type { CreateQuestionDto } from '../dto/question/create-question.dto';
import { AnswerEntity } from '../entities/answer.entity';
import { OptionEntity } from '../entities/option.entity';
import { QuestionEntity } from '../entities/question.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepository: Repository<QuestionEntity>,
    @InjectRepository(OptionEntity)
    private readonly optionRepository: Repository<OptionEntity>,
    @InjectRepository(AnswerEntity)
    private readonly userAnswerRepository: Repository<AnswerEntity>,
    private readonly i18nService: I18nService,
  ) {}

  async create(createQuestionDto: CreateQuestionDto) {
    // eslint-disable-next-line unicorn/consistent-function-scoping
    const createOption = (option: string) =>
      this.optionRepository.create({
        name: option,
      });

    return this.questionRepository.save(
      this.questionRepository.create({
        name: createQuestionDto.name,
        enabled: createQuestionDto.enabled,
        type: createQuestionDto.type,
        options: createQuestionDto.options.map((element) =>
          createOption(element),
        ),
      }),
    );
  }

  async findAllEnabled() {
    return this.questionRepository.find({
      where: {
        enabled: true,
      },
      relations: {
        options: true,
      },
    });
  }

  async findAll() {
    return this.questionRepository.find({
      relations: {
        options: true,
      },
    });
  }

  async findQuestionsForUser() {
    const questions = await this.questionRepository.find({
      relations: {
        options: true,
      },
      where: {
        enabled: true,
      },
    });

    return questions.map((question) => {
      question.options = question.options.map((option) => {
        option.name = this.i18nService.t(
          `questions.${_.snakeCase(option.name)}`,
          {
            lang: I18nContext.current()?.lang,
            defaultValue: option.name,
          },
        );

        return option;
      });

      return question;
    });
  }

  async findOneOrFail(id: Uuid) {
    return this.questionRepository.findOneOrFail({
      where: { id },
      relations: {
        options: true,
      },
    });
  }

  async findUnanswered(user: UserEntity) {
    const userAnswers = await this.userAnswerRepository.findBy({
      familyId: user.familyId,
    });

    const answeredQuestions = new Set(userAnswers.map((a) => a.questionId));

    const enabledQuestions = await this.findAllEnabled();

    return enabledQuestions.filter((q) => !answeredQuestions.has(q.id));
  }

  async update(id: Uuid, dish: Partial<QuestionEntity>) {
    const existing = await this.findOneOrFail(id);

    await this.questionRepository.save({
      ...existing,
      ...dish,
      id,
    });
  }

  async remove(id: Uuid) {
    await this.questionRepository.remove(await this.findOneOrFail(id));
  }
}
