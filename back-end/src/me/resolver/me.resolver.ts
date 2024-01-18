import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserService } from '../../user/user.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { User } from 'src/user/user.schema';
import { ContextWithJWTPayload } from 'src/auth/types/context';
import { UserPermissionGuard } from 'src/user/user.permissions.guard';
import { SetDebugModeInput } from './me.input';

@Resolver('Me')
export class MeResolver {
  constructor(private readonly userService: UserService) {}

  @Query(() => User)
  @UseGuards(AuthGuard)
  async getMe(@Context() context: ContextWithJWTPayload): Promise<User> {
    // the AuthGard will add the user to the context
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return this.userService.getById(context.jwtPayload.id);
  }

  @Mutation(() => User)
  @UseGuards(UserPermissionGuard('canEnableDebugMode'))
  async setDebugMode(
    @Context() context: ContextWithJWTPayload,
    @Args('setDebugModeInput') setDebugModeInputDto: SetDebugModeInput,
  ): Promise<User> {
    const { id: userId } = context.jwtPayload;
    return this.userService.setDebugMode({
      userId,
      enabled: setDebugModeInputDto.enabled,
    });
  }
}
