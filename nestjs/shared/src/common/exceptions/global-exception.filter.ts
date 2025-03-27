import {
  ArgumentsHost,
  Catch,
  ConsoleLogger,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from "@nestjs/common";
import { Request, Response } from "express";

import { IGlobalExceptionResponse } from "./global-exceptions.interface";
import { ZodValidationException } from "nestjs-zod";

@Catch(HttpException, ZodValidationException)
export class GlobalExceptionsFilter
  extends ConsoleLogger
  implements ExceptionFilter
{
  catch(
    exception: HttpException | ZodValidationException,
    host: ArgumentsHost
  ) {
    const { response, request } = this.extractContext(host);
    const errorResponse = this.buildErrorResponse(exception, request);

    this.logError(exception);
    response.status(errorResponse.statusCode).json(errorResponse);
  }

  private extractContext(host: ArgumentsHost): {
    request: Request;
    response: Response;
  } {
    const ctx = host.switchToHttp();
    return {
      request: ctx.getRequest<Request>(),
      response: ctx.getResponse<Response>(),
    };
  }

  private buildErrorResponse(
    exception: HttpException | ZodValidationException,
    request: Request
  ): IGlobalExceptionResponse {
    const statusCode = this.getStatusCode(exception);
    const status = HttpStatus[statusCode] as keyof typeof HttpStatus;

    if (exception instanceof ZodValidationException) {
      const zodError = exception.getZodError();
      return {
        statusCode,
        status: status || "INTERNAL_SERVER_ERROR",
        error: zodError.errors.map((error) => ({
          message: error.message,
          name: error.path.join("."),
        })),
        route: request.url,
        timestamp: Date.now(),
      };
    }

    return {
      statusCode,
      status: status || "INTERNAL_SERVER_ERROR",
      error: {
        name: exception.name,
        message: exception.message,
      },
      route: request.url,
      timestamp: Date.now(),
    };
  }

  private getStatusCode(exception: HttpException): number {
    return exception instanceof HttpException
      ? exception.getStatus()
      : HttpStatus.INTERNAL_SERVER_ERROR;
  }

  private logError(exception: HttpException): void {
    this.error(`[${exception.name}] ${exception.message}`);
  }
}
