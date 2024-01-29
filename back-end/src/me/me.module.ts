import { Module } from '@nestjs/common';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { MeResolver } from './resolver/me.resolver';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
  imports: [UserModule, AuthModule, ActivityModule],
  providers: [MeResolver],
})
export class MeModule {}
