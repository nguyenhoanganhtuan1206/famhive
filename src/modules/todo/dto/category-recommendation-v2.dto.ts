import { ApiProperty } from '@nestjs/swagger';

import { RecommendedCategoryDto } from './recommended-category.dto';

export class CategoryRecommendationV2Dto {
  @ApiProperty()
  specialCategoryName: string;

  @ApiProperty({
    isArray: true,
    type: RecommendedCategoryDto,
  })
  categories: RecommendedCategoryDto[];

  constructor(data) {
    this.specialCategoryName = data.specialCategoryName;
    this.categories = data.categories;
  }
}
