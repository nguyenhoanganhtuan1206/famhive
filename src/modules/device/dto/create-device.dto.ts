import {
  IsNullable,
  NumberField,
  StringField,
  StringFieldOptional,
  Trim,
} from '../../../decorators';

export class CreateDeviceDto {
  @StringField({ maxLength: 64 })
  @Trim()
  identifier: string;

  @StringFieldOptional({ maxLength: 128 })
  @Trim()
  name?: string;

  @StringFieldOptional({ maxLength: 164 })
  @IsNullable()
  token?: string;

  @NumberField({ int: true })
  @IsNullable()
  timezoneOffset: number;
}
