import { type BusinessRole, BUSINESS_ROLES, BusinessConditions } from './permissions';
import { cache, type CachedPermission } from './cache';
import { remult } from 'remult';

export interface BusinessContext extends BusinessConditions {
  businessId: string;
}

export class PermissionChecker {
  private userId: string;
  private cached: Map<string, CachedPermission>;
  private ownedBusinesses: Set<string>;

  constructor(userId: string) {
    this.userId = userId;
    const cached = cache.get(userId);
    this.cached = cached?.permissions || new Map();
    this.ownedBusinesses = cached?.ownedBusinesses || new Set();
  }

  isBusinessOwner(businessId: string): boolean {
    return this.ownedBusinesses.has(businessId);
  }

  getBusinessIds(): string[] {
    const businessIds = new Set<string>();

    // Add owned businesses
    this.ownedBusinesses.forEach((id) => businessIds.add(id));

    // Add businesses where user has a role
    for (const [key, permission] of Array.from(this.cached.entries())) {
      if (key.startsWith('role:')) {
        businessIds.add(permission.businessId);
      }
    }

    return Array.from(businessIds);
  }

  can(action: string, resource: string, context?: BusinessContext): boolean {
    // Admin override
    if (remult.isAllowed('admin')) return true;

    // Business context check
    if (context?.businessId) {
      // Check business ownership first
      if (this.isBusinessOwner(context.businessId)) return true;

      const businessRole = this.cached.get(context.businessId);

      // Role-based permission check
      if (businessRole?.role) {
        const hasPermission = this.hasRolePermission(businessRole.role, resource, action);
        if (hasPermission) {
          return this.checkConditions(context);
        }
      }
    }

    // Direct permission check
    const permissionKey = `${resource}:${action}`;
    const permission = this.cached.get(permissionKey);

    return !!permission?.allowed && (!context || this.checkConditions(context));
  }

  private hasRolePermission(role: BusinessRole, resource: string, action: string): boolean {
    const permissions = BUSINESS_ROLES[role];
    return permissions.some((perm) => {
      if (perm === '*:*') return true;
      if (perm === `${resource}:*`) return true;
      return perm === `${resource}:${action}`;
    });
  }

  private checkConditions(context: BusinessContext): boolean {
    const permission = this.cached.get(`role:${context.businessId}`);
    if (!permission?.conditions) return true;

    return Object.entries(permission.conditions).every(([key, value]) => {
      if (key === 'features' && Array.isArray(value)) {
        const contextFeatures = context.features || [];
        return value.every((feature) => contextFeatures.includes(feature));
      }
      const contextValue = context[key as keyof BusinessContext];
      return contextValue === value;
    });
  }
}
