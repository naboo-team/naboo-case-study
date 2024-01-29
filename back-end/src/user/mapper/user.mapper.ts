import { Injectable } from '@nestjs/common';
import { Mapper } from 'src/utils/mapper';
import { User } from '../schema/user.schema';
import { UserDto } from '../types/user.dto';
import { RoleDto } from 'src/role/types';

@Injectable()
export class UserMapper implements Mapper<User, UserDto> {
  convert(user: User): UserDto {
    const role = user.role instanceof RoleDto ? user.role : undefined;

    return {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: role,
    };
  }
}
