import { AbstractDto } from '../../../common/dto/abstract.dto';
import {
  IsNullable,
  NumberField,
  StringField,
  StringFieldOptional,
} from '../../../decorators';
import type { ContactEntity } from '../entities/contact.entity';

export class ContactDto extends AbstractDto {
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

  constructor(contact: ContactEntity) {
    super(contact);
    this.firstName = contact.firstName;
    this.lastName = contact.lastName;
    this.jobTitle = contact.jobTitle;
    this.email = contact.email;
    this.avatar = contact.avatar;
    this.phone = contact.phone;
    this.address = contact.address;
    this.companyName = contact.companyName;
    this.notes = contact.notes;
  }
}
