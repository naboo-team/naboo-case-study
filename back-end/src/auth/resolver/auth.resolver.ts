import { Resolver, Mutation, Args, Context } from '@nestjs/graphql';
import { SignInDto, SignInInput, SignUpInput } from '../types';
import { UserDto } from '../../user/types/user.dto';
import { AuthService } from '../auth.service';
import { UserMapper } from '../../user/mapper/user.mapper';

@Resolver('Auth')
export class AuthResolver {
  constructor(
    private authService: AuthService,
    private userMapper: UserMapper,
  ) {}

  @Mutation(() => SignInDto)
  async login(
    @Args('signInInput') loginUserDto: SignInInput,
    @Context() ctx: any,
  ): Promise<SignInDto> {
    const data = await this.authService.signIn(loginUserDto);
    ctx.res.cookie('jwt', data.access_token, {
      httpOnly: true,
      domain: process.env.FRONTEND_DOMAIN,
    });

    return data;
  }

  @Mutation(() => UserDto)
  async register(
    @Args('signUpInput') createUserDto: SignUpInput,
  ): Promise<UserDto> {
    const user = await this.authService.signUp(createUserDto);
    return this.userMapper.convert(user);
  }

  @Mutation(() => Boolean)
  async logout(@Context() ctx: any): Promise<boolean> {
    ctx.res.clearCookie('jwt', {
      httpOnly: true,
      domain: process.env.FRONTEND_DOMAIN,
    });
    return true;
  }
}
