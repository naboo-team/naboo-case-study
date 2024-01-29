import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { ActivityService } from '../activity/activity.service';
import { UserService } from '../user/user.service';
import { activities as activitiesData } from './activity.data';
import { users as usersData } from './user.data';
import { RoleService } from '../role/role.service';
import { roles as rolesData } from './role.data';

@Injectable()
export class SeedService {
  constructor(
    private userService: UserService,
    private activityService: ActivityService,
    private roleService: RoleService,
  ) {}

  async execute(): Promise<void> {
    const users = await this.userService.countDocuments();
    const activities = await this.activityService.countDocuments();
    const roles = await this.activityService.countDocuments();
    if (roles === 0) {
      await Promise.all(
        rolesData.map((role) => this.roleService.create(role.name)),
      );
    }
    if (users === 0 && activities === 0) {
      try {
        const createdUsers = await Promise.all(
          usersData.map(async (user) => {
            return await this.userService.createUser({
              ...user,
              password: await bcrypt.hash(user.password, 10),
            });
          }),
        );

        await Promise.all(
          activitiesData.map((activity) =>
            createdUsers.map((user) =>
              this.activityService.create(user._id, activity),
            ),
          ),
        );
        Logger.log('Seeding successful!');
      } catch (error) {
        Logger.error(error);
        throw error;
      }
    }
  }
}
