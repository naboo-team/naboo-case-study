import { Field, ObjectType } from '@nestjs/graphql';
import { ActivityDto } from 'src/activity/types';
import { User } from '../schema/user.schema';

@ObjectType()
export class UserDto {
  constructor(private readonly user: User) {}
  @Field()
  get id(): string {
    return this.user._id;
  }

  @Field()
  get firstName(): string {
    return this.user.firstName;
  }

  @Field()
  get lastName(): string {
    return this.user.lastName;
  }

  @Field()
  get email(): string {
    return this.user.email;
  }

  @Field((type) => [ActivityDto])
  favorites!: ActivityDto[];
}
