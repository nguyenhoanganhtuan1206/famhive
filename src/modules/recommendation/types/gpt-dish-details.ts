import type { CreateIngredientDto } from '../dto/ingredients/create-ingredient.dto';

export interface IGPTDishDetails {
  dishName: string;
  ingredients: CreateIngredientDto[];
  instructions: string;
}
