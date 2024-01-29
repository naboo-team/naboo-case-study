import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreatePermissionInput {
  @Field()
  @IsNotEmpty()
  name!: string;
}
