import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SignUpInput } from 'src/auth/types';
import { User } from './schema/user.schema';

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

  async addFavorite(userId: string, activityId: string): Promise<User> {
    const user = await this.getById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    if (!user.favourites?.includes(activityId)) {
      user.favourites?.push(activityId);
      await user.save();
    }
    return user;
  }

  async removeFavorite(userId: string, activityId: string): Promise<User> {
    const user = await this.getById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.favourites = user.favourites?.filter((id) => id !== activityId);
    console.log(user, activityId);
    await user.save();
    return user;
  }
}
