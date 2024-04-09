import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';

import {
  HttpDebuggerMiddleware,
  HttpDebuggerResponseMiddleware,
} from './http-debugger/http-debugger.middleware';

@Module({})
export class MiddlewareModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(HttpDebuggerResponseMiddleware, HttpDebuggerMiddleware)
      .forRoutes('*');
  }
}
