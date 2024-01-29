import { Resolver, Query, Mutation, Args, Context, Int } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { ActivityService } from '../activity.service';
import { ActivityMapper } from '../mapper/activity.mapper';
import { ActivityDto, CreateActivityInput } from '../types';
import { AuthGuard } from 'src/auth/auth.guard';

@Resolver('Activity')
export class ActivityResolver {
  constructor(
    private readonly activityService: ActivityService,
    private readonly activityMapper: ActivityMapper,
  ) {}

  @Query(() => [ActivityDto])
  async getActivities(): Promise<ActivityDto[]> {
    const activities = await this.activityService.getAll();

    return Promise.all(
      activities.map(async (activity) => {
        const activityDto = this.activityMapper.convert(activity);
        return activityDto;
      }),
    );
  }

  @Query(() => [ActivityDto])
  async getLatestActivities(): Promise<ActivityDto[]> {
    const activities = await this.activityService.findLatest();
    return activities.map((activity) => this.activityMapper.convert(activity));
  }

  @Query(() => [ActivityDto])
  @UseGuards(AuthGuard)
  async getActivitiesByUser(@Context() context: any): Promise<ActivityDto[]> {
    const activities = await this.activityService.getByUser(context.user!.id);
    return activities.map((activity) => this.activityMapper.convert(activity));
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
    const activity = await this.activityService.getById(id);
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
}
