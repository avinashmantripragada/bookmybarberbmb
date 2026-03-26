import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';
import { ActiveProfile, isActiveProfile, getHomeRoute, dbRoleToProfile } from '@/lib/role-routing';

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
  activeProfile: ActiveProfile | null;
  isGuest: boolean;
  hasSelectedProfile: boolean;
  loading: boolean;
  signUp: (email: string, password: string, name: string, phone: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  switchProfile: (profile: ActiveProfile) => boolean;
  enterGuestMode: (profile: ActiveProfile) => void;
  clearGuestMode: () => void;
  setProfilePreference: (profile: ActiveProfile) => void;
  getHomeRoute: (profile?: ActiveProfile | null) => string;
  hasProfile: (profile: ActiveProfile) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

const ACTIVE_PROFILE_KEY = 'bmb_active_profile_';
const GUEST_PROFILE_KEY = 'bmb_guest_profile';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [roles, setRoles] = useState<string[]>([]);
  const [activeProfile, setActiveProfile] = useState<ActiveProfile | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  const hasProfile = (p: ActiveProfile): boolean => {
    if (p === 'customer') return true; // every user is a customer
    if (p === 'shop_owner') return roles.includes('shop_owner');
    if (p === 'independent_barber') return roles.includes('barber');
    return false;
  };

  const applyGuestProfile = (p: ActiveProfile) => {
    setIsGuest(true);
    setActiveProfile(p);
    sessionStorage.setItem(GUEST_PROFILE_KEY, p);
  };

  const applyAuthProfile = (userId: string, p: ActiveProfile) => {
    setIsGuest(false);
    setActiveProfile(p);
    localStorage.setItem(`${ACTIVE_PROFILE_KEY}${userId}`, p);
    sessionStorage.removeItem(GUEST_PROFILE_KEY);
  };

  const restoreSignedOut = () => {
    setProfile(null);
    setRoles([]);
    const guestProfile = sessionStorage.getItem(GUEST_PROFILE_KEY);
    if (isActiveProfile(guestProfile)) {
      applyGuestProfile(guestProfile);
      return;
    }
    setIsGuest(false);
    setActiveProfile(null);
  };

  const fetchUserData = async (userId: string) => {
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

    const userRoles = Array.from(new Set((roleData || []).map((r) => r.role as string)));
    setRoles(userRoles);

    // Determine active profile: stored preference > last used > customer
    const stored = localStorage.getItem(`${ACTIVE_PROFILE_KEY}${userId}`);
    if (isActiveProfile(stored) && canUseProfile(stored, userRoles)) {
      applyAuthProfile(userId, stored);
    } else {
      applyAuthProfile(userId, 'customer');
    }
  };

  const canUseProfile = (p: ActiveProfile, userRoles: string[]): boolean => {
    if (p === 'customer') return true;
    if (p === 'shop_owner') return userRoles.includes('shop_owner');
    if (p === 'independent_barber') return userRoles.includes('barber');
    return false;
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

      // Always create customer role
      const { data: existingRoles } = await supabase
        .from('user_roles')
        .select('id, role')
        .eq('user_id', currentUser.id);

      const hasCustomer = (existingRoles || []).some((item) => item.role === 'customer');
      if (!hasCustomer) {
        await supabase.from('user_roles').insert({
          user_id: currentUser.id,
          role: 'customer' as any,
        });
      }
    }

    await fetchUserData(currentUser.id);
  };

  const enterGuestMode = (p: ActiveProfile) => {
    setSession(null);
    setUser(null);
    applyGuestProfile(p);
  };

  const clearGuestMode = () => {
    sessionStorage.removeItem(GUEST_PROFILE_KEY);
    if (!user) {
      setIsGuest(false);
      setActiveProfile(null);
    }
  };

  const switchProfile = (p: ActiveProfile): boolean => {
    if (!user) {
      applyGuestProfile(p);
      return true;
    }
    if (!canUseProfile(p, roles)) return false;
    applyAuthProfile(user.id, p);
    return true;
  };

  const setProfilePreference = (p: ActiveProfile) => {
    setIsGuest(false);
    setActiveProfile(p);
    if (user) {
      localStorage.setItem(`${ACTIVE_PROFILE_KEY}${user.id}`, p);
    }
  };

  useEffect(() => {
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
          restoreSignedOut();
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
        restoreSignedOut();
      }

      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string, name: string, phone: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name, phone, role: 'customer' },
        emailRedirectTo: window.location.origin,
      },
    });
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    sessionStorage.removeItem(GUEST_PROFILE_KEY);
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRoles([]);
    setActiveProfile(null);
    setIsGuest(false);
  };

  const refreshProfile = async () => {
    if (user) await fetchUserData(user.id);
  };

  const hasSelectedProfile = activeProfile !== null;

  return (
    <AuthContext.Provider value={{
      user,
      session,
      profile,
      roles,
      activeProfile,
      isGuest,
      hasSelectedProfile,
      loading,
      signUp,
      signIn,
      signOut,
      refreshProfile,
      switchProfile,
      enterGuestMode,
      clearGuestMode,
      setProfilePreference,
      getHomeRoute: (p?: ActiveProfile | null) => getHomeRoute(p ?? activeProfile),
      hasProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
