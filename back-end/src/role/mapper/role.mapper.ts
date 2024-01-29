import { Injectable } from '@nestjs/common';
import { Mapper } from 'src/utils/mapper';
import { Role } from '../schema/role.schema';
import { RoleDto } from '../types';

@Injectable()
export class RoleMapper implements Mapper<Role, RoleDto> {
  convert(role: Role): RoleDto {
    return {
      id: role._id,
      name: role.name,
    };
  }
}
