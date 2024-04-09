import { Body, Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Transactional } from 'typeorm-transactional';

import { RoleType } from '../../constants';
import { Auth, AuthUser, UUIDParam } from '../../decorators';
import { Translate } from '../../decorators/translate.decorator';
import { UserEntity } from '../user/user.entity';
import { CreateOptionDto } from './dto/option/create-option.dto';
import { OptionDto } from './dto/option/option.dto';
import { CreateQuestionDto } from './dto/question/create-question.dto';
import { QuestionDto } from './dto/question/question.dto';
import { UpdateQuestionDto } from './dto/question/update-question.dto';
import { OptionService } from './services/option.service';
import { QuestionService } from './services/question.service';

@ApiTags('questions')
@Controller('questions')
export class QuestionController {
  constructor(
    private readonly questionService: QuestionService,
    private readonly optionService: OptionService,
  ) {}

  @Post()
  @ApiOperation({ description: 'Create a question' })
  @ApiOkResponse({
    type: QuestionDto,
  })
  @Auth([RoleType.SUPERUSER])
  async create(@Body() createQuestionDto: CreateQuestionDto) {
    return new QuestionDto(
      await this.questionService.create(createQuestionDto),
    );
  }

  @Post('import')
  @ApiOperation({ description: 'Import multiple questions' })
  @ApiOkResponse({
    type: [QuestionDto],
  })
  @ApiBody({ type: [CreateQuestionDto] })
  @Auth([RoleType.SUPERUSER])
  async import(@Body() createQuestionDtos: CreateQuestionDto[]) {
    return Promise.all(createQuestionDtos.map((x) => this.create(x)));
  }

  @Get('all')
  @ApiOperation({ description: 'Get all questions - For backoffice' })
  @ApiOkResponse({
    type: [QuestionDto],
  })
  @Auth([RoleType.SUPERUSER])
  async findAll() {
    const questions = await this.questionService.findAll();

    return questions.toDtos();
  }

  @Get()
  @ApiOperation({ description: 'Get list questions for user' })
  @ApiOkResponse({
    type: [QuestionDto],
  })
  @Auth([RoleType.SUPERUSER, RoleType.ADMIN, RoleType.SPOUSE])
  @Translate('questions', 'name')
  async findQuestionsForUser() {
    const questions = await this.questionService.findQuestionsForUser();

    return questions.toDtos();
  }

  @Get('unanswered')
  @ApiOperation({ description: 'Get unanswered questions' })
  @ApiOkResponse({
    type: [QuestionDto],
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.SUPERUSER])
  async findUnanswered(@AuthUser() user: UserEntity) {
    const questions = await this.questionService.findUnanswered(user);

    return questions.toDtos();
  }

  @Get(':id')
  @ApiOperation({ description: 'Get a specific question by id' })
  @ApiOkResponse({
    type: QuestionDto,
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.SUPERUSER])
  async findOne(@UUIDParam('id') id: Uuid) {
    return new QuestionDto(await this.questionService.findOneOrFail(id));
  }

  @Post(':id/options')
  @ApiOperation({ description: 'Add an option to the question' })
  @ApiOkResponse({
    type: OptionDto,
  })
  @Auth([RoleType.SUPERUSER])
  @Transactional()
  async addOption(
    @UUIDParam('id') id: Uuid,
    @Body() createOptionDto: CreateOptionDto,
  ) {
    await this.questionService.findOneOrFail(id);

    return new OptionDto(
      await this.optionService.create({
        ...createOptionDto,
        questionId: id,
      }),
    );
  }

  @Put(':id')
  @ApiOperation({ description: 'Update a question' })
  @Auth([RoleType.SUPERUSER])
  async update(
    @UUIDParam('id') id: Uuid,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ) {
    await this.questionService.update(id, updateQuestionDto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete a question' })
  @Auth([RoleType.SUPERUSER])
  remove(@UUIDParam('id') id: Uuid) {
    return this.questionService.remove(id);
  }
}
