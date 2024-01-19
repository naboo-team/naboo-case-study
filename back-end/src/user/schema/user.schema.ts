import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes, Types } from 'mongoose';

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
  token?: string; // ? not sure of this a user can have multiple tokens

  @Prop([{ type: SchemaTypes.ObjectId, ref: 'Activity' }])
  favorites!: Types.ObjectId[];
  activities: any;
}

export const UserSchema = SchemaFactory.createForClass(User);
