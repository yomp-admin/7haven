import { BackendMethod, Allow, remult, ForbiddenError } from 'remult';
import { cache, getAuthRepo, getBusinessRepo } from '../../index';
import { abac, PermissionManager as pm } from '../../utils/abac';
import {
  Action,
  BUSINESS_ROLES,
  BusinessConditions,
  Resource,
  RESOURCE_PERMISSIONS,
  type BusinessRole
} from '../../utils/abac/permissions';

function can(action: string) {
  return abac.can(action, 'staff', { businessId: 'dmtuh9tjeyoi13ikovm6g8xw' });
}

export class BusinessController {
  @BackendMethod({ allowed: () => can('manage'), apiPrefix: 'business' })
  static async add_staff_member(input: {
    businessId: string;
    userId: string;
    role: BusinessRole;
    permissions: Array<{
      resource: Resource;
      actions: Array<Action<Resource>>;
    }>;
    conditions?: BusinessConditions;
  }) {
    if (input.role === 'seller') {
      throw new ForbiddenError('Cannot assign seller role through staff management');
    }

    await pm.grantRoleWithPermissions(
      input.userId,
      input.businessId,
      input.role,
      input.permissions,
      input.conditions
    );

    return { success: true };
  }

  @BackendMethod({ allowed: Allow.authenticated, apiPrefix: 'business' })
  static async create_business(input: { name: string }) {
    const business = await getBusinessRepo().business.insert({
      name: input.name,
      ownerId: remult.user!.id,
      settings: {
        allowMultipleStores: false,
        maxProducts: 100,
        features: []
      }
    });

    cache.clear(remult.user!.id);

    return business;
  }
}
