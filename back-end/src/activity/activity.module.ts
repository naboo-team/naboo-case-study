import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from 'src/auth/auth.module';
import { ActivityService } from './activity.service';
import { Activity, ActivitySchema } from './schema/activity.schema';
import { ActivityResolver } from './resolver/activity.resolver';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Activity.name, schema: ActivitySchema },
    ]),
    AuthModule,
    UserModule,
  ],
  exports: [ActivityService],
  providers: [ActivityService, ActivityResolver],
})
export class ActivityModule {}
