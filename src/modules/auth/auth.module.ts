import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { UserEntity } from '../user/user.entity';
import { UserModule } from '../user/user.module';
import { AppleService } from './apple.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleService } from './google.service';
import { JwtStrategy } from './jwt.strategy';
import { PublicStrategy } from './public.strategy';

@Module({
  imports: [
    forwardRef(() => UserModule),
    TypeOrmModule.forFeature([UserEntity]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      useFactory: (configService: ApiConfigService) => ({
        privateKey: configService.authConfig.privateKey,
        publicKey: configService.authConfig.publicKey,
        signOptions: {
          algorithm: 'RS256',
          //     expiresIn: configService.getNumber('JWT_EXPIRATION_TIME'),
        },
        verifyOptions: {
          algorithms: ['RS256'],
        },
        // if you want to use token with expiration date
        // signOptions: {
        //     expiresIn: configService.getNumber('JWT_EXPIRATION_TIME'),
        // },
      }),
      inject: [ApiConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    PublicStrategy,
    GoogleService,
    AppleService,
  ],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
