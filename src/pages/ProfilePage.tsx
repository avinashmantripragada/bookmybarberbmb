import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Shield, LogOut, ChevronRight, Scissors, CreditCard, Calendar, Camera, HelpCircle, Store, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, profile, role, signOut, loading, refreshProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [saving, setSaving] = useState(false);

  const displayName = profile?.name || user?.user_metadata?.name || 'Guest';
  const displayEmail = profile?.email || user?.email || '';
  const displayPhone = profile?.phone || '';

  const startEditing = () => {
    setName(displayName);
    setEmail(displayEmail);
    setPhone(displayPhone);
    setEditing(true);
  };

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({ name, phone, email }).eq('user_id', user.id);
    setSaving(false);
    if (error) { toast.error('Failed to update profile'); return; }
    toast.success('Profile updated!');
    setEditing(false);
    refreshProfile();
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out');
    navigate('/');
  };

  const menuItems = [
    { icon: User, label: 'Edit Profile', action: startEditing },
    { icon: Calendar, label: 'My Appointments', action: () => navigate('/appointments') },
    { icon: CreditCard, label: 'Payment Methods', action: () => toast.info('Coming soon') },
    ...(role === 'barber' ? [{ icon: Scissors, label: 'Barber Dashboard', action: () => navigate('/dashboard') }] : []),
    ...(role === 'shop_owner' ? [{ icon: Store, label: 'Shop Dashboard', action: () => navigate('/shop-dashboard') }] : []),
    ...(role === 'barber' && !profile ? [{ icon: Scissors, label: 'Complete Barber Setup', action: () => navigate('/barber-onboarding') }] : []),
    ...(role === 'shop_owner' ? [{ icon: Store, label: 'Create Shop', action: () => navigate('/shop-onboarding') }] : []),
    { icon: Bell, label: 'Notifications', action: () => toast.info('Coming soon') },
    { icon: Shield, label: 'Privacy & Security', action: () => toast.info('Coming soon') },
    { icon: HelpCircle, label: 'Help & Support', action: () => navigate('/help-support') },
  ];

  if (loading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 size={32} className="animate-spin text-primary" /></div>;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14 pb-6">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
      </div>

      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-5 mb-6">
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
            <div className="flex-1">
              {editing ? (
                <div className="space-y-2">
                  <input value={name} onChange={e => setName(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input value={email} onChange={e => setEmail(e.target.value)} className="w-full h-10 px-3 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <div className="flex gap-2">
                    <button onClick={handleSave} disabled={saving} className="h-9 px-4 gold-gradient rounded-xl text-sm font-medium text-primary-foreground flex items-center gap-1">
                      {saving ? <Loader2 size={14} className="animate-spin" /> : null} Save
                    </button>
                    <button onClick={() => setEditing(false)} className="h-9 px-4 bg-secondary rounded-xl text-sm font-medium text-foreground">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-foreground">{displayName}</h2>
                  <p className="text-sm text-muted-foreground">{displayPhone || 'No phone set'}</p>
                  <p className="text-xs text-muted-foreground">{displayEmail}</p>
                  {role && <span className="text-xs text-primary font-medium capitalize">{role.replace('_', ' ')}</span>}
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="px-5 space-y-2">
        {!user && (
          <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={() => navigate('/signin')}
            className="w-full glass-card p-4 flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"><User size={18} className="text-primary" /></div>
            <span className="flex-1 font-medium text-primary">Sign In / Sign Up</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </motion.button>
        )}

        {menuItems.map((item, i) => (
          <motion.button key={item.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            onClick={item.action} className="w-full glass-card p-4 flex items-center gap-4 text-left">
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"><item.icon size={18} className="text-primary" /></div>
            <span className="flex-1 font-medium text-foreground">{item.label}</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </motion.button>
        ))}

        {user && (
          <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} onClick={handleLogout}
            className="w-full glass-card p-4 flex items-center gap-4 text-left mt-6">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center"><LogOut size={18} className="text-destructive" /></div>
            <span className="flex-1 font-medium text-destructive">Log Out</span>
          </motion.button>
        )}
      </div>
    </div>
  );
};

export default ProfilePage;
