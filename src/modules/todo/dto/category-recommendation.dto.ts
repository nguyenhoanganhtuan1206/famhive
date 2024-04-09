import { ApiProperty } from '@nestjs/swagger';

export class CategoryRecommendationDto {
  @ApiProperty()
  categoryName: string;

  @ApiProperty()
  tasks: string[];

  constructor(data) {
    this.categoryName = data.categoryName;
    this.tasks = data.tasks;
  }
}
