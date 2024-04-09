import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth } from '../../decorators';
import { DiscountService } from './discount.service';
import { CreateDiscountDto } from './dto/create-discount.dto';
import { DiscountDto } from './dto/discount.dto';
import { GetDiscountsDto } from './dto/get-discounts.dto';

@Controller('discounts')
@ApiTags('discounts')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  @Get()
  @Auth([RoleType.SUPERUSER])
  @ApiOperation({ description: 'Get discounts' })
  @ApiOkResponse({
    type: [DiscountDto],
  })
  findAll(@Query() getDiscountsDto: GetDiscountsDto) {
    return this.discountService.findAll(getDiscountsDto);
  }

  @Get('current')
  @Auth([RoleType.SUPERUSER, RoleType.ADMIN, RoleType.SPOUSE, RoleType.KID])
  @ApiOperation({ description: 'Get current active discount' })
  getCurrent() {
    return this.discountService.getCurrent();
  }

  @Get(':id')
  @Auth([RoleType.SUPERUSER])
  @ApiOperation({ description: 'Get a discount by id' })
  @ApiOkResponse({
    type: DiscountDto,
  })
  findOne(@Param('id') id: Uuid) {
    return this.discountService.findOne(id);
  }

  @Post()
  @Auth([RoleType.SUPERUSER])
  @ApiOperation({ description: 'create a discount' })
  @ApiCreatedResponse({
    type: DiscountDto,
  })
  create(@Body() createDiscountDto: CreateDiscountDto) {
    return this.discountService.create(createDiscountDto);
  }

  @Patch(':id')
  @Auth([RoleType.SUPERUSER])
  @ApiOperation({ description: 'update a discount' })
  update(
    @Param('id') id: Uuid,
    @Body() updateDiscountDto: Partial<CreateDiscountDto>,
  ) {
    return this.discountService.update(id, updateDiscountDto);
  }

  @Delete(':id')
  @Auth([RoleType.SUPERUSER])
  @ApiOperation({ description: 'Delete a discount' })
  delete(@Param('id') id: Uuid) {
    return this.discountService.delete(id);
  }
}
