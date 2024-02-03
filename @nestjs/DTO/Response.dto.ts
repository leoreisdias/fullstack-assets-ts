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
    isSuccess
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


// USAGE EXAMPLE:
// return new ResponseDto({
//     message: 'Something',
//     payload: ''
// });