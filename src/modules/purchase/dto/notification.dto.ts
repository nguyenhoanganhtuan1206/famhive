import { StringField } from '../../../decorators';

export class NotificationDto {
  @StringField()
  signedPayload: string;
}
