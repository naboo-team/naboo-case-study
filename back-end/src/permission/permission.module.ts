import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PermissionService } from './permission.service';
import { PermissionMapper } from './mapper/permission.mapper';
import { Permission, PermissionSchema } from './schema/permission.schema';
import { PermissionResolver } from './resolver/permission.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Permission.name, schema: PermissionSchema },
    ]),
  ],
  exports: [PermissionService, PermissionMapper],
  providers: [PermissionService, PermissionMapper, PermissionResolver],
})
export class PermissionModule {}
