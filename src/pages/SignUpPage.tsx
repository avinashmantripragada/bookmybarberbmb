import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import AppLogo from '@/components/AppLogo';
import { toast } from 'sonner';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedRole = searchParams.get('role') || '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'customer' | 'barber'>(
    preselectedRole === 'barber' ? 'barber' : 'customer'
  );

  const handleSubmit = () => {
    if (!name.trim()) { toast.error('Enter your name'); return; }
    if (!email.trim()) { toast.error('Enter your email'); return; }
    if (!phone || phone.length < 10) { toast.error('Enter a valid phone number'); return; }
    if (!password || password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    toast.success('Account created! Please verify your phone.');
    navigate('/verify', { state: { phone, role } });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-5 pt-14 pb-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
      </div>

      <div className="flex-1 px-8 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-1">Create Account</h1>
          <p className="text-sm text-muted-foreground">Join BookMyBarber today</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
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
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 px-5 pr-14 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* Role Selection */}
          <div>
            <p className="text-sm text-muted-foreground mb-2">I am a</p>
            <div className="flex gap-3">
              {(['customer', 'barber'] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setRole(r)}
                  className={`flex-1 h-12 rounded-2xl text-sm font-medium capitalize transition-all ${
                    role === r ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground'
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform"
          >
            Create Account
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <button onClick={() => navigate('/signin')} className="text-primary font-medium">
              Sign In
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPage;
