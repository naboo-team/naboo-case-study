import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class SetDebugModeInput {
  @Field()
  enabled!: boolean;
}
