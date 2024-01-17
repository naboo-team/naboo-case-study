import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpInput } from 'src/auth/types';
import { User } from './user.schema';
import { Activity } from 'src/activity/activity.schema';
import * as bcrypt from 'bcrypt';
import { UserPermissions } from './user.permissions.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    @InjectModel(Activity.name)
    private activityModel: Model<Activity>,
  ) {}

  async getByEmail(email: string): Promise<User> {
    const user = await this.userModel.findOne({ email: email }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

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

  async createUser(
    data: SignUpInput & {
      role?: User['role'];
    },
  ): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = new this.userModel({ ...data, password: hashedPassword });
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
  }: {
    userId: string;
    activityId: string;
    position?: number | null;
  }): Promise<User> {
    const user = await this.userModel.findById(userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const activity = await this.activityModel.findById(activityId);
    if (!activity) {
      throw new NotFoundException('Activity not found');
    }

    if (
      user.favoriteActivities.some(
        (activity) => activity._id.toString() === activityId,
      )
    ) {
      throw new Error('Activity already favorited');
    }

    user.favoriteActivities.push(activity);
    return user.save();
  }

  async hasUserFavoritedActivity({
    activityId,
    userId,
  }: {
    activityId: string;
    userId: string;
  }): Promise<boolean> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user.favoriteActivities.some(
      (activity) => activity._id.toString() === activityId,
    );
  }

  async removeFavoriteActivity({
    userId,
    activityId,
  }: {
    userId: string;
    activityId: string;
    position?: number;
  }): Promise<User> {
    const user = await this.userModel.findByIdAndUpdate(
      userId,
      {
        $pull: {
          favoriteActivities: activityId,
        },
      },
      { new: true },
    );
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserPermissions({
    userId,
  }: {
    userId: string;
  }): Promise<UserPermissions> {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return {
      canEnableDebugMode: user.role === 'admin',
    };
  }
}
