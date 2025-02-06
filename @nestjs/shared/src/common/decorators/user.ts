import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserDto } from 'types/user.dto';

export const User = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const { user } = request.user ?? {};

    const userDto = user as UserDto;

    if (!userDto?.id) {
      throw new Error('User not found');
    }

    return userDto;
  },
);
