import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, Smartphone, CreditCard, Banknote, Wallet, CalendarPlus, Share2, Phone, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useCreateAppointment, useCreatePayment } from '@/hooks/useData';

const paymentMethods = [
  { id: 'shop', label: 'Pay in Shop', icon: Banknote, desc: 'Pay cash at the shop' },
  { id: 'upi', label: 'UPI', icon: Smartphone, desc: 'Google Pay, PhonePe, etc.' },
  { id: 'paytm', label: 'Paytm', icon: Wallet, desc: 'Paytm wallet or UPI' },
  { id: 'card', label: 'Card', icon: CreditCard, desc: 'Credit / Debit card' },
];

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as any;
  const { user } = useAuth();
  const createAppointment = useCreateAppointment();
  const createPayment = useCreatePayment();
  const [selected, setSelected] = useState('shop');
  const [processing, setProcessing] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handlePayment = async () => {
    if (!user) {
      toast.error('Please sign in to book an appointment');
      navigate('/signin');
      return;
    }
    if (!state?.barberId || !state?.service?.id || !state?.dateISO || !state?.time) {
      toast.error('Missing booking details');
      return;
    }

    setProcessing(true);
    try {
      const appointment = await createAppointment.mutateAsync({
        customer_id: user.id,
        barber_id: state.barberId,
        service_id: state.service.id,
        appointment_date: state.dateISO,
        appointment_time: state.time,
      });

      await createPayment.mutateAsync({
        appointment_id: appointment.id,
        amount: state.service.price,
        payment_method: selected,
      });

      setConfirmed(true);
      toast.success('Booking confirmed!');
    } catch (err: any) {
      toast.error(err.message || 'Booking failed');
    } finally {
      setProcessing(false);
    }
  };

  const handleAddToCalendar = () => {
    if (!state) return;
    const title = encodeURIComponent(`${state.service?.name} at ${state.barber?.shopName}`);
    const details = encodeURIComponent(`Barber: ${state.barber?.name}\nService: ${state.service?.name}`);
    window.open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}`, '_blank');
  };

  const handleShare = () => {
    if (!state) return;
    const text = `I booked a ${state.service?.name} appointment at ${state.barber?.shopName} on ${state.date} at ${state.time}!`;
    if (navigator.share) { navigator.share({ title: 'My Booking', text }); }
    else { navigator.clipboard.writeText(text); toast.success('Copied to clipboard!'); }
  };

  const handleCall = () => { if (state?.barber?.phone) window.open(`tel:${state.barber.phone}`); };

  if (confirmed) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-5">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 200 }}
          className="w-24 h-24 rounded-full gold-gradient flex items-center justify-center mb-6"><Check size={48} className="text-primary-foreground" /></motion.div>
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="text-2xl font-bold text-foreground mb-2">Booking Confirmed!</motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-muted-foreground text-center mb-4">Your appointment has been booked successfully.</motion.p>
        
        {/* Booking details card */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }} className="w-full glass-card p-5 mb-5 space-y-3">
          <div className="flex items-center gap-3">
            {state?.barber?.photo ? (
              <img src={state.barber.photo} alt={state.barber.name} className="w-12 h-12 rounded-2xl object-cover" />
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-xl font-bold text-primary">{state?.barber?.name?.charAt(0)}</div>
            )}
            <div>
              <p className="font-semibold text-foreground">{state?.barber?.name}</p>
              <p className="text-xs text-muted-foreground">{state?.barber?.shopName}</p>
            </div>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Service</span><span className="text-foreground font-medium">{state?.service?.name}</span></div>
          <div className="flex justify-between text-sm"><span className="text-muted-foreground">Date & Time</span><span className="text-foreground font-medium">{state?.date} • {state?.time}</span></div>
          {state?.barber?.address && (
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Address</span><span className="text-foreground font-medium text-right max-w-[60%]">{state.barber.address}</span></div>
          )}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="flex gap-4 mb-6">
          <button onClick={handleAddToCalendar} className="flex flex-col items-center gap-1.5">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center"><CalendarPlus size={22} className="text-primary" /></div>
            <span className="text-xs text-muted-foreground">Calendar</span>
          </button>
          <button onClick={handleShare} className="flex flex-col items-center gap-1.5">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center"><Share2 size={22} className="text-primary" /></div>
            <span className="text-xs text-muted-foreground">Share</span>
          </button>
          <button onClick={handleCall} className="flex flex-col items-center gap-1.5">
            <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center"><Phone size={22} className="text-primary" /></div>
            <span className="text-xs text-muted-foreground">Call</span>
          </button>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="w-full space-y-3">
          <button onClick={() => navigate('/appointments')} className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg">View My Appointments</button>
          <button onClick={() => navigate('/home')} className="w-full h-14 bg-secondary rounded-2xl font-semibold text-foreground text-lg">Back to Home</button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"><ArrowLeft size={20} className="text-foreground" /></button>
        <h1 className="text-xl font-bold text-foreground">Payment</h1>
      </div>

      {state && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="px-5 mb-6">
          <div className="glass-card p-4">
            <div className="flex justify-between items-center">
              <div><p className="font-medium text-foreground">{state.service?.name}</p><p className="text-sm text-muted-foreground">{state.date} • {state.time}</p></div>
              <span className="text-xl font-bold gold-text">₹{state.service?.price}</span>
            </div>
          </div>
        </motion.div>
      )}

      <div className="px-5">
        <h2 className="text-lg font-semibold text-foreground mb-3">Payment Method</h2>
        <div className="space-y-2">
          {paymentMethods.map((method, i) => (
            <motion.button key={method.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              onClick={() => setSelected(method.id)}
              className={`w-full glass-card p-4 flex items-center gap-4 text-left transition-all ${selected === method.id ? 'ring-2 ring-primary' : ''}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${selected === method.id ? 'gold-gradient' : 'bg-secondary'}`}>
                <method.icon size={22} className={selected === method.id ? 'text-primary-foreground' : 'text-muted-foreground'} />
              </div>
              <div className="flex-1"><p className="font-medium text-foreground">{method.label}</p><p className="text-xs text-muted-foreground">{method.desc}</p></div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selected === method.id ? 'border-primary' : 'border-muted-foreground/30'}`}>
                {selected === method.id && <div className="w-2.5 h-2.5 rounded-full gold-gradient" />}
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="px-5 mt-8">
        <button onClick={handlePayment} disabled={processing}
          className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform disabled:opacity-60">
          {processing ? <span className="flex items-center justify-center gap-2"><Loader2 size={20} className="animate-spin" /> Processing...</span> : `Pay ₹${state?.service?.price || 0}`}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
