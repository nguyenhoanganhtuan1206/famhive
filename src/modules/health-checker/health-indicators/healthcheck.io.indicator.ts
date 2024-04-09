import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import type { HealthIndicatorResult } from '@nestjs/terminus';
import { HealthCheckError, HealthIndicator } from '@nestjs/terminus';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiConfigService } from '../../../shared/services/api-config.service';

@Injectable()
export class HealthcheckIoIndicator extends HealthIndicator {
  constructor(
    private httpService: HttpService,
    private appConfigService: ApiConfigService,
  ) {
    super();
  }

  // send a request to healthcheck.io in every 1/2 minutes so that it will know that our service is up.
  // see https://healthchecks.io/docs/http_api/
  @Cron('*/30 * * * * *')
  async isHealthy(eventName: string): Promise<HealthIndicatorResult> {
    try {
      await lastValueFrom(
        this.httpService
          .get(this.appConfigService.healthcheckUrl)
          .pipe(map((response) => response.data)),
      );

      return {
        [eventName]: {
          status: 'up',
        },
      };
    } catch (error) {
      throw new HealthCheckError(`${eventName} failed`, {
        [eventName]: error,
      });
    }
  }
}
