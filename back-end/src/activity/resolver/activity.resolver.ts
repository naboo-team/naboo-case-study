import { Resolver, Query, Mutation, Args, Context, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ActivityService } from '../activity.service';
import { ActivityMapper } from '../mapper/activity.mapper';
import {
  ActivityDto,
  CreateActivityInput,
  MarkActivityAsFavoriteInput,
} from '../types';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserService } from 'src/user/user.service';
import { sortFavoriteActivities } from 'src/user/helpers/sortFavoriteActivities';
import { UserDto } from 'src/user/types/user.dto';
import { UserMapper } from 'src/user/mapper/user.mapper';

@Resolver('Activity')
export class ActivityResolver {
  constructor(
    private readonly activityService: ActivityService,
    private readonly activityMapper: ActivityMapper,
    private readonly userServices: UserService,
    private readonly userMapper: UserMapper,
  ) {}

  @Query(() => [ActivityDto])
  async getActivities(): Promise<ActivityDto[]> {
    const activities = await this.activityService.findAll();
    return activities.map((activity) => this.activityMapper.convert(activity));
  }

  @Query(() => [ActivityDto])
  async getLatestActivities(): Promise<ActivityDto[]> {
    const activities = await this.activityService.findLatest();
    return activities.map((activity) => this.activityMapper.convert(activity));
  }

  @Query(() => [ActivityDto])
  @UseGuards(AuthGuard)
  async getActivitiesByUser(@Context() context: any): Promise<ActivityDto[]> {
    const activities = await this.activityService.findByUser(context.user!.id);
    return activities.map((activity) => this.activityMapper.convert(activity));
  }

  @Query(() => [ActivityDto])
  @UseGuards(AuthGuard)
  async getUserFavoriteActivities(
    @Context() context: any,
  ): Promise<ActivityDto[]> {
    const user = await this.userServices.getById(context.user!.id);
    const activityIds = user.favoriteActivities.map(
      (favorite) => favorite.activityId,
    );
    const activities = await this.activityService.findByIds(activityIds);
    return [...user.favoriteActivities]
      .sort(sortFavoriteActivities)
      .reduce((orderedFavoriteActivities, { activityId }) => {
        const activity = activities.find(({ id }) => id === activityId);
        if (activity) {
          const activityDto = this.activityMapper.convert(activity);
          orderedFavoriteActivities.push(activityDto);
        }
        return orderedFavoriteActivities;
      }, [] as ActivityDto[]);
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
    return activities.map((activity) => this.activityMapper.convert(activity));
  }

  @Query(() => ActivityDto)
  async getActivity(@Args('id') id: string): Promise<ActivityDto> {
    const activity = await this.activityService.findOne(id);
    return this.activityMapper.convert(activity);
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
    return this.activityMapper.convert(activity);
  }

  @Mutation(() => Boolean)
  @UseGuards(AuthGuard)
  async markActivityAsFavorite(
    @Context() context: any,
    @Args('markActivityAsFavoriteInput')
    markActivityAsFavoriteInput: MarkActivityAsFavoriteInput,
  ): Promise<boolean> {
    const activity = await this.activityService.findOne(
      markActivityAsFavoriteInput.activityId,
    );
    if (!activity) {
      throw new Error('Activity not found');
    }
    await this.userServices.addFavoriteActivity({
      userId: context.user!.id,
      activityId: markActivityAsFavoriteInput.activityId,
    });

    return true;
  }
}
