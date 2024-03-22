import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class User extends Document {
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

  @Prop({
    type: Array.of(String),
    ref: 'Activity',
    default: [],
  })
  favourites?: string[];

  @Prop()
  isAdmin?: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
