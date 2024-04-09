import { ApiProperty } from '@nestjs/swagger';

import { StringField } from '../../../decorators';

export class CreateMultipleCategoriesTasksDto {
  @ApiProperty()
  @StringField()
  categoryName: string;

  @ApiProperty({
    example: ['task name'],
    isArray: true,
  })
  @StringField({ each: true })
  tasks: string[];
}
