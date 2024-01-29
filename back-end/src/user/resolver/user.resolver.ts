import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { UserService } from '../user.service';
import { UserMapper } from '../mapper/user.mapper';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserDto } from '../types/user.dto';
import { CreateUserInput } from '../types/user.input';
import { RoleService } from 'src/role/role.service';

@Resolver('User')
export class UserResolver {
  constructor(
    private readonly userService: UserService,
    private readonly userMapper: UserMapper,
    private readonly roleService: RoleService,
  ) {}

  @Query(() => [UserDto])
  @UseGuards(AuthGuard)
  async getUsers(): Promise<UserDto[]> {
    const users = await this.userService.getAll();
    return users.map((user) => this.userMapper.convert(user));
  }

  @Query(() => UserDto)
  async getUser(@Args('id') id: string): Promise<UserDto> {
    const user = await this.userService.getById(id);
    return this.userMapper.convert(user);
  }

  @Mutation(() => UserDto)
  async createUser(
    @Context() context: any,
    @Args('createUserInput') createUserDto: CreateUserInput,
  ): Promise<UserDto> {
    const user = await this.userService.createUser(createUserDto);
    return this.userMapper.convert(user);
  }
}
