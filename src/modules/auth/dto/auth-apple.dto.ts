import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AuthAppleDto {
  @ApiProperty({ example: 'token' })
  @IsNotEmpty()
  id_token: string;

  @ApiProperty({
    example: 'http://example.com/callback',
    description: "Redirect to 'URL' after verify token",
  })
  @IsNotEmpty()
  state: string;
}
