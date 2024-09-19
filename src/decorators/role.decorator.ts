/**
 * Decorator file to add the authorized role for a method
 */

import { SetMetadata } from '@nestjs/common';

export const Roles = (...roles: string[]) => SetMetadata('roles', roles);