import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

@InputType()
export class SignInInput {
  @Field()
  @IsEmail()
  email!: string;

  @Field()
  @IsNotEmpty()
  password!: string;

  @Field({ nullable: true })
  isAdmin?: boolean;
}
@InputType()
export class SignUpInput extends SignInInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  firstName!: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  lastName!: string;
}
