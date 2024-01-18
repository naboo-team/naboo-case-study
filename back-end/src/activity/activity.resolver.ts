import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  Int,
  Parent,
  ResolveField,
  ID,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ActivityService } from './activity.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from 'src/user/user.service';
import { Activity } from './activity.schema';

import {
  CreateActivityInput,
  MarkActivityAsFavoriteInput,
  UnmarkActivityAsFavoriteInput,
} from './activity.inputs.dto';
import { User } from 'src/user/user.schema';
import { ContextWithJWTPayload } from 'src/auth/types/context';

@Resolver(() => Activity)
export class ActivityResolver {
  constructor(
    private readonly activityService: ActivityService,
    private readonly userServices: UserService,
  ) {}

  @ResolveField(() => ID)
  id(@Parent() activity: Activity): string {
    return activity._id.toString();
  }

  @ResolveField(() => Boolean)
  async isFavorited(
    @Parent() activity: Activity,
    @Context() context: Partial<ContextWithJWTPayload>,
  ): Promise<boolean> {
    if (!context.jwtPayload) {
      return false;
    }
    return this.userServices.hasUserFavoritedActivity({
      activityId: activity._id.toString(),
      userId: context.jwtPayload.id,
    });
  }

  @ResolveField(() => User)
  async owner(@Parent() activity: Activity): Promise<User> {
    await activity.populate('owner');
    return activity.owner;
  }

  @ResolveField(() => Date)
  async createdAt(
    @Parent() activity: Activity,
    @Context() context: ContextWithJWTPayload,
  ): Promise<Date | null> {
    if (!context.jwtPayload) {
      return null;
    }
    const user = await this.userServices.getById(context.jwtPayload.id);
    if (!user) {
      return null;
    }

    if (user.debugModeEnabled) {
      return activity.createdAt;
    }
    return null;
  }

  @Query(() => [Activity])
  async getActivities(): Promise<Activity[]> {
    return this.activityService.findAll();
  }

  @Query(() => [Activity])
  async getLatestActivities(): Promise<Activity[]> {
    return this.activityService.findLatest();
  }

  @Query(() => [Activity])
  @UseGuards(AuthGuard)
  async getActivitiesByUser(
    @Context() context: ContextWithJWTPayload,
  ): Promise<Activity[]> {
    return this.activityService.findByUser(context.jwtPayload.id);
  }

  @Query(() => [String])
  async getCities(): Promise<string[]> {
    const cities = await this.activityService.findCities();
    return cities;
  }

  @Query(() => [Activity])
  async getActivitiesByCity(
    @Args('city') city: string,
    @Args({ name: 'activity', nullable: true }) activity?: string,
    @Args({ name: 'price', nullable: true, type: () => Int }) price?: number,
  ): Promise<Activity[]> {
    return this.activityService.findByCity(city, activity, price);
  }

  @Query(() => Activity)
  async getActivity(@Args('id') id: string): Promise<Activity> {
    return this.activityService.findOne(id);
  }

  @Mutation(() => Activity)
  @UseGuards(AuthGuard)
  async createActivity(
    @Context() context: ContextWithJWTPayload,
    @Args('createActivityInput') createActivity: CreateActivityInput,
  ): Promise<Activity> {
    return this.activityService.create(context.jwtPayload.id, createActivity);
  }

  @Mutation(() => Activity)
  @UseGuards(AuthGuard)
  async markActivityAsFavorite(
    @Context() context: ContextWithJWTPayload,
    @Args('markActivityAsFavoriteInput')
    markActivityAsFavoriteInput: MarkActivityAsFavoriteInput,
  ): Promise<Activity> {
    const activity = await this.activityService.findOne(
      markActivityAsFavoriteInput.activityId,
    );
    if (!activity) {
      throw new Error('Activity not found');
    }
    await this.userServices.addFavoriteActivity({
      userId: context.jwtPayload.id,
      activityId: markActivityAsFavoriteInput.activityId,
    });

    return activity;
  }

  @Mutation(() => Activity)
  @UseGuards(AuthGuard)
  async unmarkActivityAsFavorite(
    @Context() context: ContextWithJWTPayload,
    @Args('unmarkActivityAsFavoriteInput')
    markActivityAsFavoriteInput: UnmarkActivityAsFavoriteInput,
  ): Promise<Activity> {
    const activity = await this.activityService.findOne(
      markActivityAsFavoriteInput.activityId,
    );
    if (!activity) {
      throw new Error('Activity not found');
    }
    await this.userServices.removeFavoriteActivity({
      userId: context.jwtPayload.id,
      activityId: markActivityAsFavoriteInput.activityId,
    });

    return activity;
  }
}
