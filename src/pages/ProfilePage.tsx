import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, LogOut, ChevronRight, CreditCard, Camera, Loader2, ArrowRightLeft, Settings, Scissors, Store, Heart, Star, HelpCircle, Info, Eye, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import DashboardBottomNav from '@/components/DashboardBottomNav';
import { ActiveProfile, PROFILE_LABELS } from '@/lib/role-routing';

const socialLinks = [
  { label: 'Instagram', url: '#', icon: '📸' },
  { label: 'Facebook', url: '#', icon: '📘' },
  { label: 'YouTube', url: '#', icon: '📺' },
  { label: 'Twitter', url: '#', icon: '🐦' },
  { label: 'Snapchat', url: '#', icon: '👻' },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, profile, activeProfile, isGuest, signOut, loading, switchProfile, enterGuestMode, getHomeRoute, hasProfile } = useAuth();
  const [showSwitcher, setShowSwitcher] = useState(false);
  const [showCreateProfile, setShowCreateProfile] = useState(false);
  const [pendingProfile, setPendingProfile] = useState<ActiveProfile | null>(null);

  const [roleDisplayName, setRoleDisplayName] = useState('');

  const displayEmail = profile?.email || user?.email || '';
  const currentLabel = activeProfile ? PROFILE_LABELS[activeProfile] : 'Guest';

  // Load role-specific display name
  useEffect(() => {
    if (!user) {
      setRoleDisplayName(isGuest ? 'Guest' : '');
      return;
    }
    const loadName = async () => {
      if (activeProfile === 'shop_owner') {
        const { data } = await supabase.from('shops').select('shop_name').eq('owner_id', user.id).limit(1).single();
        setRoleDisplayName(data?.shop_name || profile?.name || 'Shop Owner');
      } else if (activeProfile === 'independent_barber') {
        const { data } = await supabase.from('barbers').select('name').eq('user_id', user.id).limit(1).single();
        setRoleDisplayName(data?.name || profile?.name || 'Barber');
      } else {
        setRoleDisplayName(profile?.name || user?.user_metadata?.name || 'User');
      }
    };
    loadName();
  }, [user, activeProfile, profile]);

  const displayName = roleDisplayName || profile?.name || user?.user_metadata?.name || 'Guest';

  const handleSwitch = (p: ActiveProfile) => {
    if (!user && !isGuest) {
      // Not logged in, not guest — show auth options
      setPendingProfile(p);
      return;
    }

    if (user && !hasProfile(p)) {
      // Logged in but doesn't have this profile → go to creation
      setShowSwitcher(false);
      if (p === 'shop_owner') navigate('/shop-onboarding');
      else if (p === 'independent_barber') navigate('/barber-onboarding');
      return;
    }

    const switched = switchProfile(p);
    if (switched) {
      setShowSwitcher(false);
      toast.success(`Switched to ${PROFILE_LABELS[p]}`);
      navigate(getHomeRoute(p), { replace: true });
    }
  };

  const handleGuestForProfile = () => {
    if (!pendingProfile) return;
    enterGuestMode(pendingProfile);
    setShowSwitcher(false);
    setPendingProfile(null);
    toast.success(`Guest mode: ${PROFILE_LABELS[pendingProfile]}`);
    navigate(getHomeRoute(pendingProfile), { replace: true });
  };

  const handleCreateProfile = (type: 'shop_owner' | 'independent_barber') => {
    setShowCreateProfile(false);
    if (!user) {
      // Not logged in — show auth options for this profile type
      setPendingProfile(type);
      setShowSwitcher(true);
      return;
    }
    if (hasProfile(type)) {
      toast.error('Profile already exists');
      return;
    }
    if (type === 'shop_owner') navigate('/shop-onboarding');
    else navigate('/barber-onboarding');
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out');
    navigate('/');
  };

  const isOwnerMode = activeProfile === 'shop_owner';
  const isBarberMode = activeProfile === 'independent_barber';

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Manage Profile', action: () => navigate('/manage-profile') },
        ...(!isOwnerMode && !isBarberMode ? [{ icon: Heart, label: 'Saved / Favorites', action: () => toast.info('Coming soon') }] : []),
        { icon: CreditCard, label: 'Payments', action: () => navigate('/payments') },
        { icon: Settings, label: 'Settings', action: () => navigate('/settings') },
      ],
    },
    ...(isOwnerMode ? [{
      title: 'Business',
      items: [
        { icon: Store, label: 'Go to Dashboard', action: () => navigate(getHomeRoute('shop_owner')) },
        { icon: Eye, label: 'Shop Visibility', action: () => toast.info('Coming soon') },
      ],
    }] : []),
    ...(isBarberMode ? [{
      title: 'Business',
      items: [
        { icon: Scissors, label: 'Go to Dashboard', action: () => navigate(getHomeRoute('independent_barber')) },
      ],
    }] : []),
    {
      title: 'Profiles',
      items: [
        { icon: ArrowRightLeft, label: 'Switch Profile', action: () => setShowSwitcher(true) },
        { icon: Plus, label: 'Create New Profile', action: () => setShowCreateProfile(true) },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', action: () => navigate('/help-support') },
        { icon: Star, label: 'Rate App', action: () => toast.info('Coming soon') },
        { icon: Info, label: 'About Us', action: () => navigate('/about') },
      ],
    },
  ];

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 size={32} className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14 pb-2">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
      </div>

      {/* Guest indicator */}
      {isGuest && (
        <div className="px-5 mb-3">
          <div className="bg-primary/10 border border-primary/20 rounded-xl px-4 py-2 text-xs text-primary font-medium text-center">
            🔓 Guest Mode — No data is saved
          </div>
        </div>
      )}

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-5 mb-5">
        <div className="glass-card p-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center text-2xl font-bold text-primary-foreground">
                {profile?.avatar_url ? (
                  <img src={profile.avatar_url} alt="" className="w-16 h-16 rounded-2xl object-cover" />
                ) : displayName.charAt(0).toUpperCase()}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Camera size={12} className="text-primary-foreground" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-foreground truncate">{displayName}</h2>
              <p className="text-sm text-muted-foreground truncate">{displayEmail}</p>
              {activeProfile && (
                <span className="inline-flex items-center gap-1 text-xs text-primary font-medium mt-0.5">
                  {currentLabel}
                </span>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Sign in prompt for guests */}
      {!user && (
        <div className="px-5 mb-4">
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={() => navigate('/signin')}
            className="w-full glass-card p-4 flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><User size={18} className="text-primary" /></div>
            <span className="flex-1 font-medium text-primary">Sign In / Sign Up</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </motion.button>
        </div>
      )}

      {/* Menu Sections */}
      <div className="px-5 space-y-5">
        {menuSections.map((section, si) => (
          <div key={section.title}>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">{section.title}</p>
            <div className="space-y-1.5">
              {section.items.map((item, i) => (
                <motion.button key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: (si * 4 + i) * 0.03 }}
                  onClick={item.action} className="w-full glass-card p-4 flex items-center gap-4 text-left">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"><item.icon size={18} className="text-primary" /></div>
                  <span className="flex-1 font-medium text-foreground text-sm">{item.label}</span>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </motion.button>
              ))}
            </div>
          </div>
        ))}

        {/* Logout */}
        {user && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} onClick={handleLogout}
            className="w-full glass-card p-4 flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center"><LogOut size={18} className="text-destructive" /></div>
            <span className="flex-1 font-medium text-destructive text-sm">Log Out</span>
          </motion.button>
        )}

        {/* Social Links */}
        <div className="pt-4">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Follow Us</p>
          <div className="flex justify-center gap-4">
            {socialLinks.map(s => (
              <button key={s.label} onClick={() => window.open(s.url, '_blank')}
                className="w-11 h-11 rounded-xl bg-secondary flex items-center justify-center text-lg active:scale-95 transition-transform">
                {s.icon}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-[10px] text-muted-foreground/50 py-4">BookMyBarber v1.0.0</p>
      </div>

      {/* Switch Profile Modal */}
      {showSwitcher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-foreground mb-1">Switch Profile</h3>
            <p className="text-xs text-muted-foreground mb-4">Current: {currentLabel}</p>

            {pendingProfile && !user ? (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-2">Continue as {PROFILE_LABELS[pendingProfile]}:</p>
                <button onClick={() => { setShowSwitcher(false); navigate('/signin'); }}
                  className="w-full p-4 rounded-xl text-left text-sm font-medium gold-gradient text-primary-foreground">Login</button>
                <button onClick={() => { setShowSwitcher(false); navigate('/signup'); }}
                  className="w-full p-4 rounded-xl text-left text-sm font-medium bg-secondary text-foreground hover:bg-secondary/80">Sign Up</button>
                <button onClick={handleGuestForProfile}
                  className="w-full p-4 rounded-xl text-left text-sm font-medium bg-secondary text-foreground hover:bg-secondary/80">Continue as Guest</button>
                <button onClick={() => setPendingProfile(null)} className="w-full mt-2 h-10 bg-secondary/50 rounded-xl text-sm text-muted-foreground">Back</button>
              </div>
            ) : (
              <div className="space-y-2">
                {(['customer', 'shop_owner', 'independent_barber'] as ActiveProfile[]).map(p => {
                  const available = !user || hasProfile(p);
                  return (
                    <button key={p} onClick={() => handleSwitch(p)}
                      className={`w-full p-4 rounded-xl text-left text-sm font-medium transition-all ${
                        activeProfile === p ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
                      }`}>
                      <span>{PROFILE_LABELS[p]}</span>
                      {user && !available && <span className="text-xs text-muted-foreground ml-2">(not created)</span>}
                    </button>
                  );
                })}
              </div>
            )}

            <button onClick={() => { setShowSwitcher(false); setPendingProfile(null); }} className="w-full mt-4 h-10 bg-secondary rounded-xl text-sm text-muted-foreground">Cancel</button>
          </motion.div>
        </div>
      )}

      {/* Create New Profile Modal */}
      {showCreateProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-foreground mb-1">Create New Profile</h3>
            <p className="text-xs text-muted-foreground mb-4">Add a professional profile to your account</p>

            <div className="space-y-2">
              <button onClick={() => handleCreateProfile('shop_owner')}
                className="w-full glass-card p-5 flex items-center gap-4 text-left active:scale-[0.98] transition-transform">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center"><Store size={24} className="text-primary" /></div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">Shop Owner</h4>
                  <p className="text-xs text-muted-foreground">Create a shop, add barbers</p>
                </div>
              </button>
              <button onClick={() => handleCreateProfile('independent_barber')}
                className="w-full glass-card p-5 flex items-center gap-4 text-left active:scale-[0.98] transition-transform">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center"><Scissors size={24} className="text-primary" /></div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">Independent Barber</h4>
                  <p className="text-xs text-muted-foreground">Manage your own schedule</p>
                </div>
              </button>
            </div>

            <button onClick={() => setShowCreateProfile(false)} className="w-full mt-4 h-10 bg-secondary rounded-xl text-sm text-muted-foreground">Cancel</button>
          </motion.div>
        </div>
      )}

      {(activeProfile === 'shop_owner' || activeProfile === 'independent_barber') && <DashboardBottomNav />}
    </div>
  );
};

export default ProfilePage;
