import { Body, Controller, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ResetPasswordDto } from './dto/reset-password.dto';
import { SendCodeDto } from './dto/send-code.dto';
import { ForgotService } from './forgot.service';

@Controller('forgot')
@ApiTags('forgot')
export class ForgotController {
  constructor(private readonly forgotService: ForgotService) {}

  @Post()
  sendCode(@Body() sendCodeDto: SendCodeDto) {
    return this.forgotService.sendCode(sendCodeDto);
  }

  @Put()
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.forgotService.resetPassword(resetPasswordDto);
  }
}
