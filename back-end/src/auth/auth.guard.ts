import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('AuthGuard');
    const gqlContext = GqlExecutionContext.create(context);
    const ctx = gqlContext.getContext();
    const token: string | null =
      ctx.req.cookies['jwt'] || ctx.req.headers['jwt'];
    if (!token) throw new UnauthorizedException();

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      ctx.user = payload;
    } catch {
      throw new UnauthorizedException();
    }

    return true;
  }
}

@Injectable()
export class AttachUser implements CanActivate {
  constructor(private jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('AttachUser');
    const gqlContext = GqlExecutionContext.create(context);
    const ctx = gqlContext.getContext();
    const token: string | null =
      ctx.req.cookies['jwt'] || ctx.req.headers['jwt'];

    if (!token) return true;

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
      });
      ctx.user = payload; // fake admin is user1
    } catch {
      return true;
    }

    return true;
  }
}
