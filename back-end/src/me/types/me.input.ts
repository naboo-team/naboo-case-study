import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class setFavoritesInput {
  @Field(() => [String])
  @IsNotEmpty()
  activitiesIds!: string[];
}
