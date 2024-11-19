import { getAuthRepo, getBusinessRepo } from '../../index';
import { type BusinessRole, type BusinessConditions, Resource, Action } from './permissions';

export interface CachedPermission {
  allowed: boolean;
  businessId: string;
  conditions?: BusinessConditions;
  role?: BusinessRole;
  resource?: Resource;
  action?: Action<Resource>;
}

export interface PermissionCacheEntry {
  permissions: Map<string, CachedPermission>;
  ownedBusinesses: Set<string>;
  timestamp: number;
  version: number;
}

const CACHE_TTL = 5 * 60 * 1000;
const permissionCache = new Map<string, PermissionCacheEntry>();

export const cache = {
  get: (userId: string) => {
    const cached = permissionCache.get(userId);
    if (!cached || Date.now() - cached.timestamp >= CACHE_TTL) return null;
    return cached;
  },

  set: (
    userId: string,
    permissions: Map<string, CachedPermission>,
    ownedBusinesses: Set<string>
  ) => {
    permissionCache.set(userId, {
      permissions,
      ownedBusinesses,
      timestamp: Date.now(),
      version: (permissionCache.get(userId)?.version || 0) + 1
    });
  },

  clear: (userId?: string) => {
    if (userId) {
      permissionCache.delete(userId);
    } else {
      permissionCache.clear();
    }
  },

  init: async (userId: string): Promise<void> => {
    try {
      // Get owned businesses first
      const ownedBusinesses = await getBusinessRepo().business.find({
        where: { ownerId: userId }
      });

      const permissionsMap = new Map<string, CachedPermission>();
      const ownedBusinessIds = new Set<string>();

      // Just store owned business IDs
      for (const business of ownedBusinesses) {
        ownedBusinessIds.add(business.id);
      }

      // Get regular permissions
      const permissions = await getAuthRepo().permission.find({
        where: { userId, isAllowed: true }
      });

      // Add regular permissions
      for (const permission of permissions) {
        if (ownedBusinessIds.has(permission.businessId)) continue;

        if (permission.role) {
          permissionsMap.set(`role:${permission.businessId}`, {
            allowed: true,
            role: permission.role,
            businessId: permission.businessId,
            conditions: permission.conditions || {}
          });
        }

        if (permission.resource && permission.action) {
          const key = `${permission.resource}:${permission.action}`;
          permissionsMap.set(key, {
            allowed: true,
            businessId: permission.businessId,
            conditions: permission.conditions || {}
          });
        }
      }

      cache.set(userId, permissionsMap, ownedBusinessIds);
    } catch (error) {
      cache.clear(userId);
      throw error;
    }
  },

  revokeBusinessPermissions: (businessId: string) => {
    for (const [userId, entry] of Array.from(permissionCache.entries())) {
      if (
        Array.from(entry.permissions.values()).some(
          (p: CachedPermission) => p.businessId === businessId
        )
      ) {
        permissionCache.delete(userId);
      }
    }
  }
};
