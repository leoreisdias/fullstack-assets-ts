import { SetMetadata } from '@nestjs/common';

type Role = 'ADMIN' | 'USER'; // TODO: IMPORTAR DO TYPES GLOBAL

// USE INSIDE CONTROLLERS
// VALIDATION HAPPENS IN AUTH GUARD
export const ProfileValidator = (...roles: Role[]) =>
  SetMetadata('roles', roles);
