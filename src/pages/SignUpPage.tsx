import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, ChevronDown, Scissors, Store, User } from 'lucide-react';
import AppLogo from '@/components/AppLogo';
import { toast } from 'sonner';

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

type Role = 'customer' | 'barber';
type BarberType = 'independent' | 'shop-owner';

const SignUpPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedRole = searchParams.get('role') || '';

  const [step, setStep] = useState(preselectedRole === 'barber' ? 2 : preselectedRole === 'customer' ? 3 : 1);
  const [role, setRole] = useState<Role>(preselectedRole === 'barber' ? 'barber' : 'customer');
  const [barberType, setBarberType] = useState<BarberType | ''>('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState(countryCodes[0]);
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleRoleSelect = (selectedRole: Role) => {
    setRole(selectedRole);
    if (selectedRole === 'barber') {
      setStep(2);
    } else {
      setStep(3);
    }
  };

  const handleBarberTypeSelect = (type: BarberType) => {
    setBarberType(type);
    setStep(3);
  };

  const handleSubmit = () => {
    if (!name.trim()) { toast.error('Enter your name'); return; }
    if (!email.trim()) { toast.error('Enter your email'); return; }
    if (!phone || phone.length < 7) { toast.error('Enter a valid phone number'); return; }
    if (!password || password.length < 6) { toast.error('Password must be at least 6 characters'); return; }

    toast.success('Account created! Please verify your phone.');
    navigate('/verify', { state: { phone: `${countryCode.code} ${phone}`, role, barberType } });
  };

  const handleGuest = () => {
    toast.success('Continuing as guest');
    navigate('/home');
  };

  const handleBack = () => {
    if (step === 3 && role === 'barber') setStep(2);
    else if (step === 3 && role === 'customer') setStep(1);
    else if (step === 2) setStep(1);
    else navigate(-1);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-5 pt-14 pb-4">
        <button onClick={handleBack} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
      </div>

      <div className="flex-1 px-8 pb-8">
        <AnimatePresence mode="wait">
          {/* Step 1: Role Selection */}
          {step === 1 && (
            <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-1">Join BookMyBarber</h1>
                <p className="text-sm text-muted-foreground">How would you like to use the app?</p>
              </div>

              <button
                onClick={() => handleRoleSelect('customer')}
                className="w-full glass-card p-6 flex items-center gap-4 active:scale-[0.98] transition-transform"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <User size={28} className="text-primary" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold text-foreground">Customer</h3>
                  <p className="text-sm text-muted-foreground">Find barbers, book appointments</p>
                </div>
              </button>

              <button
                onClick={() => handleRoleSelect('barber')}
                className="w-full glass-card p-6 flex items-center gap-4 active:scale-[0.98] transition-transform"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Scissors size={28} className="text-primary" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold text-foreground">Barber</h3>
                  <p className="text-sm text-muted-foreground">Offer services, manage bookings</p>
                </div>
              </button>

              <button onClick={handleGuest} className="w-full h-12 rounded-2xl font-medium text-muted-foreground text-base hover:text-foreground transition-colors">
                Continue as Guest
              </button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <button onClick={() => navigate('/signin')} className="text-primary font-medium">Sign In</button>
              </p>
            </motion.div>
          )}

          {/* Step 2: Barber Type Selection */}
          {step === 2 && (
            <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-1">How do you want to join?</h1>
                <p className="text-sm text-muted-foreground">Choose your business type</p>
              </div>

              <button
                onClick={() => handleBarberTypeSelect('independent')}
                className="w-full glass-card p-6 flex items-center gap-4 active:scale-[0.98] transition-transform"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Scissors size={28} className="text-primary" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold text-foreground">Independent Barber</h3>
                  <p className="text-sm text-muted-foreground">Create your own profile, manage your own schedule and services</p>
                </div>
              </button>

              <button
                onClick={() => handleBarberTypeSelect('shop-owner')}
                className="w-full glass-card p-6 flex items-center gap-4 active:scale-[0.98] transition-transform"
              >
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <Store size={28} className="text-primary" />
                </div>
                <div className="text-left flex-1">
                  <h3 className="text-lg font-semibold text-foreground">Shop Owner</h3>
                  <p className="text-sm text-muted-foreground">Create a shop, add multiple barbers, manage your business</p>
                </div>
              </button>
            </motion.div>
          )}

          {/* Step 3: Registration Form */}
          {step === 3 && (
            <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-foreground mb-1">Create Account</h1>
                <p className="text-sm text-muted-foreground">
                  {role === 'customer' ? 'Join as a Customer' : barberType === 'independent' ? 'Join as Independent Barber' : 'Join as Shop Owner'}
                </p>
              </div>

              <div className="space-y-4">
                <input type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}
                  className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <div className="relative">
                  <button onClick={() => setShowCountryPicker(!showCountryPicker)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-sm text-muted-foreground z-10 px-1 py-1 rounded-lg hover:bg-muted/30 transition-colors">
                    <span>{countryCode.flag}</span>
                    <span className="text-xs">{countryCode.code}</span>
                    <ChevronDown size={12} />
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

                <button onClick={handleSubmit}
                  className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform">
                  Create Account
                </button>

                <button onClick={handleGuest}
                  className="w-full h-12 rounded-2xl font-medium text-muted-foreground text-base hover:text-foreground transition-colors">
                  Continue as Guest
                </button>

                <p className="text-center text-sm text-muted-foreground">
                  Already have an account?{' '}
                  <button onClick={() => navigate('/signin')} className="text-primary font-medium">Sign In</button>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignUpPage;
