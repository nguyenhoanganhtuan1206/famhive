/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { NestMiddleware } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { NextFunction, Request, Response } from 'express';
import morgan from 'morgan';
import { createStream } from 'rotating-file-stream';

import { DateService } from './../../shared/services/date.service';
import {
  DEBUGGER_HTTP_FORMAT,
  DEBUGGER_HTTP_NAME,
} from './http-debugger.constant';
import type {
  ICustomResponse,
  IHttpDebuggerConfig,
  IHttpDebuggerConfigOptions,
} from './http-debugger.interface';

@Injectable()
export class HttpDebuggerMiddleware implements NestMiddleware {
  private readonly maxSize: string;

  private readonly maxFiles: number;

  constructor(
    private readonly configService: ConfigService,
    private readonly dateService: DateService,
  ) {
    this.maxSize = this.configService.get<string>('HTTP_MAX_SIZE') || '2M';
    this.maxFiles =
      Number(this.configService.get<number>('HTTP_MAX_FILES')) || 5;
  }

  private customToken(): void {
    morgan.token('req-params', (req: Request) => JSON.stringify(req.params));
    morgan.token('req-body', (req: Request) => JSON.stringify(req.body));
    morgan.token('res-body', (req: Request, res: ICustomResponse) => res.body);
    morgan.token('req-headers', (req: Request) => JSON.stringify(req.headers));
  }

  private httpLogger(): IHttpDebuggerConfig {
    const date: string = this.dateService.format(this.dateService.create());
    const httpDebuggerOptions: IHttpDebuggerConfigOptions = {
      stream: createStream(`${date}.log`, {
        path: `./logs/${DEBUGGER_HTTP_NAME}/`,
        maxSize: this.maxSize,
        maxFiles: this.maxFiles,
        compress: true,
        interval: '1d',
      }),
    };

    return {
      debuggerHttpFormat: DEBUGGER_HTTP_FORMAT,
      HttpDebuggerOptions: httpDebuggerOptions,
    };
  }

  use(req: Request, res: Response, next: NextFunction): void {
    const config: IHttpDebuggerConfig = this.httpLogger();
    this.customToken();

    morgan(config.debuggerHttpFormat, config.HttpDebuggerOptions)(
      req,
      res,
      next,
    );
  }
}

@Injectable()
export class HttpDebuggerResponseMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction): void {
    const send: any = res.send;
    const resOld: any = res;

    // Add response data to response
    // this is for morgan
    resOld.send = (body: any) => {
      resOld.body = body;
      resOld.send = send;
      resOld.send(body);
      res = resOld as Response;
    };

    next();
  }
}
