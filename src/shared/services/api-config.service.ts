import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { isNil } from 'lodash';
import type SMTPTransport from 'nodemailer/lib/smtp-transport';

import { SnakeNamingStrategy } from '../../snake-naming.strategy';

@Injectable()
export class ApiConfigService {
  constructor(private configService: ConfigService) {}

  get isDevelopment(): boolean {
    return this.nodeEnv === 'development';
  }

  get isProduction(): boolean {
    return this.nodeEnv === 'production';
  }

  get isTest(): boolean {
    return this.nodeEnv === 'test';
  }

  private getNumber(key: string): number {
    const value = this.get(key);

    try {
      return Number(value);
    } catch {
      throw new Error(key + ' environment variable is not a number');
    }
  }

  private getBoolean(key: string): boolean {
    const value = this.get(key);

    try {
      return Boolean(JSON.parse(value));
    } catch {
      throw new Error(key + ' env var is not a boolean');
    }
  }

  private getString(key: string): string {
    const value = this.get(key);

    return value.replace(/\\n/g, '\n');
  }

  private get(key: string): string {
    const value = this.configService.get<string>(key);

    if (isNil(value)) {
      throw new Error(key + ' environment variable does not set'); // probably we should call process.exit() too to avoid locking the service
    }

    return value;
  }

  get nodeEnv(): string {
    return this.getString('NODE_ENV');
  }

  get iap() {
    return {
      subscriptionExpiredDelay: this.getNumber('SUBSCRIPTION_EXPIRED_DELAY'),
    };
  }

  get apple() {
    return {
      clientId: this.getString('APPLE_CLIENT_ID'),
      clientIdForWeb: this.getString('APPLE_CLIENT_ID_FOR_WEB'),
      itunes: {
        appPassword: this.getString('APPLE_ITUNES_APP_PASSWORD'),
        privateKey: this.getString('APPLE_ITUNES_PRIVATE_KEY'),
        keyId: this.getString('APPLE_ITUNES_KEY_ID'),
        keyIssuer: this.getString('APPLE_ITUNES_KEY_ISSUER'),
        environment: this.isProduction ? 'Production' : 'Sandbox',
        get verifyReceiptUrl() {
          const subdomain =
            this.environment === 'Production' ? 'buy' : 'sandbox';

          return `https://${subdomain}.itunes.apple.com/verifyReceipt`;
        },
      },
    };
  }

  get google() {
    return {
      clientId: this.getString('GOOGLE_CLIENT_ID'),
      clientSecret: this.getString('GOOGLE_CLIENT_SECRET'),
    };
  }

  get googlePay() {
    return {
      projectId: this.getString('GOOGLE_PAY_PROJECT_ID'),
      privateKeyId: this.getString('GOOGLE_PAY_PRIVATE_KEY_ID'),
      privateKey: this.getString('GOOGLE_PAY_PRIVATE_KEY'),
      clientEmail: this.getString('GOOGLE_PAY_CLIENT_EMAIL'),
      clientId: this.getString('GOOGLE_PAY_CLIENT_ID'),
      subscriptionName: this.getString('GOOGLE_PAY_SUBSCRIPTION_NAME'),
    };
  }

  get postgresConfig(): TypeOrmModuleOptions {
    let entities = [
      __dirname + '/../../modules/**/*.entity{.ts,.js}',
      __dirname + '/../../modules/**/*.view-entity{.ts,.js}',
    ];
    let migrations = [__dirname + '/../../database/migrations/*{.ts,.js}'];

    if (module.hot) {
      const entityContext = require.context(
        './../../modules',
        true,
        /\.entity\.ts$/,
      );
      entities = entityContext.keys().map((id) => {
        const entityModule = entityContext<Record<string, unknown>>(id);
        const [entity] = Object.values(entityModule);

        return entity as string;
      });
      const migrationContext = require.context(
        './../../database/migrations',
        false,
        /\.ts$/,
      );

      migrations = migrationContext.keys().map((id) => {
        const migrationModule = migrationContext<Record<string, unknown>>(id);
        const [migration] = Object.values(migrationModule);

        return migration as string;
      });
    }

    return {
      entities,
      migrations,
      keepConnectionAlive: !this.isTest,
      dropSchema: this.isTest,
      type: 'postgres',
      name: 'default',
      host: this.getString('DB_HOST'),
      port: this.getNumber('DB_PORT'),
      username: this.getString('DB_USERNAME'),
      password: this.getString('DB_PASSWORD'),
      database: this.getString('DB_DATABASE'),
      subscribers: [],
      migrationsRun: true,
      logging: this.getBoolean('ENABLE_ORM_LOGS'),
      namingStrategy: new SnakeNamingStrategy(),
    };
  }

