import {
  Resolver,
  Query,
  Mutation,
  Args,
  Context,
  Int,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { Req, UseGuards } from '@nestjs/common';
import { ActivityService } from '../activity.service';
import { ActivityDto, CreateActivityInput } from '../types';
import { AttachUser, AuthGuard } from 'src/auth/auth.guard';
import { CurrentUser } from 'src/utils/user.decorator';
import { UserDto } from 'src/user/types/user.dto';
import { UserService } from 'src/user/user.service';
import { Types } from 'mongoose';

@Resolver(() => ActivityDto)
export class ActivityResolver {
  constructor(
    private readonly activityService: ActivityService,
    private readonly userService: UserService,
  ) {}

  @Query(() => [ActivityDto])
  async getActivities(): Promise<ActivityDto[]> {
    const activities = await this.activityService.findAll();
    return activities.map((activity) => new ActivityDto(activity));
  }

  @Query(() => [ActivityDto])
  async getLatestActivities(): Promise<ActivityDto[]> {
    const activities = await this.activityService.findLatest();
    return activities.map((activity) => new ActivityDto(activity));
  }

  @Query(() => [ActivityDto])
  @UseGuards(AuthGuard)
  async getActivitiesByUser(@Context() context: any): Promise<ActivityDto[]> {
    const activities = await this.activityService.findByUser(context.user!.id);
    return activities.map((activity) => new ActivityDto(activity));
  }

  @Query(() => [String])
  async getCities(): Promise<string[]> {
    const cities = await this.activityService.findCities();
    return cities;
  }

  @Query(() => [ActivityDto])
  async getActivitiesByCity(
    @Args('city') city: string,
    @Args({ name: 'activity', nullable: true }) activity?: string,
    @Args({ name: 'price', nullable: true, type: () => Int }) price?: number,
  ): Promise<ActivityDto[]> {
    const activities = await this.activityService.findByCity(
      city,
      activity,
      price,
    );
    return activities.map((activity) => new ActivityDto(activity));
  }

  @Query(() => ActivityDto)
  async getActivity(@Args('id') id: string): Promise<ActivityDto> {
    const activity = await this.activityService.findOne(id);
    return new ActivityDto(activity);
  }

  @Mutation(() => ActivityDto)
  @UseGuards(AuthGuard)
  async createActivity(
    @Context() context: any,
    @Args('createActivityInput') createActivityDto: CreateActivityInput,
  ): Promise<ActivityDto> {
    const activity = await this.activityService.create(
      context.user!.id,
      createActivityDto,
    );
    return new ActivityDto(activity);
  }

  @Mutation(() => ActivityDto)
  @UseGuards(AuthGuard)
  async toggleFavorite(
    @CurrentUser() user: { id: string },
    @Args('activityId') activityId: string,
  ): Promise<ActivityDto> {
    const userData = await this.userService.getById(user.id);
    if (userData.favorites.includes(new Types.ObjectId(activityId))) {
      userData.favorites = userData.favorites.filter(
        (favorite) => favorite.toString() !== activityId,
      );
    } else {
      userData.favorites.push(new Types.ObjectId(activityId));
    }
    await userData.save();
    const activity = await this.activityService.findOne(activityId);
    return new ActivityDto(activity);
  }

  @ResolveField(() => Boolean)
  async isFavorite(
    @CurrentUser() user: UserDto,
    @Parent() activity: ActivityDto,
  ) {
    if (!user) return false;
    const userData = await this.userService.getById(user.id);
    return userData.favorites.includes(new Types.ObjectId(activity.id));
  }

  @ResolveField('createdAt', () => Date, { nullable: true }) //nullable for non-admin users
  async createdAt(
    @Parent() activity: ActivityDto,
    @CurrentUser() user: { isAdmin: boolean },
  ) {
    if (!user || !user.isAdmin) return null;
    const { createdAt } = await this.activityService.findOne(activity.id);
    return createdAt;
  }
}
