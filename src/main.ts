import {
  ClassSerializerInterceptor,
  HttpStatus,
  UnprocessableEntityException,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { NestFactory, Reflector } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as bodyParser from 'body-parser';
import compression from 'compression';
import { middleware as expressCtx } from 'express-ctx';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import { initializeTransactionalContext } from 'typeorm-transactional';

import { AppModule } from './app.module';
import { FileLogger } from './file.logger';
import { HttpExceptionFilter } from './filters/bad-request.filter';
import { EntityNotFoundErrorFilter } from './filters/entity-not-found-error.filter';
import { InternalServerErrorFilter } from './filters/internal-server-error.filter';
import { QueryFailedFilter } from './filters/query-failed.filter';
import { setupSwagger } from './setup-swagger';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';

export async function bootstrap(): Promise<NestExpressApplication> {
  initializeTransactionalContext();

  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
    new ExpressAdapter(),
    {
      cors: true,
      logger: new FileLogger(),
    },
  );

  const configService = app.select(SharedModule).get(ApiConfigService);

  const payloadSizeLimit = configService.appConfig.payloadSizeLimitMax;
  app.use(bodyParser.json({ limit: payloadSizeLimit }));
  app.use(bodyParser.urlencoded({ limit: payloadSizeLimit, extended: true }));

  app.enable('trust proxy'); // only if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)

  // app.use(helmet());
  // app.setGlobalPrefix('/api'); use api as global prefix if you don't have subdomain
  if (configService.appConfig.rateRequestLimitMax > 0) {
    app.use(
      rateLimit({
        windowMs: configService.appConfig.rateRequestLimitWindows, // 15 * 60 * 1000, // 15 minutes
        max: configService.appConfig.rateRequestLimitMax, // 100, // limit each IP to 100 requests per windowMs
      }),
    );
  }

  app.use(compression());
  app.use(morgan('combined'));

  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  const reflector = app.get(Reflector);

  app.useGlobalFilters(
    new HttpExceptionFilter(),
    new InternalServerErrorFilter(),
    new QueryFailedFilter(),
    new EntityNotFoundErrorFilter(),
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(reflector));

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      transform: true,
      dismissDefaultMessages: true,
      exceptionFactory: (errors) => new UnprocessableEntityException(errors),
    }),
  );

  // only start nats if it is enabled
  if (configService.natsEnabled) {
    const natsConfig = configService.natsConfig;
    app.connectMicroservice({
      transport: Transport.NATS,
      options: {
        url: `nats://${natsConfig.host}:${natsConfig.port}`,
        queue: 'main_service',
      },
    });

    await app.startAllMicroservices();
  }

  if (configService.documentationEnabled) {
    setupSwagger(app);
  }

  app.use(expressCtx);

  // Starts listening for shutdown hooks
  if (!configService.isDevelopment) {
    app.enableShutdownHooks();
  }

  const port = configService.appConfig.port;
  await app.listen(port);

  console.info(`server running on ${await app.getUrl()}`);

  return app;
}

void bootstrap();
