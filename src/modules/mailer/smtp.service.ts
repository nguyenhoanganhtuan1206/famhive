import { Injectable, Logger } from '@nestjs/common';
import type { Transporter } from 'nodemailer';
import { createTransport } from 'nodemailer';

import { ApiConfigService } from '../../shared/services/api-config.service';
import type { IMailOptions } from './types';

@Injectable()
export class SmtpService {
  private transporter: Transporter;

  constructor(private apiConfigService: ApiConfigService) {
    this.transporter = createTransport(apiConfigService.smtpConfig);
  }

  async sendEmailTemplate(mailOption: IMailOptions, htmlBody: string) {
    return new Promise((resolve, reject) => {
      this.transporter.sendMail(
        {
          from: this.apiConfigService.SMTPHostEmail,
          to: mailOption.to,
          subject: mailOption.subject,
          html: htmlBody,
        },
        (err, info) => {
          if (err) {
            Logger.error(err);
            reject(err);
          } else {
            Logger.log(`Sent email to: ${info.accepted.slice(0, 6)}...`);
            resolve(info);
          }
        },
      );
    });
  }
}
