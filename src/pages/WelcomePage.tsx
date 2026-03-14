import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { User, Scissors, Eye } from 'lucide-react';
import AppLogo from '@/components/AppLogo';
import { toast } from 'sonner';

const WelcomePage = () => {
  const navigate = useNavigate();
  const [showGuestOptions, setShowGuestOptions] = useState(false);

  const handleGuest = () => {
    setShowGuestOptions(true);
  };

  const handleGuestAs = (mode: 'customer' | 'barber') => {
    localStorage.setItem('bmb_guest_mode', mode);
    toast.success(`Browsing as ${mode}`);
    navigate(mode === 'customer' ? '/home' : '/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
        className="mb-6"
      >
        <AppLogo size="lg" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="text-3xl font-bold gold-text mb-2"
      >
        BookMyBarber
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-muted-foreground text-sm mb-12"
      >
        Your grooming, simplified.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7, duration: 0.5 }}
        className="w-full space-y-3"
      >
        <button
          onClick={() => navigate('/signup?role=customer')}
          className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform flex items-center justify-center gap-3"
        >
          <User size={20} /> Continue as Customer
        </button>
        <button
          onClick={() => navigate('/signup?role=barber')}
          className="w-full h-14 bg-secondary rounded-2xl font-semibold text-foreground text-lg active:scale-[0.97] transition-transform border border-border/50 flex items-center justify-center gap-3"
        >
          <Scissors size={20} /> Continue as Barber
        </button>

        {!showGuestOptions ? (
          <button
            onClick={handleGuest}
            className="w-full h-12 rounded-2xl font-medium text-muted-foreground text-base hover:text-foreground transition-colors flex items-center justify-center gap-2"
          >
            <Eye size={18} /> Continue as Guest
          </button>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2 pt-1">
            <p className="text-xs text-muted-foreground text-center mb-2">Browse as:</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleGuestAs('customer')}
                className="flex-1 h-12 bg-secondary rounded-2xl text-sm font-medium text-foreground flex items-center justify-center gap-2"
              >
                <User size={16} /> Customer
              </button>
              <button
                onClick={() => handleGuestAs('barber')}
                className="flex-1 h-12 bg-secondary rounded-2xl text-sm font-medium text-foreground flex items-center justify-center gap-2"
              >
                <Scissors size={16} /> Barber
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-6 flex items-center gap-4 text-sm"
      >
        <button onClick={() => navigate('/signin')} className="text-primary font-medium">
          Sign In
        </button>
        <span className="text-muted-foreground">•</span>
        <button onClick={() => navigate('/signup')} className="text-muted-foreground">
          Create Account
        </button>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
