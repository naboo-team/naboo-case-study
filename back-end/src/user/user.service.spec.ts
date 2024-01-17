import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserModule } from './user.module';
import { randomUUID } from 'crypto';
import { ActivityService } from 'src/activity/activity.service';
import { ActivityModule } from 'src/activity/activity.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from 'src/test/test.module';

describe('UserService', () => {
  let userService: UserService;
  let activityService: ActivityService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [rootMongooseTestModule(), UserModule, ActivityModule],
    }).compile();

    userService = module.get<UserService>(UserService);
    activityService = module.get<ActivityService>(ActivityService);
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  it('basic create / get', async () => {
    const email = randomUUID() + '@test.com';
    const user = await userService.createUser({
      email,
      password: 'password',
      firstName: 'firstName',
      lastName: 'lastName',
    });

    const fetchedUser = await userService.getById(user.id);

    expect(fetchedUser).toMatchObject({
      email,
      firstName: 'firstName',
      lastName: 'lastName',
    });
  });

  it('allows to add/remove favorite activity', async () => {
    const email = randomUUID() + '@test.com';
    const user = await userService.createUser({
      email,
      password: 'password',
      firstName: 'firstName',
      lastName: 'lastName',
    });

    const activities = await Promise.all([
      activityService.create(user.id, {
        name: 'Test name 1',
        city: 'Test city 1',
        description: 'Test description 1',
        price: 10,
      }),
      activityService.create(user.id, {
        name: 'Test name 2',
        city: 'Test city 2',
        description: 'Test description 2',
        price: 10,
      }),
      activityService.create(user.id, {
        name: 'Test name 3',
        city: 'Test city 3',
        description: 'Test description 3',
        price: 10,
      }),
    ]);

    const activityIds = activities.map((activity) => activity.id);

    await userService.addFavoriteActivity({
      userId: user.id,
      activityId: activityIds[0],
    });

    await userService.addFavoriteActivity({
      userId: user.id,
      activityId: activityIds[1],
    });

    const result = await userService.addFavoriteActivity({
      userId: user.id,
      activityId: activityIds[2],
    });

    const favoritedActivityIds = result.favoriteActivities.map((activity) =>
      activity._id.toString(),
    );
    expect(favoritedActivityIds).toMatchObject([
      activityIds[0],
      activityIds[1],
      activityIds[2],
    ]);
  });

  it('prevents favoriting the same activity twice', async () => {
    const email = randomUUID() + '@test.com';
    const user = await userService.createUser({
      email,
      password: 'password',
      firstName: 'firstName',
      lastName: 'lastName',
    });

    const activity = await activityService.create(user.id, {
      name: 'Test name 1',
      city: 'Test city 1',
      description: 'Test description 1',
      price: 10,
    });

    await userService.addFavoriteActivity({
      userId: user.id,
      activityId: activity.id,
    });

    await expect(
      userService.addFavoriteActivity({
        userId: user.id,
        activityId: activity.id,
      }),
    ).rejects.toThrowError('Activity already favorited');
  });
});
