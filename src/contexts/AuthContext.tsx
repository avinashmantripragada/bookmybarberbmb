import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import {
  AppRole,
  OwnerType,
  getDefaultRouteForAppRole,
  getOwnerType,
  hasOwnerAccess,
  isOwnerBackendRole,
} from '@/lib/role-routing';

interface Profile {
  id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  roles: string[];
  activeRole: string | null;
  appRole: AppRole | null;
  ownerType: OwnerType | null;
  isGuest: boolean;
  hasSelectedRole: boolean;
  loading: boolean;
  signUp: (email: string, password: string, name: string, phone: string, role: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string, desiredRole?: AppRole) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  switchRole: (role: AppRole) => boolean;
  enterGuestMode: (role: AppRole) => void;
  clearGuestMode: () => void;
  setRolePreference: (role: AppRole) => void;
  getDefaultRoute: (role?: AppRole | null) => string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [activeRole, setActiveRole] = useState<string | null>(null);
  const [appRole, setAppRole] = useState<AppRole | null>(null);
  const [ownerType, setOwnerType] = useState<OwnerType | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  const ROLE_STATE_VERSION_KEY = 'bmb_role_state_version';
  const ROLE_STATE_VERSION = '2026-03-25-role-fix-v1';
  const GUEST_ROLE_KEY = 'bmb_guest_role';
  const PENDING_ROLE_KEY = 'bmb_pending_app_role';
  const APP_ROLE_KEY_PREFIX = 'bmb_app_role_';
  const OWNER_TYPE_KEY_PREFIX = 'bmb_owner_type_';

  const isAppRole = (value: string | null): value is AppRole => value === 'customer' || value === 'owner';

  const getDefaultRoute = (role?: AppRole | null) => getDefaultRouteForAppRole(role ?? appRole);

  const applyGuestRole = (role: AppRole) => {
    setIsGuest(true);
    setAppRole(role);
    setOwnerType(role === 'owner' ? 'barber' : null);
    setActiveRole(role === 'owner' ? 'barber' : 'customer');
    sessionStorage.setItem(GUEST_ROLE_KEY, role);
    sessionStorage.removeItem(PENDING_ROLE_KEY);
  };

  const applyAuthenticatedRole = (userId: string, nextAppRole: AppRole, nextOwnerType: OwnerType | null) => {
    setIsGuest(false);
    setAppRole(nextAppRole);
    setOwnerType(nextOwnerType);
    setActiveRole(nextAppRole === 'owner' ? nextOwnerType ?? 'barber' : 'customer');
    localStorage.setItem(`${APP_ROLE_KEY_PREFIX}${userId}`, nextAppRole);

    if (nextOwnerType) {
      localStorage.setItem(`${OWNER_TYPE_KEY_PREFIX}${userId}`, nextOwnerType);
    } else {
      localStorage.removeItem(`${OWNER_TYPE_KEY_PREFIX}${userId}`);
    }

    sessionStorage.removeItem(GUEST_ROLE_KEY);
    sessionStorage.removeItem(PENDING_ROLE_KEY);
  };

  const restoreSignedOutRoleState = () => {
    setProfile(null);
    setRoles([]);

    const guestRole = sessionStorage.getItem(GUEST_ROLE_KEY);
    if (isAppRole(guestRole)) {
      applyGuestRole(guestRole);
      return;
    }

    setIsGuest(false);
    setAppRole(null);
    setOwnerType(null);
    setActiveRole(null);
  };

  const fetchProfile = async (userId: string) => {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileData) setProfile(profileData as unknown as Profile);
    else setProfile(null);

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    const userRoles = Array.from(new Set((roleData || []).map((role) => role.role as string)));
    setRoles(userRoles);

    const pendingRole = sessionStorage.getItem(PENDING_ROLE_KEY);
    const storedRole = localStorage.getItem(`${APP_ROLE_KEY_PREFIX}${userId}`);
    const preferredRole = isAppRole(pendingRole)
      ? pendingRole
      : isAppRole(storedRole)
        ? storedRole
        : 'customer';

    const nextAppRole: AppRole = preferredRole === 'owner' && hasOwnerAccess(userRoles) ? 'owner' : 'customer';
    const savedOwnerType = localStorage.getItem(`${OWNER_TYPE_KEY_PREFIX}${userId}`);
    const nextOwnerType = nextAppRole === 'owner' ? getOwnerType(userRoles, savedOwnerType) : null;

