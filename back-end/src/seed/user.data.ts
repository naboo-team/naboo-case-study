import { SignUpInput } from 'src/auth/types';

export const user: SignUpInput = {
  email: 'user1@test.fr',
  password: 'user1',
  firstName: 'John',
  lastName: 'Doe',
  isAdmin: false,
};

export const admin: SignUpInput = {
  email: 'admin1@test.fr',
  password: 'admin1',
  firstName: 'John',
  lastName: 'Doe',
  isAdmin: true,
};
