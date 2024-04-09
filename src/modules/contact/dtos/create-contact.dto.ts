import {
  IsNullable,
  NumberField,
  StringField,
  StringFieldOptional,
} from '../../../decorators';

export class CreateContactDto {
  @StringField()
  firstName: string;

  @StringFieldOptional({ minLength: 0 })
  lastName: string;

  @NumberField()
  phone: string;

  @StringFieldOptional({ minLength: 0 })
  jobTitle: string;

  @IsNullable()
  @StringFieldOptional()
  email: string;

  @StringFieldOptional({ minLength: 0 })
  address: string;

  @StringFieldOptional({ minLength: 0 })
  birthday: string;

  @StringFieldOptional({ minLength: 0 })
  companyName: string;

  @StringFieldOptional({ minLength: 0 })
  notes: string;

  @IsNullable()
  @StringFieldOptional()
  avatar: string;
}
