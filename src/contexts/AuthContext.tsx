import { createContext, useContext, useEffect, useState, useRef, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User, Session } from '@supabase/supabase-js';

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
  loading: boolean;
  signUp: (email: string, password: string, name: string, phone: string, role: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  switchRole: (role: string) => void;
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
  const [loading, setLoading] = useState(true);
  // Prevent automatic role switching once user has explicitly chosen
  const userSwitchedRef = useRef(false);

  const fetchProfile = async (userId: string) => {
    const { data: profileData } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (profileData) setProfile(profileData as unknown as Profile);

    const { data: roleData } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (roleData && roleData.length > 0) {
      const userRoles = roleData.map(r => r.role as string);
      setRoles(userRoles);

      // Only set active role if user hasn't explicitly switched
      if (!userSwitchedRef.current) {
        const saved = localStorage.getItem(`bmb_active_role_${userId}`);
        if (saved && userRoles.includes(saved)) {
          setActiveRole(saved);
        } else if (!activeRole || !userRoles.includes(activeRole)) {
          setActiveRole(userRoles[0]);
        }
      }
    }
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
      await supabase.from('user_roles').insert({
        user_id: currentUser.id,
        role: userRole as any,
      });
    }

    await fetchProfile(currentUser.id);
  };

  const switchRole = (role: string) => {
    if (roles.includes(role)) {
      userSwitchedRef.current = true;
      setActiveRole(role);
      if (user) {
        localStorage.setItem(`bmb_active_role_${user.id}`, role);
      }
    }
  };

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
        setUser(newSession?.user ?? null);

        if (newSession?.user) {
          setTimeout(() => ensureProfile(newSession.user), 0);
        } else {
          setProfile(null);
          setRoles([]);
          setActiveRole(null);
          userSwitchedRef.current = false;
        }
        setLoading(false);
      }
    );

    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      setUser(existingSession?.user ?? null);
      if (existingSession?.user) {
        ensureProfile(existingSession.user);
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

  const signIn = async (email: string, password: string) => {
    userSwitchedRef.current = false;
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error };
  };

  const signOut = async () => {
    userSwitchedRef.current = false;
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setRoles([]);
    setActiveRole(null);
  };

  const refreshProfile = async () => {
    if (user) await fetchProfile(user.id);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, roles, activeRole, loading, signUp, signIn, signOut, refreshProfile, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
};
