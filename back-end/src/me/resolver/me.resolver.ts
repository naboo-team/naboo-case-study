import {
  Args,
  Context,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { UserService } from '../../user/user.service';
import { UserDto } from '../../user/types/user.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../auth/auth.guard';
import { ActivityDto } from 'src/activity/types';
import { User } from 'src/user/schema/user.schema';
import { ActivityService } from 'src/activity/activity.service';
import { CurrentUser } from 'src/utils/user.decorator';
import { setFavoritesInput } from '../types/me.input';
import { Types } from 'mongoose';

@Resolver(() => UserDto)
export class MeResolver {
  constructor(
    private readonly userService: UserService,
    private readonly activityService: ActivityService,
  ) {}

  @Query(() => UserDto)
  @UseGuards(AuthGuard)
  async getMe(@Context() context: any): Promise<UserDto> {
    const user = await this.userService.getById(context.user!.id);
    return new UserDto(user);
  }

  @Mutation(() => UserDto)
  @UseGuards(AuthGuard)
  async setFavorites(
    @CurrentUser() user: { id: string },
    @Args('setFavoritesInput') setFavoriteInput: setFavoritesInput,
  ): Promise<UserDto> {
    const userData = await this.userService.getById(user.id);
    userData.favorites = setFavoriteInput.activitiesIds.map(
      (id) => new Types.ObjectId(id),
    );
    await userData.save();
    return new UserDto(userData);
  }

  @ResolveField('favorites', () => [ActivityDto])
  async favorites(@Parent() user: User): Promise<ActivityDto[]> {
    const { favorites } = await this.userService.getById(user.id);
    const activities = await this.activityService.findAll({
      _id: { $in: favorites },
    });

    return favorites
      .map((id) => {
        const activity = activities.find((a) => a.id === id.toString());
        if (activity) {
          return new ActivityDto(activity);
        }
        return null;
      })
      .filter(Boolean) as ActivityDto[];
  }
}
