import { getAuthRepo } from '../../index';
import { cache } from './cache';
import { ForbiddenError, remult } from 'remult';
import { PermissionChecker } from './checker';
import {
  type BusinessRole,
  type BusinessConditions,
  type Resource,
  type Action
} from './permissions';

export class PermissionManager {
  private static async validateAccess(userId: string, businessId: string): Promise<boolean> {
    const checker = new PermissionChecker(userId);
    return checker.isBusinessOwner(businessId) || remult.isAllowed('admin');
  }

  static async grantRoleWithPermissions(
    userId: string,
    businessId: string,
    role: BusinessRole,
    permissions: Array<{
      resource: Resource;
      actions: Array<Action<Resource>>;
    }>,
    conditions?: BusinessConditions
  ) {
    const hasAccess = await this.validateAccess(remult.user!.id, businessId);
    if (!hasAccess) throw new ForbiddenError('Insufficient permissions');

    cache.clear(userId);

    const existingPermissions = await getAuthRepo().permission.find({
      where: { userId, businessId }
    });

    for (const perm of existingPermissions) {
      await getAuthRepo().permission.delete(perm.id);
    }

    for (const perm of permissions) {
      for (const action of perm.actions) {
        await getAuthRepo().permission.insert({
          userId,
          businessId,
          role,
          resource: perm.resource,
          action,
          conditions: conditions || {},
          isAllowed: true
        });
      }
    }
  }

  static async revoke(
    userId: string,
    businessId: string,
    type: { role: BusinessRole } | { resource: Resource; action: Action<Resource> }
  ) {
    const hasAccess = await this.validateAccess(remult.user!.id, businessId);
    if (!hasAccess) throw new ForbiddenError('Insufficient permissions');

    const permission = await getAuthRepo().permission.findFirst({
      userId,
      businessId,
      ...('role' in type ? { role: type.role } : { resource: type.resource, action: type.action })
    });

    if (permission) {
      await getAuthRepo().permission.delete(permission.id);
      cache.clear(userId);
    }
  }

  static async grantSellerPermissions(userId: string, businessId: string) {
    const hasAccess = await this.validateAccess(remult.user!.id, businessId);
    if (!hasAccess) throw new ForbiddenError('Insufficient permissions');

    const existingPermissions = await getAuthRepo().permission.find({
      where: { userId, businessId }
    });

    for (const perm of existingPermissions) {
      await getAuthRepo().permission.delete(perm.id);
    }

    await getAuthRepo().permission.insert({
      userId,
      businessId,
      role: 'seller',
      resource: '*' as Resource,
      action: '*' as Action<Resource>,
      isAllowed: true
    });

    cache.clear(userId);
  }
}
