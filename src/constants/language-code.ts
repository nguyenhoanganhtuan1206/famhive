/* eslint-disable @typescript-eslint/naming-convention */
export enum LanguageCode {
  en_US = 'en_US',
  ru_RU = 'ru_RU',
}

export enum LangCode {
  EN = 'en', // english
  FR = 'fr', // french
  ES = 'es', // Spain
  AR = 'ar', // Arabic
  DE = 'de', // German
  HI = 'hi', // Hindi
  ZH = 'zh', // Simplified Chinese
  PT = 'pt', // Portuguese
  VI = 'vi', // Vietnamese
  TH = 'th', // Thai
  ID = 'id', // Indonesian
  KO = 'ko', // Korean
  RU = 'ru', // Russian
  JA = 'ja', // Japanese
}

export const supportedLanguageCount = Object.values(LanguageCode).length;
