import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ActivityService } from 'src/activity/activity.service';
import { Activity, ActivitySchema } from 'src/activity/schema/activity.schema';
import { User, UserSchema } from 'src/user/schema/user.schema';
import { UserService } from 'src/user/user.service';
import { ActivityModule } from '../activity/activity.module';
import { UserModule } from '../user/user.module';
import { RoleModule } from '../role/role.module';
import { PermissionModule } from 'src/permission/permission.module';
import { RoleService } from 'src/role/role.service';
import { PermissionService } from 'src/permission/permission.service';
import { Role, RoleSchema } from 'src/role/schema/role.schema';
import {
  Permission,
  PermissionSchema,
} from 'src/permission/schema/permission.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Activity.name, schema: ActivitySchema },
      { name: Role.name, schema: RoleSchema },
      { name: Permission.name, schema: PermissionSchema },
    ]),
    UserModule,
    ActivityModule,
    RoleModule,
    PermissionModule,
  ],
  providers: [UserService, ActivityService, RoleService, PermissionService],
})
export class SeedModule {}
