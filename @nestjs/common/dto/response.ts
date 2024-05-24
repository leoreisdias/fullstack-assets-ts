import { HttpStatus } from '@nestjs/common';

export class ResponseDto<T = any> {
  statusCode?: number = 200;
  message: string;
  payload: T;
  isSuccess?: boolean;

  constructor({
    message,
    payload,
    statusCode,
    isSuccess,
  }: {
    payload: T;
    message: string;
    statusCode?: number;
    isSuccess?: boolean;
  }) {
    this.payload = payload;
    this.message = message;
    this.statusCode = statusCode || HttpStatus.OK;
    this.isSuccess = isSuccess ?? true;
  }
}

// NOTE: USAGE EXAMPLE:
// return new ResponseDto({
//     message: 'Something',
//     payload: ''
// });

export class PaginatedResponseDto<T = any> extends ResponseDto<{
  content: T[];
  pageCount: number;
}> {
  constructor({
    message,
    payload,
    statusCode,
    isSuccess,
  }: {
    payload: {
      content: T[];
      pageCount: number;
    };
    message: string;
    statusCode?: number;
    isSuccess?: boolean;
  }) {
    super({ message, payload, statusCode, isSuccess });
  }
}
