import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/schema/user.schema';
import { UserDto } from 'src/user/types/user.dto';
import { UserService } from '../user/user.service';
import { SignInDto, SignInInput, SignUpInput } from './types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn({ email, password }: SignInInput): Promise<SignInDto> {
    const user = await this.userService.getByEmail(email);
    const isSamePassword = await bcrypt.compare(password, user.password);

    if (!isSamePassword)
      throw new HttpException('Wrong credentials provided', 400);

    const payload: UserDto = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      favourites: user.favourites ?? [],
    };
    const token = await this.jwtService.signAsync(payload);

    await this.userService.updateToken(user.id, token);

    return { access_token: token };
  }

  async signUp({
    email,
    password,
    firstName,
    lastName,
  }: SignUpInput): Promise<User> {
    const user = await this.userService.findByEmail(email);

    if (user) throw new UnauthorizedException();

    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userService.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
  }
}
