import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class FavoriteDto {
  @Field(() => String)
  id!: string;

  @Field(() => String)
  userId!: string;

  @Field(() => String)
  activityId!: string;
}
