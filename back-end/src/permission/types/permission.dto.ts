import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class PermissionDto {
  @Field()
  id!: string;

  @Field()
  name!: string;
}
