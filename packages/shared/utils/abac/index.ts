import { remult } from 'remult';
import { PermissionChecker } from './checker';
import { PermissionManager } from './manager';
import type { BusinessContext } from './checker';

export const abac = {
  can: (action: string, resource: string, context?: BusinessContext): boolean => {
    const user = remult.user;
    if (!user) return false;

    const checker = new PermissionChecker(user.id);

    if (context?.businessId && checker.isBusinessOwner(context.businessId)) {
      return true;
    }
    return checker.can(action, resource, context);
  },

  manager: PermissionManager
};

export * from './checker';
export * from './manager';
export * from './cache';
export * from './preFilter';
