import { Catch, ArgumentsHost, Injectable, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { DeadLetterService } from 'src/modules/dead-letter/dead-letter.service';

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
        error: exception,
        /*
        or
        error:
            exception?.stack ??
            exception?.message ??
            JSON.stringify(exception),
        */
        params: request?.params,
        query: request?.query,
        user: request?.user?.user,
        status: exception?.statusCode || exception?.status,
       // any other info...
    });

    super.catch(exception, host);
  }
}


/* USAGE

// -> app.module.ts
providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    // ...
],

*/
