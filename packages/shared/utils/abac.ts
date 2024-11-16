import { remult, Filter, ForbiddenError, EntityFilter } from 'remult';
import { getAuthRepo } from '../index';
import { ResourceAction } from '../entities/auth';
import { AbacController } from '../controllers/auth/abac';

const CACHE_TTL = 5 * 60 * 1000;

interface CachedPermission {
  allowed: boolean;
  attributes?: Record<string, any>;
}

interface PermissionCacheEntry {
  permissions: Map<string, CachedPermission>;
  timestamp: number;
}

const permissionCache = new Map<string, PermissionCacheEntry>();

export type Permission = 'create' | 'read' | 'update' | 'delete';

export type Resource = 'product' | 'order' | 'inventory' | 'team';

export const can = {
  do: (action: Permission, resource: Resource, attributes?: Record<string, any>): boolean => {
    const user = remult.user;
    if (!user) return false;
    if (remult.isAllowed('admin')) return true;

    if (attributes?.ownerId === user.id) return true;

    const cached = permissionCache.get(user.id);
    if (!cached || Date.now() - cached.timestamp >= CACHE_TTL) return false;

    const permKey = `${resource}:${action}`;
    const permission = cached.permissions.get(permKey);

    if (!permission?.allowed) return false;

    if (attributes && permission.attributes) {
      return Object.entries(attributes).every(
        ([key, value]) => permission.attributes![key] === value
      );
    }

    return true;
  },

  clearCache: (userId?: string) => {
    if (userId) {
      permissionCache.delete(userId);
    } else {
      permissionCache.clear();
    }
  }
};

export async function initializePermissions(userId: string): Promise<PermissionCacheEntry> {
  const cached = permissionCache.get(userId);
  const now = Date.now();

  if (cached && now - cached.timestamp < CACHE_TTL) {
    return cached;
  }

  const permissions = await getAuthRepo().permission.find({
    where: { userId, isAllowed: true }
  });

  const permMap = new Map<string, CachedPermission>();

  permissions.forEach((perm) => {
    permMap.set(`${perm.resource}:${perm.action}`, {
      allowed: perm.isAllowed,
      attributes: perm.attributes
    });
  });

  const entry: PermissionCacheEntry = {
    permissions: permMap,
    timestamp: now
  };

  permissionCache.set(userId, entry);
  return entry;
}

export async function initialize_default_permissions(
  userId: string,
  defaultPermissions: ResourceAction[]
): Promise<{ success: boolean }> {
  try {
    for (const permission of defaultPermissions) {
      await AbacController.grant_user_permission(userId, permission);
    }
    return { success: true };
  } catch (error) {
    return { success: false };
  }
}

/**
 * Creates an ABAC filter for entity queries
 * @param resource - The resource type to filter
 * @param ownerField - The field name containing the owner ID
 */
export const createAbacFilter = <T extends { ownerId: string }>(
  resource: Resource,
  attributes?: Record<string, any>
) => {
  return Filter.createCustom<T>(async () => {
    if (!remult.authenticated()) {
      throw new ForbiddenError('Not authorized');
    }

    if (remult.isAllowed('admin')) {
      return {} as EntityFilter<T>;
    }

    const hasPermission = can.do('read', resource, attributes);
    if (!hasPermission) {
      throw new ForbiddenError('Not authorized');
    }

    const filter = {} as EntityFilter<T>;

    (filter as any).ownerId = remult.user?.id;

    if (attributes) {
      Object.entries(attributes).forEach(([key, value]) => {
        if (value !== undefined && key in filter) {
          (filter as any)[key] = value;
        }
      });
    }

    return filter;
  });
};

type ShortAction = 'r' | 'c' | 'u' | 'd' | '*';
type ResourcePermission = {
  resource: string;
  action: ShortAction | ShortAction[];
};

export function expandPermissions(permissions: ResourcePermission[]): ResourceAction[] {
  const actionMap = {
    r: 'read',
    c: 'create',
    u: 'update',
    d: 'delete'
  } as const;

  return permissions.flatMap(({ resource, action }) => {
    const actions = Array.isArray(action) ? action : [action];

    return actions.flatMap((act) => {
      if (act === '*') {
        return Object.values(actionMap).map((fullAction) => ({
          resource,
          action: fullAction
        }));
      }

      return {
        resource,
        action: actionMap[act]
      };
    });
  });
}
