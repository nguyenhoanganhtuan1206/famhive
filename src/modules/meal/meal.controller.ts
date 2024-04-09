import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser, UUIDParam } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import CreateMealDto from './dto/create-meal.dto';
import MealDto from './dto/meal.dto';
import UpdateMealDto from './dto/update-meal.dto';
import { UserMealService } from './user.meal.service';

@Controller('meals')
@ApiTags('meals')
export class MealController {
  constructor(private readonly userMealService: UserMealService) {}

  @Get()
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.KID])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get meal list' })
  @ApiOkResponse({
    type: String,
    isArray: true,
  })
  getMeals(@AuthUser() user: UserEntity): Promise<string[]> {
    return this.userMealService.getMany(user.familyId);
  }

  @Get(':id')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.KID])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get meal by id' })
  @ApiOkResponse({
    type: MealDto,
  })
  async getMeal(
    @UUIDParam('id') id: Uuid,
    @AuthUser() user: UserEntity,
  ): Promise<MealDto> {
    const meal = await this.userMealService.getOne(id, user.familyId);

    return meal.toDto();
  }

  @Post()
  @Auth([RoleType.ADMIN, RoleType.SPOUSE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Create a meal' })
  @ApiOkResponse({
    type: MealDto,
  })
  async createMeal(
    @AuthUser() user: UserEntity,
    @Body()
    createMealDto: CreateMealDto,
  ): Promise<MealDto> {
    const meal = await this.userMealService.create(
      user.familyId,
      createMealDto,
    );

    return meal.toDto();
  }

  @Patch(':id')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Update a meal' })
  @ApiOkResponse({
    type: MealDto,
  })
  async updateMeal(
    @UUIDParam('id') id: Uuid,
    @AuthUser() user: UserEntity,
    @Body()
    updateMealDto: UpdateMealDto,
  ): Promise<MealDto> {
    const meal = await this.userMealService.update(
      id,
      user.familyId,
      updateMealDto,
    );

    return new MealDto(meal);
  }

  @Delete(':id')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ description: 'Delete a meal' })
  async deleteMeal(@UUIDParam('id') id: Uuid, @AuthUser() user: UserEntity) {
    await this.userMealService.delete(id, user.familyId);
  }
}
