import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import _ from 'lodash';

import { ApiConfigService } from '../../shared/services/api-config.service';
import { SmtpService } from './smtp.service';
import type { IMailOptions, ITemplateData } from './types';

@Injectable()
export class MailerService {
  constructor(
    private smtpService: SmtpService,
    private apiConfigService: ApiConfigService,
  ) {}

  async send(mailOption: IMailOptions) {
    const htmlBody = await this.renderTemplate(
      mailOption.templateName,
      mailOption.data,
    );
    mailOption.subject =
      mailOption.subject || this.getTitleFromTemplateContent(htmlBody);

    await this.smtpService.sendEmailTemplate(mailOption, htmlBody);
  }

  private async renderTemplate(
    templateName: string,
    templateData: ITemplateData,
  ): Promise<string> {
    const templateContent = await this.loadTemplate(templateName);
    const template = handlebars.compile(templateContent, {
      noEscape: true,
    });

    return template({
      ...this.apiConfigService.appInfos,
      ...templateData,
    });
  }

  private async loadTemplate(templateName: string): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      fs.readFile(
        `${__dirname}/templates/${templateName}.hbs`,
        'utf8',
        (err, fileContent) => {
          if (err) {
            reject(err);
          } else {
            resolve(fileContent);
          }
        },
      );
    });
  }

  private getTitleFromTemplateContent(templateContent: string) {
    const regexPattern = /<title>(.*?)<\/title>/g;
    const title = _.first(templateContent.match(regexPattern));

    return title ? title.replace(/<.*?>/g, '') : '';
  }
}
