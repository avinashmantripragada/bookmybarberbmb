import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Loader2, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    // Check for recovery token in URL hash
    const hash = window.location.hash;
    if (hash.includes('type=recovery')) {
      setIsRecovery(true);
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecovery(true);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!password || password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    setSubmitting(true);
    const { error } = await supabase.auth.updateUser({ password });
    setSubmitting(false);

    if (error) {
      toast.error(error.message || 'Failed to update password');
      return;
    }

    setSuccess(true);
    toast.success('Password updated successfully!');
  };

  if (!isRecovery && !success) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-8">
        <p className="text-muted-foreground text-center">Invalid or expired reset link. Please request a new one.</p>
        <button onClick={() => navigate('/forgot-password')} className="mt-4 text-primary font-medium">
          Go to Forgot Password
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-5 pt-14 pb-4">
        <button onClick={() => navigate('/signin')} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
      </div>

      <div className="flex-1 px-8 pb-8 flex flex-col justify-center">
        {success ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
            <CheckCircle size={48} className="text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground mb-2">Password Updated!</h1>
            <p className="text-sm text-muted-foreground mb-6">Your password has been successfully reset.</p>
            <button onClick={() => navigate('/signin')}
              className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg">
              Sign In
            </button>
          </motion.div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
              <h1 className="text-2xl font-bold text-foreground mb-2">Set New Password</h1>
              <p className="text-sm text-muted-foreground">Enter your new password below</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="space-y-4">
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} placeholder="New Password"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full h-14 px-5 pr-14 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <button onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <input type={showPassword ? 'text' : 'password'} placeholder="Confirm New Password"
                value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />

              <button onClick={handleSubmit} disabled={submitting}
                className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform disabled:opacity-60 flex items-center justify-center gap-2">
                {submitting ? <><Loader2 size={20} className="animate-spin" /> Updating...</> : 'Update Password'}
              </button>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPasswordPage;
