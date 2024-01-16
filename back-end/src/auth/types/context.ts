import { PayloadDto } from './jwtPayload.dto';

export interface ContextWithJWTPayload {
  jwtPayload: PayloadDto;
  // Add other properties you expect in the context here
}
