import type { ITemplateData } from './template-data';

export interface IMailOptions {
  to: string[] | string | undefined;
  subject?: string;
  templateName: string;
  data: ITemplateData;
}
