import { HttpStatus } from '@nestjs/common'

export interface IExceptionDetail {
  name: string
  message: string
}

export interface IGlobalExceptionResponse {
  statusCode: number
  status: keyof typeof HttpStatus
  error: IExceptionDetail | IExceptionDetail[]
  route: string
  timestamp: number
}