    applyAuthenticatedRole(userId, nextAppRole, nextOwnerType);
  };

  const ensureProfile = async (currentUser: User) => {
    const { data: existing } = await supabase
      .from('profiles')
      .select('id')
      .eq('user_id', currentUser.id)
      .single();

    if (!existing) {
      await supabase.from('profiles').insert({
        user_id: currentUser.id,
        name: currentUser.user_metadata?.name || '',
        email: currentUser.email || '',
        phone: currentUser.user_metadata?.phone || '',
      });

      const userRole = currentUser.user_metadata?.role || 'customer';
      const { data: existingRoles } = await supabase
        .from('user_roles')
        .select('id, role')
        .eq('user_id', currentUser.id);

      const hasRequestedRole = (existingRoles || []).some((item) => item.role === userRole);
      if (!hasRequestedRole) {
        await supabase.from('user_roles').insert({
          user_id: currentUser.id,
          role: userRole as any,
        });
      }
    }

    await fetchProfile(currentUser.id);
  };

  const setRolePreference = (role: AppRole) => {
    setIsGuest(false);
    setAppRole(role);
    setOwnerType(role === 'owner' ? ownerType ?? 'barber' : null);
    setActiveRole(role === 'owner' ? ownerType ?? 'barber' : 'customer');
    sessionStorage.setItem(PENDING_ROLE_KEY, role);
    sessionStorage.removeItem(GUEST_ROLE_KEY);
  };

  const enterGuestMode = (role: AppRole) => {
    setSession(null);
    setUser(null);
    applyGuestRole(role);
  };

  const clearGuestMode = () => {
    sessionStorage.removeItem(GUEST_ROLE_KEY);
    if (!user) {
      setIsGuest(false);
      setAppRole(null);
      setOwnerType(null);
      setActiveRole(null);
    }
  };

  const switchRole = (role: AppRole) => {
    if (role === 'customer') {
      if (user) applyAuthenticatedRole(user.id, 'customer', null);
      else applyGuestRole('customer');
      return true;
    }

    if (!user) {
      applyGuestRole('owner');
      return true;
    }

    const nextOwnerType = getOwnerType(roles, ownerType);
    if (!nextOwnerType || !roles.some((roleItem) => isOwnerBackendRole(roleItem))) {
      return false;
    }

    applyAuthenticatedRole(user.id, 'owner', nextOwnerType);
    return true;
  };

  useEffect(() => {
    const storedVersion = localStorage.getItem(ROLE_STATE_VERSION_KEY);
    if (storedVersion !== ROLE_STATE_VERSION) {
      sessionStorage.removeItem(GUEST_ROLE_KEY);
      sessionStorage.removeItem(PENDING_ROLE_KEY);
      localStorage.setItem(ROLE_STATE_VERSION_KEY, ROLE_STATE_VERSION);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);
        setLoading(true);

        if (newSession?.user) {
          setTimeout(async () => {
            await ensureProfile(newSession.user);
            setLoading(false);
          }, 0);
        } else {
          restoreSignedOutRoleState();
          setLoading(false);
        }
      }
    );

    supabase.auth.getSession().then(async ({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);

      if (existingSession?.user) {
        await ensureProfile(existingSession.user);
      } else {
        restoreSignedOutRoleState();
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, phone: string, userRole: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, role: userRole },
        emailRedirectTo: window.location.origin,
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string, desiredRole: AppRole = 'customer') => {
    setRolePreference(desiredRole);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    sessionStorage.removeItem(GUEST_ROLE_KEY);
    sessionStorage.removeItem(PENDING_ROLE_KEY);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRoles([]);
    setActiveRole(null);
    setAppRole(null);
    setOwnerType(null);
    setIsGuest(false);
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  const hasSelectedRole = appRole !== null;

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      roles,
      activeRole,
      appRole,
      ownerType,
      isGuest,
      hasSelectedRole,
      loading,
      signUp,
      signIn,
      signOut,
      refreshProfile,
      switchRole,
      enterGuestMode,
      clearGuestMode,
      setRolePreference,
      getDefaultRoute,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
