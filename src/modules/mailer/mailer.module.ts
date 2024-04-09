import { Module } from '@nestjs/common';

import { SendMailHandler } from './commands/send-mail.command';
import { MailerService } from './mailer.service';
import { SmtpService } from './smtp.service';

const handlers = [SendMailHandler];

@Module({
  providers: [MailerService, SmtpService, ...handlers],
})
export class MailerModule {}
