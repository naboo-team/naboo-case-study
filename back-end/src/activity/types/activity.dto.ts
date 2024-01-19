import { Field, Int, ObjectType } from '@nestjs/graphql';
import { UserDto } from 'src/user/types/user.dto';
import { Activity } from '../schema/activity.schema';
import { CurrentUser } from 'src/utils/user.decorator';

@ObjectType()
export class ActivityDto {
  constructor(private readonly activity: Activity) {}
  @Field()
  get id(): string {
    return this.activity._id;
  }

  @Field()
  get name(): string {
    return this.activity.name;
  }

  @Field()
  get city(): string {
    return this.activity.city;
  }

  @Field()
  get description(): string {
    return this.activity.description;
  }

  @Field(() => Int)
  get price(): number {
    return this.activity.price;
  }

  @Field(() => UserDto)
  get owner(): UserDto {
    return new UserDto(this.activity.owner);
  }
}
