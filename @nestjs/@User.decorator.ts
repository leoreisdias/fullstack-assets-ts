import { createParamDecorator, ExecutionContext } from '@nestjs/common';

class UserDto {
    id: string;
    name: string
    // others
}

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
