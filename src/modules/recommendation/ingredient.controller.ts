import { Body, Controller, Delete, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, UUIDParam } from '../../decorators';
import { UpdateIngredientDto } from './dto/ingredients/update-ingredient.dto';
import { IngredientService } from './services/ingredient.service';

@Controller('ingredients')
@ApiTags('ingredients')
export class IngredientController {
  constructor(private readonly ingredientService: IngredientService) {}

  @Put(':id')
  @ApiOperation({ description: 'Update a ingredient' })
  @Auth([RoleType.SUPERUSER])
  async update(
    @UUIDParam('id') id: Uuid,
    @Body() updateIngredientDto: UpdateIngredientDto,
  ) {
    await this.ingredientService.update(id, updateIngredientDto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete a ingredient' })
  @Auth([RoleType.SUPERUSER])
  remove(@UUIDParam('id') id: Uuid) {
    return this.ingredientService.remove(id);
  }
}
