import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class UserPermissions {
  @Field()
  canEnableDebugMode!: boolean;
}