  get awsS3Config() {
    return {
      bucketRegion: this.getString('AWS_REGION'),
      bucketApiVersion: this.getString('AWS_S3_API_VERSION'),
      bucketName: this.getString('AWS_S3_BUCKET_NAME'),
    };
  }

  get sentry() {
    return {
      dsn: this.getString('SENTRY_DSN'),
    };
  }

  get firebaseConfig() {
    return {
      type: 'service_account',
      projectId: this.getString('FIREBASE_PROJECT_ID'),
      privateKeyId: this.getString('FIREBASE_PRIVATE_KEY_ID'),
      privateKey: this.getString('FIREBASE_PRIVATE_KEY'),
      clientEmail: this.getString('FIREBASE_CLIENT_EMAIL'),
      clientId: this.getString('FIREBASE_CLIENT_ID'),
      authUri: 'https://accounts.google.com/o/oauth2/auth',
      tokenUri: 'https://oauth2.googleapis.com/token',
      authProviderX509CertUrl: 'https://www.googleapis.com/oauth2/v1/certs',
      clientC509CertUrl: this.getString('FIREBASE_CLIENT_CERT_URL'),
    };
  }

  get documentationEnabled(): boolean {
    return this.getBoolean('ENABLE_DOCUMENTATION');
  }

  get natsEnabled(): boolean {
    return this.getBoolean('NATS_ENABLED');
  }

  get natsConfig() {
    return {
      host: this.getString('NATS_HOST'),
      port: this.getNumber('NATS_PORT'),
    };
  }

  get authConfig() {
    return {
      privateKey: this.getString('JWT_PRIVATE_KEY'),
      publicKey: this.getString('JWT_PUBLIC_KEY'),
      jwtExpirationTime: this.getNumber('JWT_EXPIRATION_TIME'),
    };
  }

  get appConfig() {
    return {
      port: this.getString('PORT'),
      rateRequestLimitWindows:
        1000 * this.getNumber('RATE_REQUEST_LIMIT_WINDOWS'),
      rateRequestLimitMax: this.getNumber('RATE_REQUEST_LIMIT_MAX'),
      payloadSizeLimitMax: this.getNumber('PAYLOAD_SIZE_LIMIT_MAX') || '2MB',
    };
  }

  get SMTPHostEmail(): string {
    return this.getString('SMTP_HOST_EMAIL');
  }

  get smtpConfig(): SMTPTransport.Options {
    return {
      host: `email-smtp.${this.getString('AWS_REGION')}.amazonaws.com`,
      port: this.getNumber('SMTP_PORT'),
      auth: {
        user: this.getString('SMTP_USERNAME'),
        pass: this.getString('SMTP_PASSWORD'),
      },
    };
  }

  get appInfos() {
    return {
      LOGO_URL: this.getString('LOGO_URL'),
      APPLE_STORE_LINK: this.getString('APPLE_STORE_LINK'),
      ANDROID_APP_LINK: this.getString('ANDROID_APP_LINK'),
      EMAIL_SUPPORT: this.getString('EMAIL_SUPPORT'),
      WEB_URL: this.getString('WEB_URL'),
    };
  }

  get openAIConfig() {
    return {
      OPENAI_API_KEY: this.getString('OPENAI_API_KEY'),
    };
  }

  get cronSchedule() {
    return {
      EVENT_REMINDER_SCHEDULE: this.getString('EVENT_REMINDER_SCHEDULE'),
    };
  }

  get healthcheckUrl() {
    return this.getString('HEALTHCHECK_URL');
  }
}
