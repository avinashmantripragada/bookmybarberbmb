import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { normalizeRequestedRole } from '@/lib/role-routing';

const VerifyPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setRolePreference, getDefaultRoute } = useAuth();
  const state = location.state as { phone?: string; role?: string } | null;
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 6) { toast.error('Enter the full 6-digit code'); return; }
    toast.success('Phone verified!');
    const nextRole = normalizeRequestedRole(state?.role) ?? 'customer';
    setRolePreference(nextRole);
    navigate(getDefaultRoute(nextRole), { replace: true });
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-5 pt-14 pb-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
      </div>

      <div className="flex-1 px-8 pb-8 flex flex-col justify-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-2xl font-bold text-foreground mb-2">Verify Phone</h1>
          <p className="text-sm text-muted-foreground">
            We sent a 6-digit code to{' '}
            <span className="text-foreground font-medium">+91 {state?.phone || '98765 43210'}</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="space-y-6"
        >
          <div className="flex justify-center gap-3">
            {otp.map((digit, i) => (
              <input
                key={i}
                ref={(el) => { inputRefs.current[i] = el; }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-bold rounded-2xl bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
            ))}
          </div>

          <button
            onClick={handleVerify}
            className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform"
          >
            Verify
          </button>

          <p className="text-center text-sm text-muted-foreground">
            Didn't receive code?{' '}
            <button onClick={() => toast.success('Code resent!')} className="text-primary font-medium">
              Resend
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default VerifyPage;
