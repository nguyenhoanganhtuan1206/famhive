import { Body, Controller, Delete, Put } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, UUIDParam } from '../../decorators';
import { UpdateOptionDto } from './dto/option/update-option.dto';
import { OptionService } from './services/option.service';

@Controller('options')
@ApiTags('options')
export class OptionController {
  constructor(private readonly optionService: OptionService) {}

  @Put(':id')
  @ApiOperation({ description: 'Update an option' })
  @Auth([RoleType.SUPERUSER])
  async update(
    @UUIDParam('id') id: Uuid,
    @Body() updateAnswerDto: UpdateOptionDto,
  ) {
    await this.optionService.update(id, updateAnswerDto);
  }

  @Delete(':id')
  @ApiOperation({ description: 'Delete an option' })
  @Auth([RoleType.SUPERUSER])
  remove(@UUIDParam('id') id: Uuid) {
    return this.optionService.remove(id);
  }
}
