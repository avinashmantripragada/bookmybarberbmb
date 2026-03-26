export type ActiveProfile = 'customer' | 'shop_owner' | 'independent_barber';

export const CUSTOMER_HOME = '/home';
export const SHOP_OWNER_HOME = '/dashboard';
export const BARBER_HOME = '/barber-dashboard';

export const PROFILE_LABELS: Record<ActiveProfile, string> = {
  customer: '👤 Customer',
  shop_owner: '🏪 Shop Owner',
  independent_barber: '✂️ Independent Barber',
};

export const isActiveProfile = (v: string | null | undefined): v is ActiveProfile =>
  v === 'customer' || v === 'shop_owner' || v === 'independent_barber';

export const getHomeRoute = (profile?: ActiveProfile | null): string => {
  if (profile === 'shop_owner') return SHOP_OWNER_HOME;
  if (profile === 'independent_barber') return BARBER_HOME;
  return CUSTOMER_HOME;
};

/** Map DB role to ActiveProfile */
export const dbRoleToProfile = (role: string): ActiveProfile | null => {
  if (role === 'shop_owner') return 'shop_owner';
  if (role === 'barber') return 'independent_barber';
  if (role === 'customer') return 'customer';
  return null;
};
