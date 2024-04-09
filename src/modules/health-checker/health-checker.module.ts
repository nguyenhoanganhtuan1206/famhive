import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthCheckerController } from './health-checker.controller';
import { HealthcheckIoIndicator } from './health-indicators/healthcheck.io.indicator';
import { ServiceHealthIndicator } from './health-indicators/service.indicator';

@Module({
  imports: [TerminusModule, HttpModule],
  controllers: [HealthCheckerController],
  providers: [ServiceHealthIndicator, HealthcheckIoIndicator],
})
export class HealthCheckerModule {}
