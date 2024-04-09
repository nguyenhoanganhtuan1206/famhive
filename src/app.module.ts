import './boilerplate.polyfill';

import { HttpException, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule } from '@nestjs/typeorm';
import { nodeProfilingIntegration } from '@sentry/profiling-node';
import { SentryInterceptor, SentryModule } from 'easy-sentry';
import { AcceptLanguageResolver, I18nModule, QueryResolver } from 'nestjs-i18n';
import path from 'path';
import type { DataSourceOptions } from 'typeorm';
import { DataSource, EntityNotFoundError } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

import { LangCode } from './constants';
import { MiddlewareModule } from './middleware/middleware.module';
import { AnnouncementModule } from './modules/announcement/announcement.module';
import { AuthModule } from './modules/auth/auth.module';
import { ChoreModule } from './modules/chore/chore.module';
import { ContactModule } from './modules/contact/contact.module';
import { DeviceModule } from './modules/device/device.module';
import { DiscountModule } from './modules/discount/discount.module';
import { EventModule } from './modules/event/event.module';
import { FamilyModule } from './modules/family/family.module';
import { ForgotModule } from './modules/forgot/forgot.module';
import { GiftModule } from './modules/gift/gift.module';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';
import { MailerModule } from './modules/mailer/mailer.module';
import { MealModule } from './modules/meal/meal.module';
import { MealPlannerModule } from './modules/meal-planner/meal-planner.module';
import { NotificationModule } from './modules/notification/notification.module';
import { PurchaseModule } from './modules/purchase/purchase.module';
import { RecommendationModule } from './modules/recommendation/recommendation.module';
import { RewardModule } from './modules/reward/reward.module';
import { TodoModule } from './modules/todo/todo.module';
import { UserModule } from './modules/user/user.module';
import { ApiConfigService } from './shared/services/api-config.service';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    ScheduleModule.forRoot(),
    ServeStaticModule.forRoot({
      rootPath: path.join(__dirname, '..', 'public'),
      exclude: ['/api/(.*)'],
    }),
    SentryModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) => ({
        dsn: configService.sentry.dsn,
        tracesSampleRate: 0.5,
        profilesSampleRate: 0.5, // Profiling sample rate is relative to tracesSampleRate
        integrations: [
          // Add profiling integration to list of integrations
          nodeProfilingIntegration(),
        ],
        debug: true,
        environment: configService.nodeEnv,
        logLevels: ['error'], //based on sentry.io loglevel //
        close: {
          enabled: true,
          // Time in milliseconds to forcefully quit the application
          timeout: 1000,
        },
      }),
      inject: [ApiConfigService],
    }),
    TypeOrmModule.forRootAsync({
      imports: [SharedModule],
      useFactory: (configService: ApiConfigService) =>
        configService.postgresConfig,
      inject: [ApiConfigService],
      // eslint-disable-next-line @typescript-eslint/require-await
      async dataSourceFactory(options: DataSourceOptions) {
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
    I18nModule.forRoot({
      fallbackLanguage: LangCode.EN,
      loaderOptions: {
        path: path.join(__dirname, '/i18n/'),
        watch: true,
      },
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
      ],
    }),
    MailerModule,
    AuthModule,
    UserModule,
    EventModule,
    TodoModule,
    FamilyModule,
    DeviceModule,
    HealthCheckerModule,
    ForgotModule,
    PurchaseModule,
    RewardModule,
    NotificationModule,
    RecommendationModule,
    GiftModule,
    ContactModule,
    AnnouncementModule,
    DiscountModule,
    MiddlewareModule,
    MealModule,
    MealPlannerModule,
    ChoreModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useFactory: () =>
        new SentryInterceptor({
          filters: [
            {
              type: EntityNotFoundError,
              filter: (_: EntityNotFoundError) => true,
            },
            {
              type: HttpException,
              filter: (exception: HttpException) => exception.getStatus() < 500, // Only report 500 errors
            },
          ],
        }),
    },
  ],
})
export class AppModule {}
