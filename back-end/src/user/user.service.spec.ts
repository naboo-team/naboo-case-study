import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schema/user.schema';
import { UserMapper } from './mapper/user.mapper';
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
});
