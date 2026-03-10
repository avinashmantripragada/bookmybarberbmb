import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Bell, Shield, LogOut, ChevronRight, Scissors } from 'lucide-react';

const ProfilePage = () => {
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: 'Edit Profile', action: () => {} },
    { icon: Scissors, label: 'Barber Dashboard', action: () => navigate('/dashboard') },
    { icon: Bell, label: 'Notifications', action: () => {} },
    { icon: Shield, label: 'Privacy & Security', action: () => {} },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14 pb-6">
        <h1 className="text-2xl font-bold text-foreground">Profile</h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="px-5 mb-8"
      >
        <div className="glass-card p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center text-2xl font-bold text-primary-foreground">
            A
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">Amit Kumar</h2>
            <p className="text-sm text-muted-foreground">+91 98765 43210</p>
            <p className="text-xs text-muted-foreground">amit@email.com</p>
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
          transition={{ delay: 0.3 }}
          onClick={() => navigate('/login')}
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
