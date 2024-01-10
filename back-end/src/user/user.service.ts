import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpInput } from 'src/auth/types';
import { User } from './schema/user.schema';
import { FAVORITE_POSITION_STEP } from './constants/favorites';
import { sortFavoriteActivities } from './helpers/sortFavoriteActivities';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
  ) {}

  async getByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // ! TODO: fix type
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email: email }).exec();
  }

  async getById(id: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async createUser(data: SignUpInput): Promise<User> {
    const user = new this.userModel(data);
    return user.save();
  }

  async updateToken(id: string, token: string): Promise<User> {
    const user = await this.userModel.findById(id).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.token = token;
    return user.save();
  }

  async countDocuments(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }

  async addFavoriteActivity({
    userId,
    activityId,
    position,
  }: {
    userId: string;
    activityId: string;
    position?: number;
  }): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const orderedFavoriteActivities = [...user.favoriteActivities].sort(
      sortFavoriteActivities,
    );
    // position is optional, if not provided, should be inferior to the current first item position
    const firstPosition = orderedFavoriteActivities.at(0)?.position ?? 0;
    const favoriteActivity = {
      activityId,
      position: position ?? firstPosition - FAVORITE_POSITION_STEP,
    };
    user.favoriteActivities.push(favoriteActivity);
    return user.save();
  }

  async removeFavoriteActivity({
    userId,
    activityId,
  }: {
    userId: string;
    activityId: string;
    position?: number;
  }): Promise<User> {
    const user = await this.userModel.findById(userId).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const filteredFavorites = user.favoriteActivities.filter(
      (favoriteActivity) => favoriteActivity.activityId !== activityId,
    );

    user.favoriteActivities = filteredFavorites;
    return user.save();
  }
}
