import { Field, ObjectType } from '@nestjs/graphql';
import { RoleDto } from 'src/role/types';

@ObjectType()
export class UserDto {
  @Field()
  id!: string;

  @Field()
  firstName!: string;

  @Field()
  lastName!: string;

  @Field()
  email!: string;

  @Field(() => RoleDto, { nullable: true })
  role?: RoleDto;
}
