import { SetMetadata } from '@nestjs/common';

type Role = 'ADMIN' | 'USER';

// USE INSIDE CONTROLLERS
// VALIDATION HAPPENS IN AUTH GUARD
export const ProfileValidator = (...roles: Role[]) =>
  SetMetadata('roles', roles);
