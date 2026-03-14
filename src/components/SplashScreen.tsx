import { motion, AnimatePresence } from 'framer-motion';
import bmbLogo from '@/assets/bmb-logo.png';

interface SplashScreenProps {
  show: boolean;
}

const SplashScreen = ({ show }: SplashScreenProps) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative"
          >
            <img src={bmbLogo} alt="BookMyBarber" className="w-28 h-28 rounded-3xl object-cover shadow-[0_0_60px_rgba(210,160,60,0.15)]" />

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.4, 1.6] }}
              transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 }}
              className="absolute inset-0 rounded-3xl border-2 border-primary/30"
            />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-6 text-2xl font-bold gold-text"
          >
            BookMyBarber
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-2 text-sm text-muted-foreground tracking-wide"
          >
            Your grooming, simplified.
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
