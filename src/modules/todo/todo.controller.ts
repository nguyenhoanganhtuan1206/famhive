import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser, UUIDParam } from '../../decorators';
import { Translate } from '../../decorators/translate.decorator';
import { UserEntity } from '../user/user.entity';
import { ParamTodoType } from './decorators';
import { CreateTodoDto } from './dto/create-todo.dto';
import { TodoDto } from './dto/todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { TodoService } from './todo.service';
import { TodoType } from './types/todo.type';

@Controller('todos')
@ApiTags('todos')
export class TodoController {
  constructor(private readonly todosService: TodoService) {}

  @Post()
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  @ApiOperation({ description: 'Create a todo' })
  @ApiOkResponse({
    type: TodoDto,
  })
  create(@AuthUser() user: UserEntity, @Body() createTodoDto: CreateTodoDto) {
    return this.todosService.create(user, createTodoDto);
  }

  @Post('/create-many')
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  @ApiOperation({ description: 'Create many todos at once' })
  @ApiOkResponse({
    type: [TodoDto],
  })
  @ApiBody({ type: [CreateTodoDto] })
  createMany(
    @AuthUser() user: UserEntity,
    @Body() createTodoDtos: CreateTodoDto[],
  ) {
    return Promise.all(
      createTodoDtos.map((x) => this.todosService.create(user, x)),
    );
  }

  @Get()
  @ApiOperation({ description: 'Get all todos' })
  @ApiOkResponse({
    type: [TodoDto],
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  @Translate('todos', 'text')
  findAll(@AuthUser() user: UserEntity) {
    return this.todosService.findAll(user);
  }

  @Get('overdue')
  @ApiOperation({ description: 'Get all overdue todos' })
  @ApiOkResponse({
    type: [TodoDto],
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  @Translate('todos', 'text')
  findOverdue(@AuthUser() user: UserEntity) {
    return this.todosService.findOverdue(user);
  }

  @Get('buys')
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  @ApiOperation({ description: 'Get all buys' })
  @ApiOkResponse({
    type: [TodoDto],
  })
  @Translate('todos', 'text')
  findBuys(@AuthUser() user: UserEntity) {
    return this.todosService.findAllByType(user, TodoType.BUY);
  }

  @Get('tasks')
  @ApiOperation({ description: 'Get all tasks' })
  @ApiOkResponse({
    type: [TodoDto],
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  @Translate('todos', 'text')
  findTasks(@AuthUser() user: UserEntity) {
    return this.todosService.findAllByType(user, TodoType.TASK);
  }

  @Get('suggestion/tasks')
  @ApiOperation({ description: 'Suggest task names' })
  @ApiOkResponse({
    type: [String],
  })
  @ApiQuery({
    name: 'textSearch',
    type: String,
    required: false,
    description: `ignore 'textSearch' if you want to get all suggestion names`,
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  suggestTaskNames(
    @AuthUser() user: UserEntity,
    @Query('textSearch') textSearch?: string,
  ) {
    return this.todosService.suggestNames(user, TodoType.TASK, textSearch);
  }

  @Get('suggestion/buys')
  @ApiOperation({ description: 'Suggest buy names' })
  @ApiOkResponse({
    type: [String],
  })
  @ApiQuery({
    name: 'textSearch',
    type: String,
    required: false,
    description: `ignore 'textSearch' if you want to get all suggestion names`,
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  suggestBuyNames(
    @AuthUser() user: UserEntity,
    @Query('textSearch') textSearch?: string,
  ) {
    return this.todosService.suggestShoppingList(user, textSearch);
  }

  @Get(':id')
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  @ApiOperation({ description: 'Get a todo by id' })
  @ApiOkResponse({
    type: TodoDto,
  })
  @Translate('todos', 'text')
  findOne(@AuthUser() user: UserEntity, @UUIDParam('id') id: Uuid) {
    return this.todosService.findOne(user, id);
  }

  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  @Patch('check-all/:type')
  @ApiOperation({ description: 'Check all todos by type' })
  @ApiParam({
    name: 'type',
    enum: TodoType,
  })
  checkAllTodosByType(
    @AuthUser() user: UserEntity,
    @ParamTodoType() type: TodoType,
  ) {
    return this.todosService.checkAllTodos(user, type);
  }

  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  @Patch('un-check-all/:type')
  @ApiOperation({ description: 'Un-check all todos by type' })
  @ApiParam({
    name: 'type',
    enum: TodoType,
  })
  unCheckAllTodosByType(
    @AuthUser() user: UserEntity,
    @ParamTodoType() type: TodoType,
  ) {
    return this.todosService.uncheckAllTodos(user, type);
  }

  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  @Patch(':id')
  @ApiOperation({ description: 'Update a todo by id' })
  @ApiOkResponse({
    type: TodoDto,
  })
  update(
    @AuthUser() user: UserEntity,
    @UUIDParam('id') id: Uuid,
    @Body() updateTodoDto: UpdateTodoDto,
  ) {
    if (user.role === RoleType.KID) {
      return this.todosService.updateByKid(user, id, updateTodoDto);
    }

    return this.todosService.update(user, id, updateTodoDto);
  }

  @Delete('done/:type')
  @ApiOperation({ description: 'Delete todos done by type' })
  @ApiParam({
    name: 'type',
    enum: TodoType,
  })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  removeTodosDone(
    @AuthUser() user: UserEntity,
    @ParamTodoType() type: TodoType,
  ) {
    return this.todosService.removeTodosDoneByType(user, type);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete a todo' })
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  remove(@AuthUser() user: UserEntity, @UUIDParam('id') id: Uuid) {
    return this.todosService.remove(user, id);
  }

  // dev test
  @Post('send')
  @Auth([RoleType.SUPERUSER])
  sendOverdueTasks() {
    return this.todosService.sendOverdueTasksToCorrespondingEmail();
  }
}
