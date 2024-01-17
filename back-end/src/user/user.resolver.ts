import { Resolver, Parent, ResolveField } from '@nestjs/graphql';
import { User } from 'src/user/user.schema';
import { Activity } from 'src/activity/activity.schema';
import { UserPermissions } from './user.permissions.schema';
import { UserService } from './user.service';

@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}
  @ResolveField(() => [Activity])
  async favoriteActivities(@Parent() user: User): Promise<Activity[]> {
    await user.populate('favoriteActivities');
    return user.favoriteActivities;
  }

  @ResolveField(() => UserPermissions)
  async permissions(@Parent() user: User): Promise<UserPermissions> {
    return this.userService.getUserPermissions({ userId: user.id });
  }
}
