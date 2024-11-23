import { BackendMethod, Allow, remult, ForbiddenError } from 'remult';
import { cache, getAuthRepo } from '../../../index';
import {
  type BusinessRole,
  type Resource,
  type Action,
  type BusinessConditions
} from '../../../utils/abac/permissions';
import { PermissionChecker } from '../../../utils/abac/checker';

export interface PermissionAction {
  resource: Resource;
  action: Action<Resource>;
  businessId: string;
  conditions?: BusinessConditions;
}

export interface RoleAction {
  businessId: string;
  role: BusinessRole;
  conditions?: BusinessConditions;
}

export class AbacController {
  private static async validateBusinessAccess(businessId: string): Promise<boolean> {
    const currentUser = remult.user!;
    if (currentUser.roles?.includes('admin')) return true;

    const checker = new PermissionChecker(currentUser.id);
    return checker.isBusinessOwner(businessId);
  }

  private static async findPermission(userId: string, action: PermissionAction | RoleAction) {
    const isRoleAction = 'role' in action;
    return getAuthRepo().permission.findFirst({
      userId,
      businessId: action.businessId,
      ...(isRoleAction
        ? { role: action.role }
        : {
            resource: action.resource,
            action: action.action
          })
    });
  }

  @BackendMethod({ allowed: Allow.authenticated, apiPrefix: 'auth' })
  static async check_permission(
    userId: string,
    action: PermissionAction | RoleAction
  ): Promise<{ success: boolean }> {
    const permission = await this.findPermission(userId, action);
    if (!permission) return { success: false };

    if (action.conditions && permission.conditions) {
      const conditionsMatch = Object.entries(action.conditions).every(([key, value]) => {
        const k = key as keyof BusinessConditions;
        return permission.conditions[k] === value;
      });

      if (!conditionsMatch) return { success: false };
    }

    return { success: true };
  }

  @BackendMethod({ allowed: Allow.authenticated, apiPrefix: 'auth' })
  static async grant_permission(
    userId: string,
    action: PermissionAction | RoleAction
  ): Promise<{ success: boolean; message?: string }> {
    const hasAccess = await AbacController.validateBusinessAccess(action.businessId);
    if (!hasAccess) {
      throw new ForbiddenError('Insufficient permissions');
    }

    const existingPermission = await AbacController.findPermission(userId, action);
    if (existingPermission) {
      if (JSON.stringify(existingPermission.conditions) !== JSON.stringify(action.conditions)) {
        await getAuthRepo().permission.update(existingPermission.id, {
          conditions: action.conditions || {}
        });
      }
      return { success: true, message: 'updated' };
    }

    const isRoleAction = 'role' in action;
    const permission = await getAuthRepo().permission.insert({
      userId,
      businessId: action.businessId,
      conditions: action.conditions || {},
      ...(isRoleAction
        ? { role: action.role }
        : {
            resource: action.resource,
            action: action.action
          })
    });

    cache.clear(userId);
    return { success: !!permission };
  }

  @BackendMethod({ allowed: Allow.authenticated, apiPrefix: 'auth' })
  static async revoke_permission(
    userId: string,
    action: PermissionAction | RoleAction
  ): Promise<{ success: boolean }> {
    const hasAccess = await AbacController.validateBusinessAccess(action.businessId);
    if (!hasAccess) return { success: false };

    const permission = await AbacController.findPermission(userId, action);
    if (!permission) return { success: false };

    await getAuthRepo().permission.delete(permission.id);
    cache.clear(userId);
    return { success: true };
  }

  @BackendMethod({ allowed: Allow.authenticated, apiPrefix: 'auth' })
  static async grant_business_role(input: {
    userId: string;
    businessId: string;
    role: BusinessRole;
  }): Promise<{ success: boolean }> {
    return AbacController.grant_permission(input.userId, {
      businessId: input.businessId,
      role: input.role
    });
  }

  @BackendMethod({ allowed: Allow.authenticated, apiPrefix: 'auth' })
  static async revoke_business_role(input: {
    userId: string;
    businessId: string;
    role: BusinessRole;
  }): Promise<{ success: boolean }> {
    return AbacController.revoke_permission(input.userId, {
      businessId: input.businessId,
      role: input.role
    });
  }

  @BackendMethod({ allowed: Allow.authenticated, apiPrefix: 'auth' })
  static async batch_grant_permissions(
    userId: string,
    actions: (PermissionAction | RoleAction)[]
  ): Promise<{ success: boolean; failed: number }> {
    let failed = 0;

    for (const action of actions) {
      const result = await AbacController.grant_permission(userId, action);
      if (!result.success) failed++;
    }

    return { success: failed === 0, failed };
  }
}
