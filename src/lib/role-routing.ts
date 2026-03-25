export type AppRole = 'customer' | 'owner';
export type OwnerType = 'barber' | 'shop_owner';

export const CUSTOMER_HOME_ROUTE = '/home';
export const OWNER_HOME_ROUTE = '/dashboard';

export const normalizeRequestedRole = (value?: string | null): AppRole | null => {
  if (value === 'customer') return 'customer';
  if (value === 'owner' || value === 'barber' || value === 'shop_owner') return 'owner';
  return null;
};

export const isOwnerBackendRole = (role?: string | null): role is OwnerType =>
  role === 'barber' || role === 'shop_owner';

export const hasOwnerAccess = (roles: string[]) => roles.some((role) => isOwnerBackendRole(role));

export const getOwnerType = (roles: string[], preferred?: string | null): OwnerType | null => {
  if (preferred === 'shop_owner' && roles.includes('shop_owner')) return 'shop_owner';
  if (preferred === 'barber' && roles.includes('barber')) return 'barber';
  if (roles.includes('shop_owner')) return 'shop_owner';
  if (roles.includes('barber')) return 'barber';
  return null;
};

export const getDefaultRouteForAppRole = (role?: AppRole | null) =>
  role === 'owner' ? OWNER_HOME_ROUTE : CUSTOMER_HOME_ROUTE;