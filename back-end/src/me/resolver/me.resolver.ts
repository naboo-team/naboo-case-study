import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { UserMapper } from '../../user/mapper/user.mapper';
import { UserService } from '../../user/user.service';
import { UserDto } from '../../user/types/user.dto';
import { Logger, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';

@Resolver('Me')
export class MeResolver {
  private readonly logger = new Logger(MeResolver.name);

  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
  ) {}

  @Query(() => UserDto)
  @UseGuards(AuthGuard)
  async getMe(@Context() context: any): Promise<UserDto> {
    const user = await this.userService.getById(context.user!.id);
    return this.userMapper.convert(user);
  }

  @Mutation(() => UserDto)
  @UseGuards(AuthGuard)
  async addFavorite(
    @Context() context: any,
    @Args('activityId') activityId: string,
  ): Promise<UserDto> {
    const user = await this.userService.addFavorite(
      context.user?.id,
      activityId,
    );
    this.logger.log(
      `ADD Favourite => userId: ${context.user?.id} activityId: ${activityId}`,
    );
    return this.userMapper.convert(user);
  }

  @Mutation(() => UserDto)
  @UseGuards(AuthGuard)
  async removeFavorite(
    @Context() context: any,
    @Args('activityId') activityId: string,
  ): Promise<UserDto> {
    const user = await this.userService.removeFavorite(
      context.user?.id,
      activityId,
    );
    this.logger.log(
      `REMOVE Favourite => userId: ${context.user?.id} activityId: ${activityId}`,
    );
    return this.userMapper.convert(user);
  }
}
