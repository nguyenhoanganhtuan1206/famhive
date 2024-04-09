import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';
import { DiscountEntity } from './entities/discount.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiscountEntity])],
  controllers: [DiscountController],
  providers: [DiscountService],
})
export class DiscountModule {}
