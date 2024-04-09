import { PartialType } from '@nestjs/swagger';

import { CreateTodoCategoryDto } from './create-todo-category.dto';

export class UpdateTodoCategoryDto extends PartialType(CreateTodoCategoryDto) {}
