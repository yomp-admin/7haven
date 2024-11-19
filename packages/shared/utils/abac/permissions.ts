export type BusinessRole = 'seller' | 'manager' | 'staff';

export const BUSINESS_ROLES: Record<BusinessRole, string[]> = {
  seller: ['*:*'],
  manager: [],
  staff: []
};

export const RESOURCE_PERMISSIONS = {
  product: ['create', 'read', 'update', 'delete', 'publish'],
  order: ['create', 'read', 'update', 'cancel', 'fulfill'],
  inventory: ['read', 'update', 'adjust'],
  staff: ['invite', 'manage', 'remove'],
  business: ['manage', 'settings']
} as const;

export type Resource = keyof typeof RESOURCE_PERMISSIONS;
export type Action<T extends Resource> = (typeof RESOURCE_PERMISSIONS)[T][number];

export interface BusinessConditions {
  storeId?: string;
  categoryId?: string;
  maxAmount?: number;
  features?: string[];
}
