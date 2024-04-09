import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Redirect,
  Req,
  Res,
  Version,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';

import { RoleType } from '../../constants';
import { Auth, AuthUser } from '../../decorators';
import { UserDto } from '../user/dtos/user.dto';
import { UserEntity } from '../user/user.entity';
import { AppleService } from './apple.service';
import { AuthService } from './auth.service';
import { AuthAppleDto } from './dto/auth-apple.dto';
import { AuthSocialDto } from './dto/auth-social.dto';
import { LoginPayloadDto } from './dto/login-payload.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserLogoutDto } from './dto/user-logout.dto';
import { UserRegisterDto } from './dto/user-register.dto';
import { GoogleService } from './google.service';
import type { ISocialService } from './social.service';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private googleService: GoogleService,
    private appleService: AppleService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    type: LoginPayloadDto,
    description: 'User info with access token',
  })
  async userLogin(
    @Body() userLoginDto: UserLoginDto,
  ): Promise<LoginPayloadDto> {
    return this.createToken(await this.authService.manuallyLogin(userLoginDto));
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  async userLogout(
    @AuthUser() user: UserEntity,
    @Body() userLogoutDto: UserLogoutDto,
  ): Promise<void> {
    return this.authService.logout(user, userLogoutDto.deviceIdentifier);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  async userRegister(
    @Body() userRegisterDto: UserRegisterDto,
    @Req() request: Request,
  ): Promise<LoginPayloadDto> {
    return this.createToken(
      await this.authService.createUser(request, userRegisterDto),
    );
  }

  @Post('google')
  @HttpCode(HttpStatus.OK)
  async loginGoogle(@Body() loginDto: AuthSocialDto): Promise<LoginPayloadDto> {
    return this.loginSocial(loginDto, this.googleService);
  }

  @Post('apple')
  @HttpCode(HttpStatus.OK)
  async loginApple(@Body() loginDto: AuthSocialDto): Promise<LoginPayloadDto> {
    return this.loginSocial(loginDto, this.appleService);
  }

  @Version('1')
  @Get('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.SPOUSE, RoleType.ADMIN, RoleType.KID])
  @ApiOkResponse({ type: UserDto, description: 'current user info' })
  getCurrentUser(@AuthUser() user: UserEntity): Promise<UserDto> {
    return this.authService.getMe(user);
  }

  @Delete('me')
  @HttpCode(HttpStatus.OK)
  @Auth([RoleType.SPOUSE, RoleType.ADMIN])
  @ApiOkResponse({ type: UserDto, description: 'delete current user' })
  async deleteCurrentUser(@AuthUser() user: UserEntity) {
    await this.authService.deleteUser(user);
  }

  @Get('verify-email')
  @Redirect()
  async verifyEmail(
    @Res() res: Response,
    @Query('id') id: Uuid,
    @Query('code') code: string,
  ) {
    if (await this.authService.verifyEmail(id, code)) {
      return {
        url: '/verify-email-success.html',
      };
    }

    return {
      url: '/verify-email-failed.html',
    };
  }

  @Post('callbacks/sign-in-apple')
  callbackSignInApple(@Body() appleDto: AuthAppleDto, @Res() res: Response) {
    return res.redirect(`${appleDto.state}/${appleDto.id_token}`);
  }

  private async loginSocial(loginDto: AuthSocialDto, service: ISocialService) {
    const socialUser = await service.getProfileByToken(loginDto);

    return this.createToken(
      await this.authService.createSocialUser(socialUser),
    );
  }

  private async createToken(userEntity: UserEntity) {
    const token = await this.authService.createAccessToken(userEntity);

    return new LoginPayloadDto(new UserDto(userEntity), token);
  }
}
