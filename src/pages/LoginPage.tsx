import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Scissors } from 'lucide-react';
import { toast } from 'sonner';

const LoginPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = () => {
    if (!phone || phone.length < 10) { toast.error('Enter a valid phone number'); return; }
    if (!isLogin && !name) { toast.error('Enter your name'); return; }
    toast.success(isLogin ? 'Welcome back!' : 'Account created!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 flex flex-col justify-center px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="w-20 h-20 rounded-3xl gold-gradient flex items-center justify-center mx-auto mb-6">
            <Scissors size={36} className="text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Book My Barber</h1>
          <p className="text-muted-foreground">Your grooming, simplified</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="space-y-4"
        >
          {!isLogin && (
            <input
              type="text"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          )}
          <div className="relative">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">+91</span>
            <input
              type="tel"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
              className="w-full h-14 pl-14 pr-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <button
            onClick={handleSubmit}
            className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform"
          >
            {isLogin ? 'Log In' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-muted-foreground">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary font-medium"
            >
              {isLogin ? 'Sign Up' : 'Log In'}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;
