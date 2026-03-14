import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Lock, Camera, Phone, Mail, Edit2, Scissors, Store, Clock, Image, ChevronRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type Section = 'menu' | 'personal' | 'password' | 'services' | 'portfolio' | 'shop' | 'availability';

const ManageProfilePage = () => {
  const navigate = useNavigate();
  const { user, profile, activeRole, refreshProfile } = useAuth();

  const [section, setSection] = useState<Section>('menu');
  const [name, setName] = useState(profile?.name || '');
  const [phone, setPhone] = useState(profile?.phone || '');
  const [email, setEmail] = useState(profile?.email || user?.email || '');
  const [bio, setBio] = useState('');
  const [saving, setSaving] = useState(false);

  // Password
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const handleSavePersonal = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase.from('profiles').update({ name, phone, email }).eq('user_id', user.id);
    setSaving(false);
    if (error) { toast.error('Failed to update profile'); return; }
    toast.success('Profile updated!');
    refreshProfile();
    setSection('menu');
  };

  const handleChangePassword = async () => {
    if (!currentPassword) { toast.error('Enter current password'); return; }
    if (!newPassword || newPassword.length < 6) { toast.error('New password must be at least 6 characters'); return; }
    if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return; }

    setChangingPassword(true);
    // Verify current password by re-signing in
    const { error: signInErr } = await supabase.auth.signInWithPassword({
      email: user?.email || '',
      password: currentPassword,
    });
    if (signInErr) {
      setChangingPassword(false);
      toast.error('Current password is incorrect');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password: newPassword });
    setChangingPassword(false);
    if (error) { toast.error(error.message || 'Failed to change password'); return; }
    toast.success('Password changed successfully!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setSection('menu');
  };

  const sections = [
    { key: 'personal' as Section, icon: User, label: 'Personal Information', desc: 'Name, photo, phone, email, bio' },
    { key: 'password' as Section, icon: Lock, label: 'Password & Security', desc: 'Change password, security settings' },
    ...(activeRole === 'barber' ? [
      { key: 'services' as Section, icon: Scissors, label: 'Services', desc: 'Manage your service offerings' },
      { key: 'portfolio' as Section, icon: Image, label: 'Portfolio', desc: 'Your work photos and gallery' },
      { key: 'availability' as Section, icon: Clock, label: 'Availability', desc: 'Working hours and schedule' },
    ] : []),
    ...(activeRole === 'shop_owner' ? [
      { key: 'shop' as Section, icon: Store, label: 'Shop Details', desc: 'Shop info, address, hours' },
      { key: 'services' as Section, icon: Scissors, label: 'Services', desc: 'Manage shop services' },
    ] : []),
  ];

  const renderContent = () => {
    switch (section) {
      case 'personal':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <div className="w-24 h-24 rounded-3xl gold-gradient flex items-center justify-center text-3xl font-bold text-primary-foreground">
                  {(name || 'G').charAt(0).toUpperCase()}
                </div>
                <button className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <Camera size={14} className="text-primary-foreground" />
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Name</label>
              <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name"
                className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Phone</label>
              <div className="relative">
                <Phone size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number"
                  className="w-full h-14 pl-12 pr-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email Address"
                  className="w-full h-14 pl-12 pr-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Bio</label>
              <textarea value={bio} onChange={e => setBio(e.target.value)} placeholder="Tell something about yourself"
                className="w-full h-24 px-5 py-4 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
            </div>

            <button onClick={handleSavePersonal} disabled={saving}
              className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform disabled:opacity-60 flex items-center justify-center gap-2">
              {saving ? <Loader2 size={20} className="animate-spin" /> : null} Save Changes
            </button>
          </motion.div>
        );

      case 'password':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <div className="glass-card p-4 mb-2">
              <p className="text-sm text-muted-foreground">To change your password, enter your current password first, then set a new one.</p>
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Current Password</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} value={currentPassword} onChange={e => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                  className="w-full h-14 px-5 pr-14 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">New Password</label>
              <input type={showPassword ? 'text' : 'password'} value={newPassword} onChange={e => setNewPassword(e.target.value)}
                placeholder="Enter new password (min 6 chars)"
                className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wider mb-1 block">Confirm New Password</label>
              <input type={showPassword ? 'text' : 'password'} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                placeholder="Confirm new password"
                className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>

            <button onClick={handleChangePassword} disabled={changingPassword}
              className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform disabled:opacity-60 flex items-center justify-center gap-2">
              {changingPassword ? <Loader2 size={20} className="animate-spin" /> : null} Update Password
            </button>

            <button onClick={() => navigate('/forgot-password')} className="w-full text-center text-sm text-primary font-medium py-2">
              Forgot your password?
            </button>
          </motion.div>
        );

      case 'services':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <p className="text-sm text-muted-foreground">Manage your services from the dashboard.</p>
            <button onClick={() => navigate(activeRole === 'barber' ? '/dashboard' : '/shop-dashboard')}
              className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform">
              Go to Dashboard
            </button>
          </motion.div>
        );

      case 'portfolio':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <p className="text-sm text-muted-foreground">Manage your portfolio photos from the dashboard.</p>
            <button onClick={() => navigate('/dashboard')}
              className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform">
              Go to Dashboard
            </button>
          </motion.div>
        );

      case 'shop':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <p className="text-sm text-muted-foreground">Edit your shop details from the shop setup page.</p>
            <button onClick={() => navigate('/shop-onboarding')}
              className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform">
              Edit Shop Details
            </button>
          </motion.div>
        );

      case 'availability':
        return (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
            <p className="text-sm text-muted-foreground">Set your availability from the dashboard.</p>
            <button onClick={() => navigate('/dashboard')}
              className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform">
              Go to Dashboard
            </button>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => section === 'menu' ? navigate(-1) : setSection('menu')}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <h1 className="text-xl font-bold text-foreground">
            {section === 'menu' ? 'Manage Profile' : sections.find(s => s.key === section)?.label || 'Manage Profile'}
          </h1>
        </div>
      </div>

      <div className="px-5">
        {section === 'menu' ? (
          <div className="space-y-2">
            {sections.map((item, i) => (
              <motion.button key={item.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                onClick={() => setSection(item.key)} className="w-full glass-card p-4 flex items-center gap-4 text-left">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  <item.icon size={18} className="text-primary" />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
                <ChevronRight size={16} className="text-muted-foreground" />
              </motion.button>
            ))}
          </div>
        ) : (
          renderContent()
        )}
      </div>
    </div>
  );
};

export default ManageProfilePage;
