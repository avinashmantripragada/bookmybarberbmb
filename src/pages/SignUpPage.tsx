import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, ChevronDown, Loader2 } from 'lucide-react';
import AppLogo from '@/components/AppLogo';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

const countryCodes = [
  { code: '+1', flag: '🇺🇸', name: 'US' },
  { code: '+91', flag: '🇮🇳', name: 'IN' },
  { code: '+44', flag: '🇬🇧', name: 'UK' },
  { code: '+61', flag: '🇦🇺', name: 'AU' },
  { code: '+971', flag: '🇦🇪', name: 'UAE' },
  { code: '+966', flag: '🇸🇦', name: 'SA' },
  { code: '+65', flag: '🇸🇬', name: 'SG' },
  { code: '+81', flag: '🇯🇵', name: 'JP' },
];

const SignUpPage = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState(countryCodes[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) { toast.error('Enter your name'); return; }
    if (!email.trim()) { toast.error('Enter your email'); return; }
    if (!phone || phone.length < 7) { toast.error('Enter a valid phone number'); return; }
    if (!password || password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    setSubmitting(true);
    const { error } = await signUp(email, password, name, `${countryCode.code}${phone}`);
    setSubmitting(false);

    if (error) {
      toast.error(error.message || 'Signup failed');
      return;
    }

    toast.success('Account created! Please check your email to verify.');
    navigate('/signin', { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-5 pt-14 pb-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
      </div>

      <div className="flex-1 px-8 pb-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8 flex flex-col items-center">
          <AppLogo size="md" />
          <h1 className="text-2xl font-bold text-foreground mt-4 mb-1">Create Account</h1>
          <p className="text-sm text-muted-foreground">Join BookMyBarber as a customer</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
          <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}
            className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          <div className="relative">
            <button onClick={() => setShowCountryPicker(!showCountryPicker)}
              className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm text-muted-foreground z-10 px-1 py-1 rounded-lg hover:bg-muted/30 transition-colors">
              <span>{countryCode.flag}</span><span className="text-xs">{countryCode.code}</span><ChevronDown size={12} />
            </button>
            {showCountryPicker && (
              <div className="absolute left-0 top-full mt-1 w-48 bg-card border border-border rounded-xl shadow-lg z-50 max-h-48 overflow-y-auto">
                {countryCodes.map((c) => (
                  <button key={c.code} onClick={() => { setCountryCode(c); setShowCountryPicker(false); }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-secondary transition-colors ${c.code === countryCode.code ? 'text-primary' : 'text-foreground'}`}>
                    <span>{c.flag}</span><span>{c.name}</span><span className="text-muted-foreground ml-auto">{c.code}</span>
                  </button>
                ))}
              </div>
            )}
            <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 15))}
              className="w-full h-14 pl-[5.5rem] pr-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
          </div>
          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)}
              className="w-full h-14 px-5 pr-14 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            <button onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button onClick={handleSubmit} disabled={submitting}
            className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform disabled:opacity-60 flex items-center justify-center gap-2">
            {submitting ? <><Loader2 size={20} className="animate-spin" /> Creating...</> : 'Create Account'}
          </button>

          <p className="text-center text-sm text-muted-foreground">Already have an account?{' '}<button onClick={() => navigate('/signin')} className="text-primary font-medium">Sign In</button></p>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUpPage;
