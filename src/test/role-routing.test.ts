import { describe, expect, it } from 'vitest';
import {
  getDefaultRouteForAppRole,
  getOwnerType,
  hasOwnerAccess,
  normalizeRequestedRole,
} from '@/lib/role-routing';

describe('role routing helpers', () => {
  it('normalizes customer and owner role requests', () => {
    expect(normalizeRequestedRole('customer')).toBe('customer');
    expect(normalizeRequestedRole('owner')).toBe('owner');
    expect(normalizeRequestedRole('barber')).toBe('owner');
    expect(normalizeRequestedRole('shop_owner')).toBe('owner');
    expect(normalizeRequestedRole('unknown')).toBeNull();
  });

  it('detects owner access and resolves owner type', () => {
    expect(hasOwnerAccess(['customer', 'barber'])).toBe(true);
    expect(hasOwnerAccess(['customer'])).toBe(false);
    expect(getOwnerType(['customer', 'shop_owner'], 'shop_owner')).toBe('shop_owner');
    expect(getOwnerType(['customer', 'barber'])).toBe('barber');
  });

  it('returns the correct default dashboard route', () => {
    expect(getDefaultRouteForAppRole('customer')).toBe('/home');
    expect(getDefaultRouteForAppRole('owner')).toBe('/dashboard');
  });
});