import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RoleDto {
  @Field()
  id!: string;

  @Field()
  name!: string;
}
