import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserMapper } from './mapper/user.mapper';
import { User, UserSchema } from './schema/user.schema';
import { UserService } from './user.service';
import { UserResolver } from './resolver/user.resolver';
import { JwtService } from '@nestjs/jwt';
import { RoleModule } from 'src/role/role.module';
import { ActivityModule } from 'src/activity/activity.module';
import { Activity, ActivitySchema } from 'src/activity/schema/activity.schema';
import { Role, RoleSchema } from 'src/role/schema/role.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Activity.name, schema: ActivitySchema },
      { name: Role.name, schema: RoleSchema },
    ]),
    RoleModule,
    forwardRef(() => ActivityModule),
  ],
  exports: [UserService, UserMapper],
  providers: [JwtService, UserService, UserMapper, UserResolver],
})
export class UserModule {}
