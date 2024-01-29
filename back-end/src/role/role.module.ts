import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RoleService } from './role.service';
import { RoleMapper } from './mapper/role.mapper';
import { Role, RoleSchema } from './schema/role.schema';
import { RoleResolver } from './resolver/role.resolver';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  exports: [RoleService, RoleMapper],
  providers: [RoleService, RoleMapper, RoleResolver],
})
export class RoleModule {}
