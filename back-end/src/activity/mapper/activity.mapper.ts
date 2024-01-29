import { Injectable } from '@nestjs/common';
import { Mapper } from 'src/utils/mapper';
import { Activity } from '../schema/activity.schema';
import { ActivityDto } from '../types';
import { RoleDto } from 'src/role/types';

@Injectable()
export class ActivityMapper implements Mapper<Activity, ActivityDto> {
  convert(activity: Activity): ActivityDto {
    const role =
      activity.owner.role instanceof RoleDto ? activity.owner.role : undefined;

    return {
      id: activity._id,
      name: activity.name,
      city: activity.city,
      description: activity.description,
      price: activity.price,
      owner: {
        id: activity.owner._id,
        firstName: activity.owner.firstName,
        lastName: activity.owner.lastName,
        email: activity.owner.email,
        role: role,
      },
    };
  }
}
