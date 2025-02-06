import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export class AppError extends Error {
  public readonly message: string;
  public readonly statusCode: number;
  public readonly payload?: any;
  public readonly isSuccess: boolean;
  public readonly stack?: string;
  public readonly status?: number;

  constructor(
    message: string,
    statusCode: HttpStatus,
    extra?: {
      error?: any;
    },
  ) {
    super();

    if (message?.includes('prisma')) {
      console.error(message);
      this.message = 'Internal Server Error';
    } else this.message = message;

    this.statusCode = statusCode;
    this.status = statusCode;
    this.payload = null;
    this.stack = extra?.error?.stack;
    this.isSuccess = false;
  }
}

// FOR MICROSERVICES RESPONSES

export interface IRpcException {
  message: string;
  status: number;
}

export class AppErrorRpc extends RpcException implements IRpcException {
  public status: number;
  public payload?: any;

  constructor(message: string, statusCode = 400, payload?: any) {
    super(message);
    this.initStatusCode(statusCode);
    this.payload = payload;
  }

  private initStatusCode(statusCode: number) {
    this.status = statusCode;
  }
}
