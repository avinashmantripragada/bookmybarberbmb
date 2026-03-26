import { describe, it, expect } from 'vitest';
import { getHomeRoute, isActiveProfile, dbRoleToProfile } from '@/lib/role-routing';

describe('role-routing', () => {
  it('getHomeRoute returns correct routes', () => {
    expect(getHomeRoute('customer')).toBe('/home');
    expect(getHomeRoute('shop_owner')).toBe('/dashboard');
    expect(getHomeRoute('independent_barber')).toBe('/barber-dashboard');
    expect(getHomeRoute(null)).toBe('/home');
    expect(getHomeRoute(undefined)).toBe('/home');
  });

  it('isActiveProfile validates correctly', () => {
    expect(isActiveProfile('customer')).toBe(true);
    expect(isActiveProfile('shop_owner')).toBe(true);
    expect(isActiveProfile('independent_barber')).toBe(true);
    expect(isActiveProfile('admin')).toBe(false);
    expect(isActiveProfile(null)).toBe(false);
  });

  it('dbRoleToProfile maps DB roles', () => {
    expect(dbRoleToProfile('customer')).toBe('customer');
    expect(dbRoleToProfile('shop_owner')).toBe('shop_owner');
    expect(dbRoleToProfile('barber')).toBe('independent_barber');
    expect(dbRoleToProfile('admin')).toBeNull();
  });
});
