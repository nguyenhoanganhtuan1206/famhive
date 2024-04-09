import { Controller, Get } from '@nestjs/common';
import type { HealthCheckResult } from '@nestjs/terminus';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

import { HealthcheckIoIndicator } from './health-indicators/healthcheck.io.indicator';

@Controller('health')
export class HealthCheckerController {
  constructor(
    private healthCheckService: HealthCheckService,
    private ormIndicator: TypeOrmHealthIndicator,
    private healthcheckIOIndicator: HealthcheckIoIndicator,
  ) {}

  @Get()
  @HealthCheck()
  async check(): Promise<HealthCheckResult> {
    return this.healthCheckService.check([
      () => this.ormIndicator.pingCheck('database', { timeout: 1500 }),
      // () => this.serviceIndicator.isHealthy('search-service-health'),
      () => this.healthcheckIOIndicator.isHealthy('healthcheck-io'),
    ]);
  }
}
