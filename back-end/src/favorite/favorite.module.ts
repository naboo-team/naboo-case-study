import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { FavoriteService } from './favorite.service';
import { FavoriteMapper } from './mapper/favorite.mapper';
import { Favorite, FavoriteSchema } from './schema/favorite.schema';
import { FavoriteResolver } from './resolver/favorite.resolver';
import { Activity, ActivitySchema } from 'src/activity/schema/activity.schema';
import { ActivityModule } from 'src/activity/activity.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Favorite.name, schema: FavoriteSchema },
      { name: Activity.name, schema: ActivitySchema },
    ]),
    forwardRef(() => ActivityModule),
  ],
  exports: [FavoriteService, FavoriteMapper],
  providers: [FavoriteService, FavoriteMapper, FavoriteResolver],
})
export class FavoriteModule {}
