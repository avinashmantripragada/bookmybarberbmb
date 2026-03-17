import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Loader2, Mail, Phone, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

type ResetMethod = 'email' | 'phone' | null;

const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState<ResetMethod>(null);
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (method === 'email') {
      if (!email.trim()) { toast.error('Enter your email'); return; }
      setSubmitting(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      setSubmitting(false);
      if (error) { toast.error(error.message || 'Failed to send reset email'); return; }
      setSent(true);
      toast.success('Reset link sent to your email!');
    } else if (method === 'phone') {
      if (!phone.trim() || phone.length < 7) { toast.error('Enter a valid phone number'); return; }
      toast.info('Phone reset is not yet available. Please use email reset.');
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <div className="px-5 pt-14 pb-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <ArrowLeft size={20} className="text-foreground" />
          </button>
        </div>
        <div className="flex-1 px-8 pb-8 flex flex-col justify-center">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <CheckCircle size={48} className="text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Check Your Email</h1>
            <p className="text-sm text-muted-foreground mb-6">
              We sent a password reset link to <span className="text-foreground font-medium">{email}</span>
            </p>
            <button onClick={() => navigate('/signin')} className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform">
              Back to Sign In
            </button>
            <button onClick={() => setSent(false)} className="mt-3 text-sm text-muted-foreground">
              Didn't receive it? Try again
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-5 pt-14 pb-4">
        <button onClick={() => method ? setMethod(null) : navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
      </div>

      <div className="flex-1 px-8 pb-8 flex flex-col justify-center">
        {!method ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            <div className="text-center mb-4">
              <h1 className="text-2xl font-bold text-foreground mb-2">Forgot Password</h1>
              <p className="text-sm text-muted-foreground">How would you like to reset your password?</p>
            </div>
            <button onClick={() => setMethod('email')} className="w-full glass-card p-5 flex items-center gap-4 active:scale-[0.98] transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Mail size={22} className="text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Reset via Email</p>
                <p className="text-xs text-muted-foreground">We'll send a reset link to your email</p>
              </div>
            </button>
            <button onClick={() => setMethod('phone')} className="w-full glass-card p-5 flex items-center gap-4 active:scale-[0.98] transition-transform">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Phone size={22} className="text-primary" />
              </div>
              <div className="text-left">
                <p className="font-semibold text-foreground">Reset via Phone</p>
                <p className="text-xs text-muted-foreground">We'll send an OTP to your phone number</p>
              </div>
            </button>
          </motion.div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
            <div className="text-center mb-4">
              <div className="w-16 h-16 rounded-2xl gold-gradient flex items-center justify-center mx-auto mb-4">
                {method === 'email' ? <Mail size={28} className="text-primary-foreground" /> : <Phone size={28} className="text-primary-foreground" />}
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-2">
                {method === 'email' ? 'Enter Your Email' : 'Enter Your Phone'}
              </h1>
              <p className="text-sm text-muted-foreground">
                {method === 'email' ? "We'll send a reset link to your email" : "We'll send an OTP to verify"}
              </p>
            </div>

            {method === 'email' ? (
              <input type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            ) : (
              <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            )}

            <button onClick={handleSubmit} disabled={submitting}
              className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform disabled:opacity-60 flex items-center justify-center gap-2">
              {submitting ? <><Loader2 size={20} className="animate-spin" /> Sending...</> : method === 'email' ? 'Send Reset Link' : 'Send OTP'}
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
