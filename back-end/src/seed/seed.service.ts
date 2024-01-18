import { Injectable, Logger } from '@nestjs/common';
import { ActivityService } from '../activity/activity.service';
import { UserService } from '../user/user.service';
import { activities as activitiesData } from './activity.data';
import { user as userData, admin as adminData } from './user.data';

@Injectable()
export class SeedService {
  constructor(
    private userService: UserService,
    private activityService: ActivityService,
  ) {}

  async execute(): Promise<void> {
    let user = await this.userService.findByEmail(userData.email);
    const userExisted = Boolean(user);
    if (!user) {
      user = await this.userService.createUser(userData);
    }

    const admin = await this.userService.findByEmail(adminData.email);
    if (!admin) {
      await this.userService.createUser(adminData);
    }

    if (!userExisted) {
      try {
        await Promise.all(
          activitiesData.map((activity) =>
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            this.activityService.create(user!._id, activity),
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
