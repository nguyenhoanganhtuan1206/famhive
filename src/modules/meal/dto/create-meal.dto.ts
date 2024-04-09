import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export default class CreateMealDto {
  @ApiProperty()
  @IsString()
  name: string;
}
