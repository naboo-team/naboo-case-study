import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Activity } from 'src/activity/schema/activity.schema';
import { User } from 'src/user/schema/user.schema';

@Schema()
export class Favorite extends Document {
  @Prop({ type: Types.ObjectId, ref: 'User' })
  user!: User | Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'Activity' })
  activity!: Activity | Types.ObjectId;
}

export const FavoriteSchema = SchemaFactory.createForClass(Favorite);
