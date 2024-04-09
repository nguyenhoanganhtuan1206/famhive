import { Injectable } from '@nestjs/common';
import dayjs from 'dayjs';

@Injectable()
export class DateService {
  create(date?: string | Date): Date {
    return dayjs(date).toDate();
  }

  format(date: Date, format?: string): string {
    return dayjs(date).format(format || 'YYYY-MM-DD');
  }
}
