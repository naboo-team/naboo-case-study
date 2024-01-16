import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber, Min } from 'class-validator';

@InputType()
export class CreateActivityInput {
  @Field()
  @IsNotEmpty()
  name!: string;

  @Field()
  @IsNotEmpty()
  city!: string;

  @Field()
  @IsNotEmpty()
  description!: string;

  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  price!: number;
}

@InputType()
export class MarkActivityAsFavoriteInput {
  @Field()
  @IsNotEmpty()
  activityId!: string;
}
