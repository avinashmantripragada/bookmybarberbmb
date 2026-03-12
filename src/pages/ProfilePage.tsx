import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Bell, Shield, LogOut, ChevronRight, Scissors, CreditCard, Calendar, Camera, Edit2, HelpCircle } from 'lucide-react';
import { toast } from 'sonner';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState('Amit Kumar');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [email, setEmail] = useState('amit@email.com');

  const menuItems = [
    { icon: User, label: 'Edit Profile', action: () => setEditing(!editing) },
    { icon: Calendar, label: 'My Appointments', action: () => navigate('/appointments') },
    { icon: CreditCard, label: 'Payment Methods', action: () => toast.info('Coming soon') },
    { icon: Scissors, label: 'Barber Dashboard', action: () => navigate('/dashboard') },
    { icon: Bell, label: 'Notifications', action: () => toast.info('Coming soon') },
    { icon: Shield, label: 'Privacy & Security', action: () => toast.info('Coming soon') },
  ];

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
                A
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                <Camera size={12} className="text-primary-foreground" />
              </button>
            </div>
            <div className="flex-1">
              {editing ? (
                <div className="space-y-2">
                  <input value={name} onChange={e => setName(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <input value={email} onChange={e => setEmail(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl bg-secondary text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                  <button onClick={() => { setEditing(false); toast.success('Profile updated!'); }}
                    className="h-9 px-4 gold-gradient rounded-xl text-sm font-medium text-primary-foreground">
                    Save
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-lg font-semibold text-foreground">{name}</h2>
                  <p className="text-sm text-muted-foreground">{phone}</p>
                  <p className="text-xs text-muted-foreground">{email}</p>
                </>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      <div className="px-5 space-y-2">
        {menuItems.map((item, i) => (
          <motion.button
            key={item.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            onClick={item.action}
            className="w-full glass-card p-4 flex items-center gap-4 text-left"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
              <item.icon size={18} className="text-primary" />
            </div>
            <span className="flex-1 font-medium text-foreground">{item.label}</span>
            <ChevronRight size={16} className="text-muted-foreground" />
          </motion.button>
        ))}

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          onClick={() => navigate('/welcome')}
          className="w-full glass-card p-4 flex items-center gap-4 text-left mt-6"
        >
          <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
            <LogOut size={18} className="text-destructive" />
          </div>
          <span className="flex-1 font-medium text-destructive">Log Out</span>
        </motion.button>
      </div>
    </div>
  );
};

export default ProfilePage;
