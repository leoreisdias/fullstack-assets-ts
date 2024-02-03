import { HttpStatus } from '@nestjs/common';

export class ResponseDto<T = any> {
  statusCode?: number = 200;
  message: string;
  payload: T;

  constructor({
    message,
    payload,
    statusCode,
  }: {
    payload: T;
    message: string;
    statusCode?: number;
  }) {
    this.payload = payload;
    this.message = message;
    this.statusCode = statusCode || HttpStatus.OK;
  }
}


// USAGE EXAMPLE:
// return new ResponseDto({
//     message: 'Something',
//     payload: ''
// });