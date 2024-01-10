import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  Int,
  Parent,
  ResolveField,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from '../user.service';
import { ActivityService } from 'src/activity/activity.service';
import { ActivityMapper } from 'src/activity/mapper/activity.mapper';
import { User } from '../schema/user.schema';
import { sortFavoriteActivities } from '../helpers/sortFavoriteActivities';
import { ActivityDto } from 'src/activity/types';

@Resolver('User')
export class ActivityResolver {
  constructor(
    private readonly activityService: ActivityService,
    private readonly activityMapper: ActivityMapper,
  ) {}

  @ResolveField('favoriteActivities', () => [ActivityDto])
  async getFavoriteActivities(@Parent() user: User) {
    const activityIds = user.favoriteActivities.map(
      (favorite) => favorite.activityId,
    );
    const activities = await this.activityService.findByIds(activityIds);
    return [...user.favoriteActivities]
      .sort(sortFavoriteActivities)
      .reduce((orderedFavoriteActivities, { activityId }) => {
        const activity = activities.find(({ id }) => id === activityId);
        if (activity) {
          const activityDto = this.activityMapper.convert(activity);
          orderedFavoriteActivities.push(activityDto);
        }
        return orderedFavoriteActivities;
      }, [] as ActivityDto[]);
  }
}
