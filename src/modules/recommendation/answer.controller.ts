import { Body, Controller, Get, Patch, Post } from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { CreateAnswerDto } from './dto/answer/create-answer.dto';
import { LastAnswerDateDto } from './dto/answer/last-answer-date.dto';
import { AnswerService } from './services/answer.service';

@ApiTags('answers')
@Controller('answers')
export class AnswerController {
  constructor(private readonly answerService: AnswerService) {}

  @Post()
  @ApiOperation({ description: 'Submit an answer' })
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.SUPERUSER])
  async create(
    @AuthUser() user: UserEntity,
    @Body() createUserAnswerDto: CreateAnswerDto,
  ) {
    await this.answerService.create(user, createUserAnswerDto.optionIds);
  }

  @Post('multi')
  @ApiBody({ type: [CreateAnswerDto] })
  @ApiOperation({ description: 'Submit multiple answers' })
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.SUPERUSER])
  async createMultiple(
    @AuthUser() user: UserEntity,
    @Body() createUserAnswerDtos: CreateAnswerDto[],
  ) {
    await Promise.all(
      createUserAnswerDtos.map((dto) =>
        this.answerService.create(user, dto.optionIds),
      ),
    );
  }

  @Patch('multi')
  @ApiBody({ type: [CreateAnswerDto] })
  @ApiOperation({ description: 'Update multiple answers' })
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.SUPERUSER])
  async updateMultiple(
    @AuthUser() user: UserEntity,
    @Body() createUserAnswerDtos: CreateAnswerDto[],
  ) {
    await Promise.all(
      createUserAnswerDtos.map((dto) =>
        this.answerService.update(user, dto.optionIds),
      ),
    );
  }

  @Get('last-answer-date')
  @ApiOperation({ description: "Get time of last user's answers" })
  @ApiOkResponse({
    type: LastAnswerDateDto,
  })
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.SUPERUSER])
  findLastAnswerDate(@AuthUser() user: UserEntity) {
    return this.answerService.findLastAnswerDate(user);
  }
}
