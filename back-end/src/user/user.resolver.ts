import { Resolver, Parent, ResolveField } from '@nestjs/graphql';
import { User } from 'src/user/user.schema';
import { Activity } from 'src/activity/activity.schema';

@Resolver(() => User)
export class UserResolver {
  @ResolveField(() => [Activity])
  async favoriteActivities(@Parent() user: User): Promise<Activity[]> {
    await user.populate('favoriteActivities');
    return user.favoriteActivities;
  }
}
