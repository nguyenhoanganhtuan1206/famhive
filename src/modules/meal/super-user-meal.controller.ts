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
import { Auth, UUIDParam } from '../../decorators';
import CreateMealDto from './dto/create-meal.dto';
import MealDto from './dto/meal.dto';
import UpdateMealDto from './dto/update-meal.dto';
import { SuperUserMealService } from './super-user-meal.service';

@Controller('super-user/meals')
@ApiTags('super-user/meals')
export class SuperUserMealController {
  constructor(private readonly superUserMealService: SuperUserMealService) {}

  @Get()
  @Auth([RoleType.SUPERUSER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get meal list' })
  @ApiOkResponse({
    type: String,
    isArray: true,
  })
  getMeals(): Promise<string[]> {
    return this.superUserMealService.getMany();
  }

  @Get(':id')
  @Auth([RoleType.SUPERUSER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get meal by id' })
  @ApiOkResponse({
    type: MealDto,
  })
  async getMeal(@UUIDParam('id') id: Uuid): Promise<MealDto> {
    const meal = await this.superUserMealService.getOne(id);

    return meal.toDto();
  }

  @Post()
  @Auth([RoleType.SUPERUSER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Create a meal' })
  @ApiOkResponse({
    type: MealDto,
  })
  async createMeal(
    @Body()
    createMealDto: CreateMealDto,
  ): Promise<MealDto> {
    const meal = await this.superUserMealService.create(createMealDto);

    return meal.toDto();
  }

  @Patch(':id')
  @Auth([RoleType.SUPERUSER])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Update a meal' })
  @ApiOkResponse({
    type: MealDto,
  })
  async updateMeal(
    @UUIDParam('id') id: Uuid,
    @Body()
    updateMealDto: UpdateMealDto,
  ): Promise<MealDto> {
    const meal = await this.superUserMealService.update(id, updateMealDto);

    return new MealDto(meal);
  }

  @Delete(':id')
  @Auth([RoleType.SUPERUSER])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ description: 'Delete a meal' })
  async deleteMeal(@UUIDParam('id') id: Uuid) {
    await this.superUserMealService.delete(id);
  }
}
