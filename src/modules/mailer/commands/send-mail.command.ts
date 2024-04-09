import type { ICommand, ICommandHandler } from '@nestjs/cqrs';
import { CommandHandler } from '@nestjs/cqrs';

import { MailerService } from '../mailer.service';
import type { IMailOptions } from '../types';

export class SendMailCommand implements ICommand {
  constructor(public readonly mailOption: IMailOptions) {}
}

@CommandHandler(SendMailCommand)
export class SendMailHandler implements ICommandHandler<SendMailCommand, void> {
  constructor(private readonly mailerService: MailerService) {}

  async execute(command: SendMailCommand): Promise<void> {
    await this.mailerService.send(command.mailOption);
  }
}
