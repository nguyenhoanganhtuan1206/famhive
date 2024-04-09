import { StringField } from '../../../decorators';

export class GetContactsDto {
  @StringField({ minLength: 0 })
  search: string;
}
