import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserDto } from '../dtos';
import { AppError } from '../errors';

const jwtErrorMessages = [
  'jwt expired',
  'invalid signature',
  'jwt must be provided',
  'invalid token',
  'jwt malformed',
];

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
  ) {}

  validateRoles(roles: string[], userRoles: string[]) {
    const hasRole = userRoles.some((role) => roles.includes(role));

    if (!hasRole) {
      throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }

  validateToken(token:string): Promise<{ payload: UserDto }> | void {
    // const payload = // token validation like: JWT validations

    // return payload;
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const req = context.switchToHttp().getRequest();

    const roles =
      this.reflector.get<string[]>('roles', context.getHandler()) ?? [];

    const token = req.headers['authorization']?.split(' ')[1];

    try {
      const res = await this.authApiService.validateToken(token);

      req.user = res?.payload;

      if (roles.length > 0) {
        const user = res?.payload.user as UserDto;
        this.validateRoles(roles, user?.type);
      }

      return true;
    } catch (error) {
        throw new AppError(error?.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
