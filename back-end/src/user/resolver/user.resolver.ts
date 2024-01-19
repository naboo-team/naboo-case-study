import { ActivityService } from 'src/activity/activity.service';
import { UserService } from '../user.service';
import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { User } from '../schema/user.schema';
import { ActivityDto } from 'src/activity/types';
import { UserDto } from '../types/user.dto';

@Resolver(() => UserDto)
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly activityService: ActivityService,
  ) {}

  @ResolveField('favorites', () => [ActivityDto])
  async favorites(@Parent() user: User): Promise<ActivityDto[]> {
    const { favorites } = await this.userService.getById(user.id);
    const activities = await this.activityService.findAll({
      id: { $in: favorites },
    });
    return activities.map((activity) => new ActivityDto(activity));
  }
}
