import { RpcException } from '@nestjs/microservices';

export class AppError extends Error {
    public readonly message: string;
    public readonly statusCode: number;
    public readonly payload?: any;
    public readonly stack?: string;
  
    constructor(message: string, statusCode = 400, payload?: any, error?: any) {
      super();
  
      if (message?.includes('prisma')) {
        console.error(message);
        this.message = 'Internal Server Error';
      } else this.message = message;
  
      this.statusCode = statusCode;
      this.payload = payload;
      this.stack = error?.stack;
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
