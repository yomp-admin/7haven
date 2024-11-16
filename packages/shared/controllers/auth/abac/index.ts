import { BackendMethod, Allow, remult } from 'remult';
import { getAuthRepo } from '../../../index';
import type { ResourceAction } from '../../../entities/auth/abac';
import { can } from '../../../utils/abac';

export class AbacController {
  @BackendMethod({ allowed: Allow.authenticated, apiPrefix: 'auth' })
  static async check_user_permission(
    userId: string,
    action: ResourceAction
  ): Promise<{ success: boolean }> {
    const permission = await getAuthRepo().permission.findFirst({
      userId,
      resource: action.resource,
      action: action.action
    });

    if (permission) {
      if (action.attributes && permission.attributes) {
        const attributesMatch = Object.entries(action.attributes).every(
          ([key, value]) => permission.attributes[key] === value
        );

        if (!attributesMatch) {
          return { success: false };
        }
      }
      return { success: true };
    }

    return { success: false };
  }

  @BackendMethod({ allowed: Allow.authenticated, apiPrefix: 'auth' })
  static async grant_user_permission(
    userId: string,
    action: ResourceAction
  ): Promise<{ success: boolean }> {
    const permission = await getAuthRepo().permission.insert({
      userId,
      ...action,
      isAllowed: true
    });
    can.clearCache(userId);
    if (permission) return { success: true };
    return { success: false };
  }

  @BackendMethod({ allowed: Allow.authenticated, apiPrefix: 'auth' })
  static async revoke_user_permission(
    userId: string,
    action: ResourceAction
  ): Promise<{ success: boolean }> {
    const permission = await getAuthRepo().permission.findFirst({
      userId,
      resource: action.resource,
      action: action.action
    });

    if (permission) {
      if (action.attributes && permission.attributes) {
        const attributesMatch = Object.entries(action.attributes).every(
          ([key, value]) => permission.attributes[key] === value
        );

        if (!attributesMatch) {
          return { success: false };
        }
      }

      await getAuthRepo().permission.delete(permission.id);
      can.clearCache(userId);
      return { success: true };
    }

    return { success: false };
  }
}
