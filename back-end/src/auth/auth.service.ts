import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';
import { SignInInput, SignUpInput, SignInDto } from './types';
import { User } from 'src/user/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async signIn({ email, password }: SignInInput): Promise<SignInDto> {
    const user = await this.userService.getByEmail(email);
    const isSamePassword = await bcrypt.compare(password, user.password);

    if (!isSamePassword) {
      throw new UnauthorizedException('Invalid credentials.');
    }

    const payload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);
    await this.userService.updateToken(user.id, token);

    return { access_token: token };
  }

  async signUp(input: SignUpInput): Promise<User> {
    const { email, password, firstName, lastName } = input;
    const hashedPassword = await bcrypt.hash(password, 10);

    return this.userService.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });
  }
}
