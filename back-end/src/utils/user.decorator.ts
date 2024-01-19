import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserDto } from 'src/user/types/user.dto';

export const CurrentUser = createParamDecorator(
  (_, context: ExecutionContext) => {
    const gqlContext = GqlExecutionContext.create(context);
    const ctx = gqlContext.getContext() as { user: UserDto };
    return ctx.user;
  },
);
