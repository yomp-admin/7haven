import { type BusinessRole, BUSINESS_ROLES, BusinessConditions } from './permissions';
import { cache, type CachedPermission } from './cache';
import { remult } from 'remult';

export interface BusinessContext extends BusinessConditions {
  businessId: string;
}

export class PermissionChecker {
  private readonly userId: string;
  private readonly cached: Map<string, CachedPermission>;
  private readonly ownedBusinesses: Set<string>;

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
    const businessIds = new Set<string>(this.ownedBusinesses);

    for (const [key, permission] of Array.from(this.cached.entries())) {
      if (key.startsWith('role:')) {
        businessIds.add(permission.businessId);
      }
    }

    return Array.from(businessIds);
  }

  can(action: string, resource: string, context?: BusinessContext): boolean {
    if (remult.isAllowed('admin')) return true;

    if (context?.businessId) {
      if (this.isBusinessOwner(context.businessId)) return true;

      const businessRole = this.cached.get(`role:${context.businessId}`);
      if (businessRole?.role && this.hasRolePermission(businessRole.role, resource, action)) {
        return this.checkConditions(context);
      }
    }

    const permissionKey = `${resource}:${action}`;
    const permission = this.cached.get(permissionKey);

    return !!permission?.allowed && (!context || this.checkConditions(context));
  }

  private hasRolePermission(role: BusinessRole, resource: string, action: string): boolean {
    const permissions = BUSINESS_ROLES[role];
    return permissions.some(
      (perm) => perm === '*:*' || perm === `${resource}:*` || perm === `${resource}:${action}`
    );
  }

  private checkConditions(context: BusinessContext): boolean {
    const permission = this.cached.get(`role:${context.businessId}`);
    if (!permission?.conditions) return true;

    return Object.entries(permission.conditions).every(([key, value]) => {
      if (key === 'features' && Array.isArray(value)) {
        return value.every((feature) => context.features?.includes(feature));
      }
      return context[key as keyof BusinessContext] === value;
    });
  }
}
