import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Favorite } from './schema/favorite.schema';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectModel(Favorite.name)
    private favoriteModel: Model<Favorite>,
  ) {}

  async getAll(): Promise<Favorite[]> {
    return this.favoriteModel
      .find()
      .populate('user')
      .populate('activity')
      .exec();
  }

  async getUserFavorites(userId: string): Promise<Favorite[]> {
    return this.favoriteModel
      .find({ user: userId })
      .populate({
        path: 'activity',
        populate: { path: 'owner' },
      })
      .exec();
  }

  async getFavorite(userId: string, activityId: string): Promise<boolean> {
    const favorite = await this.favoriteModel
      .findOne({ user: userId, activity: activityId })
      .exec();
    return !!favorite;
  }

  async toggleFavorite(userId: string, activityId: string): Promise<boolean> {
    const existingFavorite = await this.favoriteModel
      .findOne({ user: userId, activity: activityId })
      .exec();

    if (existingFavorite) {
      await this.favoriteModel.deleteOne({ _id: existingFavorite.id }).exec();
      return false;
    } else {
      await this.favoriteModel.create({ user: userId, activity: activityId });
      return true;
    }
  }
}
