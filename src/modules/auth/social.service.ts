import type { AuthSocialDto } from './dto/auth-social.dto';
import type { ISocialUser } from './dto/social-user';

export interface ISocialService {
  getProfileByToken(loginDto: AuthSocialDto): Promise<ISocialUser>;
}
