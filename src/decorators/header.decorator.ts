/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator, Logger } from '@nestjs/common';
import type { ClassConstructor } from 'class-transformer';
import { plainToInstance } from 'class-transformer';

import { ISOLanguageEnum, LangCode } from '../constants';

export const LanguageHeader = createParamDecorator(
  (value: ClassConstructor<any>, ctx: ExecutionContext) => {
    const headers = ctx.switchToHttp().getRequest().headers;

    const headersObj = plainToInstance(value, headers, {
      excludeExtraneousValues: true,
    });

    const language = headersObj['accept-language'];

    if (!language) {
      Logger.warn('No Accept-Language header was specified, default to EN.');

      return LangCode.EN;
    }

    if (!(language in ISOLanguageEnum)) {
      Logger.warn('This language is not supported, default to EN.');

      return LangCode.EN;
    }

    return headersObj['accept-language'];
  },
);
