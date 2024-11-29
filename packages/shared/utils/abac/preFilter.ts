import { Filter, ForbiddenError, remult } from 'remult';
import { PermissionChecker } from './checker';

export class PreFilter {
  static create<T extends { businessId: string }>(
    resource: string,
    action: string = 'read',
    additionalConditions?: (entity: T) => boolean
  ) {
    return Filter.createCustom<T>(() => {
      const user = remult.user;
      if (!user) throw new ForbiddenError('Authentication required');

      if (remult.isAllowed('admin')) return {};

      const checker = new PermissionChecker(user.id);
      const businessIds = checker.getBusinessIds();

      if (!businessIds.length) {
        throw new ForbiddenError('Insufficient permissions');
      }

      const filter: Record<string, any> = {
        businessId: { $in: businessIds }
      };

      if (additionalConditions) {
        filter.$and = [{ $func: additionalConditions }];
      }

      return filter;
    });
  }
}
