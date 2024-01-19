import { TestingModule, Test } from '@nestjs/testing';
import { ActivityModule } from 'src/activity/activity.module';
import { AuthModule } from 'src/auth/auth.module';
import { UserModule } from 'src/user/user.module';
import { MeResolver } from './me.resolver';
import { getModelToken } from '@nestjs/mongoose';
import { AuthGuard } from 'src/auth/auth.guard';

describe('me.resolver', () => {
  let resolver: MeResolver;
  let app: TestingModule;

  beforeEach(async () => {
    app = await Test.createTestingModule({
      imports: [UserModule, AuthModule, ActivityModule],
      providers: [MeResolver],
    })
      .overrideProvider(getModelToken('User'))
      .useValue({
        findById: jest.fn().mockReturnValue({
          exec: () => ({
            id: '123',
            email: 'test@test.fr',
            password: 'test',
            token: 'token',
            firstName: 'test',
            lastName: 'test',
            activities: [],
          }),
        }),
      })
      .overrideProvider(getModelToken('Activity'))
      .useValue({})
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: jest.fn().mockReturnValue(true),
      })
      .compile();

    resolver = app.get<MeResolver>(MeResolver);
  });
  describe('getMe', () => {
    it('should return the current user', async () => {
      await resolver.getMe({ user: { id: '123' } });
      expect(app.get(getModelToken('User')).findById).toHaveBeenCalledWith(
        '123',
      );
    });
  });
});
