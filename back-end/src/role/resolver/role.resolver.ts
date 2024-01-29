import { Resolver, Query, Args } from '@nestjs/graphql';
import { RoleService } from '../role.service';
import { RoleMapper } from '../mapper/role.mapper';
import { RoleDto } from '../types';

@Resolver('Role')
export class RoleResolver {
  constructor(
    private readonly roleService: RoleService,
    private readonly roleMapper: RoleMapper,
  ) {}

  @Query(() => [RoleDto])
  async getRoles(): Promise<RoleDto[]> {
    const roles = await this.roleService.getAll();
    return roles.map((role) => this.roleMapper.convert(role));
  }

  @Query(() => RoleDto)
  async getRoleById(@Args('id') id: string): Promise<RoleDto> {
    const role = await this.roleService.getById(id);
    return this.roleMapper.convert(role);
  }

  @Query(() => RoleDto)
  async getRoleByName(@Args('name') name: string): Promise<RoleDto> {
    const role = await this.roleService.getById(name);
    return this.roleMapper.convert(role);
  }
}
