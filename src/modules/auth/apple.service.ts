import { BadRequestException, Injectable } from '@nestjs/common';
import verifyAppleToken from 'verify-apple-id-token';

import { ApiConfigService } from '../../shared/services/api-config.service';
import type { AuthSocialDto } from './dto/auth-social.dto';
import type { ISocialUser } from './dto/social-user';
import type { ISocialService } from './social.service';

@Injectable()
export class AppleService implements ISocialService {
  constructor(private apiConfigService: ApiConfigService) {}

  async getProfileByToken(loginDto: AuthSocialDto): Promise<ISocialUser> {
    const jwtClaims = await verifyAppleToken({
      idToken: loginDto.idToken,
      clientId: loginDto.loginOnWeb
        ? this.apiConfigService.apple.clientIdForWeb
        : this.apiConfigService.apple.clientId,
    });

    if (!jwtClaims.email) {
      throw new BadRequestException();
    }

    return {
      email: jwtClaims.email,
      fullName: jwtClaims.given_name || loginDto.fullName || '',
    };
  }
}
