import type {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
} from '@nestjs/common';
import {
  applyDecorators,
  Injectable,
  SetMetadata,
  UseInterceptors,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import _ from 'lodash';
import { I18nService } from 'nestjs-i18n';
import type { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { LangCode } from '../constants';
import { ApiTranslateOptions } from './swagger.schema';

@Injectable()
export class TranslateInterceptor implements NestInterceptor {
  constructor(
    private readonly i18nService: I18nService,
    private readonly reflector: Reflector,
  ) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const source = this.reflector.get<string>('source', context.getHandler());
    const key = this.reflector.get<string>('key', context.getHandler());
    const options = this.reflector.get<ITranslateOption[] | undefined>(
      'options',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();
    const lang: LangCode = request.headers['accept-language'] || LangCode.EN;

    return next.handle().pipe(
      map((data: Record<string, unknown> | Array<Record<string, unknown>>) => {
        if (_.isArray(data)) {
          return data.map((item: Record<string, unknown>) =>
            this.translateItem(item, source, key, lang, options),
          );
        }

        return this.translateItem(data, source, key, lang, options);
      }),
    );
  }

  private translateItem(
    data: Record<string, unknown>,
    source: string,
    key: string,
    lang: LangCode,
    options?: ITranslateOption[],
  ) {
    if (lang === LangCode.EN) {
      return data;
    }

    if (options) {
      const option = options.find((op) =>
        Object.keys(op.where).every(
          (property) => data[property] === op.where[property],
        ),
      );

      if (option) {
        const valueFromData = _.get(data, key) as string | undefined;

        if (valueFromData) {
          const value = valueFromData.match(option.template);

          return {
            ...data,
            [key]: this.i18nService.translate(`${source}.${option.localeKey}`, {
              lang,
              defaultValue: valueFromData,
              args: {
                name: _.get(value, 1),
              },
            }),
          };
        }
      }
    }

    return {
      ...data,
      [key]: this.i18nService.translate(
        `${source}.${_.snakeCase(_.get(data, key) as string)}`,
        {
          lang,
          defaultValue: _.get(data, key) as string,
        },
      ),
    };
  }
}

export interface ITranslateOption {
  where: Record<string, string | number | boolean | null>;
  template: RegExp;
  localeKey: string;
}

export function Translate(
  source: string,
  key: string,
  options?: ITranslateOption[],
): MethodDecorator {
  return applyDecorators(
    SetMetadata('source', source),
    SetMetadata('key', key),
    SetMetadata('options', options),
    ApiTranslateOptions(),
    UseInterceptors(TranslateInterceptor),
  );
}
