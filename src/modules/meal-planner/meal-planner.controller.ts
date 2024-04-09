import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser, UUIDParam } from '../../decorators';
import { UserEntity } from '../../modules/user/user.entity';
import CreateMealPlannerDto from './dto/create-meal-planner.dto';
import { GetMealPlannersDto } from './dto/get-meal-planners.dto';
import MealPlannerDto from './dto/meal-planner.dto';
import UpdateMealPlannerDto from './dto/update-meal-planner.dto';
import { MealPlannerService } from './meal-planner.service';

@Controller('meal-planners')
@ApiTags('meal-planners')
export class MealPlannerController {
  constructor(private readonly mealPlannerService: MealPlannerService) {}

  @Get()
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.KID])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get meal planner list' })
  @ApiOkResponse({
    type: MealPlannerDto,
    isArray: true,
  })
  async getMealPlanners(
    @AuthUser() user: UserEntity,
    @Query()
    getMealPlannersDto: GetMealPlannersDto,
  ): Promise<MealPlannerDto[]> {
    const mealPLanners = await this.mealPlannerService.getMealPlanners(
      user.familyId,
      getMealPlannersDto,
    );

    return mealPLanners.toDtos();
  }

  @Get(':id')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE, RoleType.KID])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Get meal planner by id' })
  @ApiOkResponse({
    type: MealPlannerDto,
  })
  async getMealPlanner(
    @UUIDParam('id') id: Uuid,
    @AuthUser() user: UserEntity,
  ): Promise<MealPlannerDto> {
    const mealPLanner = await this.mealPlannerService.getMealPlanner(
      id,
      user.familyId,
    );

    return mealPLanner.toDto();
  }

  @Post()
  @Auth([RoleType.ADMIN, RoleType.SPOUSE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Create a meal planner' })
  @ApiOkResponse({
    type: MealPlannerDto,
  })
  async createMealPlanner(
    @AuthUser() user: UserEntity,
    @Body()
    createMealPlannerDto: CreateMealPlannerDto,
  ): Promise<MealPlannerDto> {
    const mealPlanner = await this.mealPlannerService.create(
      user.familyId,
      createMealPlannerDto,
    );

    return mealPlanner.toDto();
  }

  @Patch(':id')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE])
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ description: 'Update a meal planner' })
  @ApiOkResponse({
    type: MealPlannerDto,
  })
  async updateMealPlanner(
    @UUIDParam('id') id: Uuid,
    @AuthUser() user: UserEntity,
    @Body()
    updateMealPlannerDto: UpdateMealPlannerDto,
  ): Promise<MealPlannerDto> {
    const mealPlanner = await this.mealPlannerService.update(
      id,
      user.familyId,
      updateMealPlannerDto,
    );

    return new MealPlannerDto(mealPlanner);
  }

  @Delete(':id')
  @Auth([RoleType.ADMIN, RoleType.SPOUSE])
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ description: 'Delete a meal planner' })
  async deleteMealPlanner(
    @UUIDParam('id') id: Uuid,
    @AuthUser() user: UserEntity,
  ) {
    await this.mealPlannerService.delete(id, user.familyId);
  }
}
