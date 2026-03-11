import { motion, AnimatePresence } from 'framer-motion';
import { Scissors } from 'lucide-react';

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
          {/* Logo icon */}
          <motion.div
            initial={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              duration: 1.2,
              ease: [0.25, 0.1, 0.25, 1],
            }}
            className="relative"
          >
            <div className="w-24 h-24 rounded-3xl bg-secondary flex items-center justify-center shadow-[0_0_60px_rgba(210,160,60,0.15)]">
              <Scissors size={44} className="text-primary" strokeWidth={2} />
            </div>

            {/* Glow ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 0.4, 0], scale: [0.8, 1.4, 1.6] }}
              transition={{ duration: 1.8, ease: 'easeOut', delay: 0.3 }}
              className="absolute inset-0 rounded-3xl border-2 border-primary/30"
            />
          </motion.div>

          {/* Brand name */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
            className="mt-6 text-2xl font-bold gold-text"
          >
            BookMyBarber
          </motion.h1>

          {/* Tagline */}
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
