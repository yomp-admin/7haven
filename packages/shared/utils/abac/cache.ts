import { getAuthRepo, getBusinessRepo } from '../../index';
import { type BusinessRole, type BusinessConditions, Resource, Action } from './permissions';

export interface CachedPermission {
  allowed: boolean;
  businessId: string;
  conditions?: BusinessConditions;
  role?: BusinessRole;
  resource?: Resource;
  action?: Action<Resource>;
  timestamp: number;
}

export interface PermissionCacheEntry {
  permissions: Map<string, CachedPermission>;
  ownedBusinesses: Set<string>;
  timestamp: number;
  version: number;
}

const CACHE_TTL = 5 * 60 * 1000;
const CACHE_CLEANUP_INTERVAL = 10 * 60 * 1000;
const permissionCache = new Map<string, PermissionCacheEntry>();

export const cache = {
  get: (userId: string): PermissionCacheEntry | null => {
    const cached = permissionCache.get(userId);
    if (!cached || Date.now() - cached.timestamp >= CACHE_TTL) return null;
    return cached;
  },

  set: (
    userId: string,
    permissions: Map<string, CachedPermission>,
    ownedBusinesses: Set<string>
  ): void => {
    permissionCache.set(userId, {
      permissions,
      ownedBusinesses,
      timestamp: Date.now(),
      version: (permissionCache.get(userId)?.version || 0) + 1
    });
  },

  clear: (userId?: string): void => {
    userId ? permissionCache.delete(userId) : permissionCache.clear();
  },

  init: async (userId: string): Promise<void> => {
    try {
      const [ownedBusinesses, permissions] = await Promise.all([
        getBusinessRepo().business.find({ where: { ownerId: userId } }),
        getAuthRepo().permission.find({ where: { userId, isAllowed: true } })
      ]);

      const permissionsMap = new Map<string, CachedPermission>();
      const ownedBusinessIds = new Set(ownedBusinesses.map((b) => b.id));
      const now = Date.now();

      for (const permission of permissions) {
        if (ownedBusinessIds.has(permission.businessId)) continue;

        const basePermission: CachedPermission = {
          allowed: true,
          businessId: permission.businessId,
          conditions: permission.conditions,
          timestamp: now
        };

        if (permission.role) {
          permissionsMap.set(`role:${permission.businessId}`, {
            ...basePermission,
            role: permission.role
          });
        }

        if (permission.resource && permission.action) {
          permissionsMap.set(`${permission.resource}:${permission.action}`, {
            ...basePermission,
            resource: permission.resource,
            action: permission.action
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

setInterval(() => {
  const now = Date.now();
  for (const [userId, entry] of Array.from(permissionCache.entries())) {
    if (now - entry.timestamp >= CACHE_TTL) {
      permissionCache.delete(userId);
    }
  }
}, CACHE_CLEANUP_INTERVAL);
