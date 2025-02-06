import {
  CanActivate,
  ExecutionContext,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AppError } from '../exceptions/appError';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../constants/jwtConstant';
import { UserDto } from 'types/user.dto';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  validateRoles(roles: string[], userRole: string) {
    const hasRole = roles.includes(userRole);

    if (!hasRole) {
      throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  async canActivate(context: ExecutionContext): Promise<any> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      // 💡 See this condition
      return true;
    }


    const req = context.switchToHttp().getRequest();

    const roles =
      this.reflector.get<string[]>('roles', context.getHandler()) ?? [];

    const token = this.extractTokenFromHeader(req);

    if (!token) {
      throw new AppError('Unauthorized', HttpStatus.UNAUTHORIZED);
    }

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: jwtConstants.secret,
      });

      req.user = payload;

      if (roles.length > 0) {
        const user = payload.user as UserDto;
        this.validateRoles(roles, user?.activeProfile?.role);
      }

      return true;
    } catch (error) {
      throw new AppError(error?.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
