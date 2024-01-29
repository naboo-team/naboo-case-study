import { Activity } from 'src/activity/schema/activity.schema';

export function isActivity(object: any): object is Activity {
  return object && typeof object === 'object' && 'name' in object;
}
