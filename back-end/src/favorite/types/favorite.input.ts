import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateFavoriteInput {
  @Field(() => String)
  userId!: string;

  @Field(() => String)
  activityId!: string;
}
