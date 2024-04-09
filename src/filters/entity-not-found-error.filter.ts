import type { ArgumentsHost, ExceptionFilter } from '@nestjs/common';
import { Catch, Logger } from '@nestjs/common';
import type { Response } from 'express';
import { EntityNotFoundError } from 'typeorm';

@Catch(EntityNotFoundError)
export class EntityNotFoundErrorFilter
  implements ExceptionFilter<EntityNotFoundError>
{
  catch(exception: EntityNotFoundError, host: ArgumentsHost): void {
    Logger.debug(JSON.stringify(exception));
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(404).json({
      statusCode: 404,
      timestamp: new Date().toISOString(),
      path: request.url,
      message: 'The resource could not be found',
    });
  }
}
