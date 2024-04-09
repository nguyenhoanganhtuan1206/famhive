import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, InternalServerErrorException, Logger } from '@nestjs/common';
import type { Response } from 'express';

@Catch(InternalServerErrorException)
export class InternalServerErrorFilter
  implements ExceptionFilter<InternalServerErrorException>
{
  catch(exception: InternalServerErrorException, host: ArgumentsHost): void {
    this.safeLog(exception, host);
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }

  private safeLog(exception, host: ArgumentsHost) {
    try {
      Logger.error({
        exception,
        host,
      });
    } catch {
      Logger.error({
        exception: exception.toString(),
      });
    }
  }
}
