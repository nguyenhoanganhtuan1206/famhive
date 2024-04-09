import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';

import { ApiConfigService } from '../../shared/services/api-config.service';
import type { AuthSocialDto } from './dto/auth-social.dto';
import type { ISocialUser } from './dto/social-user';
import type { ISocialService } from './social.service';

@Injectable()
export class GoogleService implements ISocialService {
  private google: OAuth2Client;

  constructor(private apiConfigService: ApiConfigService) {
    this.google = new OAuth2Client(
      apiConfigService.google.clientId,
      apiConfigService.google.clientSecret,
    );
  }

  async getProfileByToken(loginDto: AuthSocialDto): Promise<ISocialUser> {
    const ticket = await this.getLoginTicket(loginDto);
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      throw new BadRequestException();
    }

    return {
      email: payload.email,
      fullName: payload.given_name || loginDto.fullName || '',
    };
  }

  private async getLoginTicket(loginDto: AuthSocialDto) {
    try {
      return await this.google.verifyIdToken({
        idToken: loginDto.idToken,
        //TODO Add back audience verify
      });
    } catch (error) {
      Logger.error('Failed to get profile from gg token. Debug info ', {
        ...loginDto,
        ...this.apiConfigService.google,
      });

      throw error;
    }
  }
}
