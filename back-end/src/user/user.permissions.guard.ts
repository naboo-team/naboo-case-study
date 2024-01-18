import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UserService } from './user.service';
import { UserPermissionsType } from './user.permissions.schema';
import { ContextWithJWTPayload } from 'src/auth/types/context';

export function UserPermissionGuard(requiredPermission: UserPermissionsType) {
  @Injectable()
  class UserPermissionGuardClass implements CanActivate {
    userService: UserService;
    constructor(userService: UserService) {
      this.userService = userService;
    }
    async canActivate(context: ExecutionContext): Promise<boolean> {
      const gqlContext = GqlExecutionContext.create(context);
      const ctx = gqlContext.getContext<ContextWithJWTPayload>();

      if (!ctx.jwtPayload) throw new UnauthorizedException();

      const { id: userId } = ctx.jwtPayload;

      const permissions = await this.userService.getUserPermissions({ userId });

      return permissions[requiredPermission];
    }
  }

  return UserPermissionGuardClass;
}
