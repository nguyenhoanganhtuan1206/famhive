import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class VerifyReceiptDto {
  @ApiProperty()
  @IsNotEmpty()
  receiptData: string;
}
export class VerifyGooglePayReceiptDto {
  @ApiProperty()
  @IsNotEmpty()
  orderId: string;

  @ApiProperty()
  @IsNotEmpty()
  packageName: string;

  @ApiProperty()
  @IsNotEmpty()
  productId: string;

  @ApiProperty()
  @IsNotEmpty()
  purchaseTime: number;

  @ApiProperty()
  @IsNotEmpty()
  purchaseState: number;

  @ApiProperty()
  @IsNotEmpty()
  purchaseToken: string;

  @ApiProperty()
  @IsNotEmpty()
  quantity: number;

  @ApiProperty()
  @IsNotEmpty()
  autoRenewing: boolean;

  @ApiProperty()
  @IsNotEmpty()
  acknowledged: boolean;
}
