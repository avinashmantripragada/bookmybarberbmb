import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AppLogo from '@/components/AppLogo';

const WelcomePage = () => {
  const navigate = useNavigate();

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
          onClick={() => navigate('/signin')}
          className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform"
        >
          Login
        </button>
        <button
          onClick={() => navigate('/signup')}
          className="w-full h-14 bg-secondary rounded-2xl font-semibold text-foreground text-lg active:scale-[0.97] transition-transform border border-border/50"
        >
          Sign Up
        </button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="mt-8"
      >
        <button
          onClick={() => navigate('/home')}
          className="text-muted-foreground text-sm font-medium hover:text-foreground transition-colors"
        >
          Continue as Guest
        </button>
      </motion.div>
    </div>
  );
};

export default WelcomePage;
