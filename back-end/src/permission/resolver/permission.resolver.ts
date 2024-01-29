import { Resolver, Query, Args } from '@nestjs/graphql';
import { PermissionService } from '../permission.service';
import { PermissionMapper } from '../mapper/permission.mapper';
import { PermissionDto } from '../types';

@Resolver('Permission')
export class PermissionResolver {
  constructor(
    private readonly permissionService: PermissionService,
    private readonly permissionMapper: PermissionMapper,
  ) {}

  @Query(() => [PermissionDto])
  async getPermissions(): Promise<PermissionDto[]> {
    const permissions = await this.permissionService.getAll();
    return permissions.map((permission) =>
      this.permissionMapper.convert(permission),
    );
  }

  @Query(() => PermissionDto)
  async getPermissionById(@Args('id') id: string): Promise<PermissionDto> {
    const permission = await this.permissionService.getById(id);
    return this.permissionMapper.convert(permission);
  }

  @Query(() => PermissionDto)
  async getPermissionByName(
    @Args('name') name: string,
  ): Promise<PermissionDto> {
    const permission = await this.permissionService.getById(name);
    return this.permissionMapper.convert(permission);
  }
}
