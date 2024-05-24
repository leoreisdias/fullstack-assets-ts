import { Catch, ArgumentsHost, Injectable, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { DeadLetterService } from '../dead-letter/dead-letter.service';

const handleErrorObj = (error: any) => {
  return JSON.stringify(
    {
      stack: error?.stack,
      message: error?.message,
      full: JSON.stringify(error),
    },
    null,
    2,
  );
};

@Injectable()
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
  constructor(private readonly deadLetterService: DeadLetterService) {
    super();
  }

  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown | any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();

    const whitelist = [401, 404, 403];
    const statusCode = exception?.statusCode || exception?.status || 500;

    if (whitelist.includes(statusCode)) {
      return super.catch(exception, host);
    }

    this.logger.warn(
      `[APP_ERROR_AT]: ${request?.url} ${request?.params} ${request?.query}`,
      exception?.stack || JSON.stringify(exception),
    );

    this.deadLetterService.create({
      body: request?.body,
      headers: request?.headers,
      method: request?.method,
      url: request?.url,
      error: handleErrorObj(exception),
      params: request?.params,
      query: request?.query,
      user: request?.user,
      status: exception?.statusCode || exception?.status,
    });

    super.catch(exception, host);
  }
}

/* USAGE

// -> app.module.ts
Import filter in your AppModule

providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
],

*/
