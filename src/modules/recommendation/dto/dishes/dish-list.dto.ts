import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';

export class DishListDto {
  @ApiProperty()
  @IsArray()
  dishes: string[];

  constructor(dishes: string[]) {
    this.dishes = dishes;
  }
}
