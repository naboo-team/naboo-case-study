import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Activity } from 'src/activity/activity.schema';
import { UserPermissions } from './user.permissions.schema';

@ObjectType()
@Schema({ timestamps: true })
export class User extends Document {
  constructor() {
    super();
    this.favoriteActivities = [];
  }

  @Field(() => ID)
  id!: string;

  @Prop({ required: true, enum: ['user', 'admin'], default: 'user' })
  role!: 'user' | 'admin';

  @Field()
  @Prop({ required: true })
  firstName!: string;

  @Field()
  @Prop({ required: true })
  lastName!: string;

  @Field()
  @Prop({ required: true, unique: true })
  email!: string;

  @Field()
  @Prop({ required: true })
  password!: string;

  @Prop()
  token?: string;

  @Field(() => [Activity])
  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Activity' }] })
  favoriteActivities: Activity[];

  @Field(() => UserPermissions)
  permissions!: UserPermissions;

  @Field(() => Boolean)
  @Prop({ default: false })
  debugModeEnabled!: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
