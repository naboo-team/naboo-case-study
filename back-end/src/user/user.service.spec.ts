import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from './user.module';
import { MeModule } from 'src/me/me.module';
import { ActivityModule } from 'src/activity/activity.module';
import { SeedModule } from 'src/seed/seed.module';
import { AppController } from 'src/app.controller';
import { AppService } from 'src/app.service';
import { SeedService } from 'src/seed/seed.service';
import { randomUUID } from 'crypto';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        GraphQLModule.forRoot<ApolloDriverConfig>({
          driver: ApolloDriver,
          autoSchemaFile: 'schema.gql',
          sortSchema: true,
          buildSchemaOptions: { numberScalarMode: 'integer' },
          context: ({ req, res }: { req: Request; res: Response }) => ({
            req,
            res,
          }),
        }),
        MongooseModule.forRootAsync({
          useFactory: () => {
            return { uri: process.env.MONGO_URI };
          },
        }),
        AuthModule,
        UserModule,
        MeModule,
        ActivityModule,
        SeedModule,
      ],
      controllers: [AppController],
      providers: [AppService, SeedService],
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

    const updatedUser = await service.addFavoriteActivity({
      userId: user.id,
      activityId: activityIds[3],
    });

    expect(updatedUser.favoriteActivities).toEqual([
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
    expect(updatedUser.favoriteActivities[3].position).toBeLessThan(
      updatedUser.favoriteActivities[2].position,
    );

    const updatedUserPostRemoval = await service.removeFavoriteActivity({
      userId: user.id,
      activityId: activityIds[1],
    });

    expect(updatedUserPostRemoval.favoriteActivities).toEqual([
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
