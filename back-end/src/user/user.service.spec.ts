import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user.module';
import { randomUUID } from 'crypto';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRootAsync({
          useFactory: () => {
            return { uri: process.env.MONGO_URI };
          },
        }),
        UserModule,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('basic create / get', async () => {
    const email = randomUUID() + '@test.com';
    const user = await service.createUser({
      email,
      password: 'password',
      firstName: 'firstName',
      lastName: 'lastName',
    });

    const fetchedUser = await service.getById(user.id);

    expect(fetchedUser).toMatchObject({
      email,
      firstName: 'firstName',
      lastName: 'lastName',
    });
  });

  it('allows to add/remove favorite activity', async () => {
    const email = randomUUID() + '@test.com';
    const user = await service.createUser({
      email,
      password: 'password',
      firstName: 'firstName',
      lastName: 'lastName',
    });

    const activityIds = [
      randomUUID(),
      randomUUID(),
      randomUUID(),
      randomUUID(),
    ];
    await service.addFavoriteActivity({
      userId: user.id,
      activityId: activityIds[0],
    });

    await service.addFavoriteActivity({
      userId: user.id,
      activityId: activityIds[1],
      position: 1000,
    });

    await service.addFavoriteActivity({
      userId: user.id,
      activityId: activityIds[2],
      position: -1_000_000,
    });

    const result = await service.addFavoriteActivity({
      userId: user.id,
      activityId: activityIds[3],
    });

    expect(result.favoriteActivities).toEqual([
      {
        activityId: activityIds[0],
        position: expect.any(Number),
      },
      {
        activityId: activityIds[1],
        position: 1000,
      },

      {
        activityId: activityIds[2],
        position: -1_000_000,
      },
      {
        activityId: activityIds[3],
        position: expect.any(Number),
      },
    ]);

    // newly favorited activity should be at the top, so position should be less than the previous one
    expect(result.favoriteActivities[3].position).toBeLessThan(
      result.favoriteActivities[2].position,
    );

    const resultPostRemoval = await service.removeFavoriteActivity({
      userId: user.id,
      activityId: activityIds[1],
    });

    expect(resultPostRemoval.favoriteActivities).toEqual([
      {
        activityId: activityIds[0],
        position: expect.any(Number),
      },
      {
        activityId: activityIds[2],
        position: -1_000_000,
      },
      {
        activityId: activityIds[3],
        position: expect.any(Number),
      },
    ]);
  });
});
