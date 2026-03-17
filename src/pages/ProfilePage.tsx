import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Bell, LogOut, ChevronRight, CreditCard, Camera, Loader2, ArrowRightLeft, Settings, Scissors, Store, Heart, Star, Shield, HelpCircle, Info, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const socialLinks = [
  { label: 'Instagram', url: '#', icon: '📸' },
  { label: 'Facebook', url: '#', icon: '📘' },
  { label: 'YouTube', url: '#', icon: '📺' },
  { label: 'Twitter', url: '#', icon: '🐦' },
  { label: 'Snapchat', url: '#', icon: '👻' },
];

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, profile, roles, activeRole, signOut, loading, refreshProfile, switchRole } = useAuth();
  const [showRoleSwitcher, setShowRoleSwitcher] = useState(false);

  const displayName = profile?.name || user?.user_metadata?.name || 'Guest';
  const displayEmail = profile?.email || user?.email || '';
  const displayPhone = profile?.phone || '';

  const handleSwitchRole = async (role: string) => {
    if (role === 'barber') {
      const { data } = await supabase.from('barbers').select('id').eq('user_id', user?.id).single();
      if (!data) {
        setShowRoleSwitcher(false);
        toast.info('Complete your barber profile first');
        navigate('/barber-onboarding');
        return;
      }
    }
    if (role === 'shop_owner') {
      const { data } = await supabase.from('shops').select('id').eq('owner_id', user?.id).single();
      if (!data) {
        setShowRoleSwitcher(false);
        toast.info('Complete your shop setup first');
        navigate('/shop-onboarding');
        return;
      }
    }
    if (!roles.includes(role)) {
      await supabase.from('user_roles').insert({ user_id: user!.id, role: role as any });
      await refreshProfile();
    }
    switchRole(role);
    setShowRoleSwitcher(false);
    toast.success(`Switched to ${role.replace('_', ' ')} mode`);
    if (role === 'customer') navigate('/home');
    else if (role === 'barber') navigate('/dashboard');
    else if (role === 'shop_owner') navigate('/shop-dashboard');
    else if (role === 'admin') navigate('/admin');
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out');
    navigate('/');
  };

  const roleLabels: Record<string, string> = {
    customer: '👤 Customer',
    barber: '✂️ Barber',
    shop_owner: '🏪 Shop Owner',
    admin: '🛡️ Admin',
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        { icon: User, label: 'Manage Profile', action: () => navigate('/manage-profile') },
        { icon: Heart, label: 'Saved / Favorites', action: () => toast.info('Coming soon') },
        { icon: CreditCard, label: 'Payments', action: () => navigate('/payments') },
        { icon: Settings, label: 'Settings', action: () => navigate('/settings') },
      ],
    },
    {
      title: 'Role',
      items: [
        ...(activeRole === 'barber' ? [{ icon: Scissors, label: 'Barber Dashboard', action: () => navigate('/dashboard') }] : []),
        ...(activeRole === 'shop_owner' ? [{ icon: Store, label: 'Shop Dashboard', action: () => navigate('/shop-dashboard') }] : []),
        { icon: ArrowRightLeft, label: 'Switch Profile', action: () => setShowRoleSwitcher(true) },
      ],
    },
    {
      title: 'Support',
      items: [
        { icon: HelpCircle, label: 'Help & Support', action: () => navigate('/help-support') },
        { icon: Star, label: 'Rate App', action: () => toast.info('App Store rating coming soon') },
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

      {/* Profile Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-5 mb-5">
        <div className="glass-card p-5">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center text-2xl font-bold text-primary-foreground">
                {displayName.charAt(0).toUpperCase()}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Camera size={12} className="text-primary-foreground" />
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-lg font-semibold text-foreground truncate">{displayName}</h2>
              <p className="text-sm text-muted-foreground truncate">{displayEmail}</p>
              {activeRole && (
                <span className="inline-flex items-center gap-1 text-xs text-primary font-medium capitalize mt-0.5">
                  {roleLabels[activeRole] || activeRole.replace('_', ' ')}
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

        {/* Version */}
        <p className="text-center text-[10px] text-muted-foreground/50 py-4">BookMyBarber v1.0.0</p>
      </div>

      {/* Role Switcher Modal */}
      {showRoleSwitcher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 w-full max-w-sm">
            <h3 className="text-lg font-semibold text-foreground mb-1">Switch Profile</h3>
            <p className="text-xs text-muted-foreground mb-4">Current: {roleLabels[activeRole || ''] || activeRole}</p>
            <div className="space-y-2">
              <button onClick={() => handleSwitchRole('customer')}
                className={`w-full p-4 rounded-xl text-left text-sm font-medium transition-all ${
                  activeRole === 'customer' ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
                }`}>
                👤 Customer
              </button>
              {roles.filter(r => r !== 'customer').map(r => (
                <button key={r} onClick={() => handleSwitchRole(r)}
                  className={`w-full p-4 rounded-xl text-left text-sm font-medium transition-all ${
                    r === activeRole ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-foreground hover:bg-secondary/80'
                  }`}>
                  {roleLabels[r] || r.replace('_', ' ')}
                </button>
              ))}
              {!roles.includes('barber') && !roles.includes('shop_owner') && (
                <button onClick={() => { setShowRoleSwitcher(false); navigate('/signup?role=barber'); }}
                  className="w-full p-4 rounded-xl text-left text-sm font-medium bg-secondary/50 text-muted-foreground border border-dashed border-border">
                  ➕ Become a Barber / Shop Owner
                </button>
              )}
            </div>
            <button onClick={() => setShowRoleSwitcher(false)} className="w-full mt-4 h-10 bg-secondary rounded-xl text-sm text-muted-foreground">
              Cancel
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
