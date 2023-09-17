import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export interface UserInfo {
  username: string;
  id: string;
  iat: number;
  exp: number;
}

export const User = createParamDecorator(
  (_, context: ExecutionContext): UserInfo => {
    const request = context.switchToHttp().getRequest();
    return request.user;
  },
);
