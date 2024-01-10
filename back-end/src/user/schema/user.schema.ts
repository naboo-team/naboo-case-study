import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { FavoriteActivity } from '../types/favoriteActivities';

@Schema({ timestamps: true })
export class User extends Document {
  constructor() {
    super();
    this.favoriteActivities = [];
  }

  @Prop({ required: true })
  firstName!: string;

  @Prop({ required: true })
  lastName!: string;

  @Prop({ required: true, unique: true })
  email!: string;

  @Prop({ required: true })
  password!: string;

  @Prop()
  token?: string;

  @Prop({ required: true, default: [] })
  favoriteActivities: FavoriteActivity[];
}

export const UserSchema = SchemaFactory.createForClass(User);
