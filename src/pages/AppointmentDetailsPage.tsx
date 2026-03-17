import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MapPin, Phone, Navigation, Calendar, Clock, CheckCircle2, Circle, X, MessageSquare, Share2, RotateCcw, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';

const statusSteps = ['Booked', 'Confirmed', 'In Progress', 'Completed'];

const cancelReasons = [
  'Changed plans',
  'Found another barber',
  'Too expensive',
  'Other',
];

const AppointmentDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const apt = (location.state as any)?.appointment;
  const qc = useQueryClient();
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  if (!apt) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">No appointment data found.</p>
      </div>
    );
  }

  const currentStep = apt.status === 'completed' ? 3 : apt.status === 'cancelled' ? -1 : apt.status === 'upcoming' ? 0 : 1;

  const handleCancel = async () => {
    if (!cancelReason) { toast.error('Please select a reason'); return; }
    setCancelling(true);
    const { error } = await supabase.from('appointments').update({ status: 'cancelled' as any }).eq('id', apt.id);
    setCancelling(false);
    if (error) { toast.error('Failed to cancel'); return; }
    toast.success('Appointment cancelled');
    qc.invalidateQueries({ queryKey: ['appointments'] });
    navigate('/appointments');
  };

  const handleReschedule = () => {
    navigate(`/booking/${apt.barber.id}?service=${apt.service.id}`);
  };

  const handleDirections = () => {
    const q = encodeURIComponent(apt.barber.address || apt.barber.location || apt.barber.name);
    window.open(`https://www.google.com/maps/search/?api=1&query=${q}`, '_blank');
  };

  const handleCall = () => {
    if (apt.barber.phone) window.open(`tel:${apt.barber.phone}`);
  };

  const handleShare = () => {
    const text = `My appointment: ${apt.service.name} with ${apt.barber.name} on ${apt.date} at ${apt.time}`;
    if (navigator.share) {
      navigator.share({ title: 'My Appointment', text });
    } else {
      navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-36">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Appointment Details</h1>
      </div>

      {/* Barber Info */}
      <div className="px-5 mb-5">
        <div className="glass-card p-5">
          <div className="flex items-center gap-4">
            {apt.barber.photo ? (
              <img src={apt.barber.photo} alt={apt.barber.name} className="w-16 h-16 rounded-2xl object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-2xl font-bold text-primary">
                {apt.barber.name.charAt(0)}
              </div>
            )}
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">{apt.barber.name}</h2>
              <p className="text-sm text-muted-foreground">{apt.barber.shopName || 'Independent Barber'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Tracker */}
      {apt.status !== 'cancelled' && (
        <div className="px-5 mb-5">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Appointment Status</h3>
            <div className="flex items-center justify-between relative">
              {/* Progress line */}
              <div className="absolute top-3 left-3 right-3 h-0.5 bg-border" />
              <div className="absolute top-3 left-3 h-0.5 gold-gradient transition-all duration-500"
                style={{ width: `${Math.max(0, (currentStep / (statusSteps.length - 1)) * 100)}%` }} />

              {statusSteps.map((step, i) => (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    i <= currentStep ? 'gold-gradient' : 'bg-secondary border-2 border-border'
                  }`}>
                    {i <= currentStep ? (
                      <CheckCircle2 size={14} className="text-primary-foreground" />
                    ) : (
                      <Circle size={8} className="text-muted-foreground" />
                    )}
                  </div>
                  <span className={`text-[10px] mt-2 text-center ${i <= currentStep ? 'text-primary font-medium' : 'text-muted-foreground'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cancelled badge */}
      {apt.status === 'cancelled' && (
        <div className="px-5 mb-5">
          <div className="glass-card p-4 border-destructive/30">
            <div className="flex items-center gap-2 text-destructive">
              <X size={18} />
              <span className="font-semibold">This appointment was cancelled</span>
            </div>
          </div>
        </div>
      )}

      {/* Details */}
      <div className="px-5 mb-5">
        <div className="glass-card p-5 space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service</span>
            <span className="text-foreground font-medium">{apt.service.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date</span>
            <span className="text-foreground font-medium flex items-center gap-1.5">
              <Calendar size={13} className="text-primary" />{apt.date}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Time</span>
            <span className="text-foreground font-medium flex items-center gap-1.5">
              <Clock size={13} className="text-primary" />{apt.time}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Duration</span>
            <span className="text-foreground font-medium">{apt.service.duration} min</span>
          </div>
          {apt.barber.address && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Address</span>
              <span className="text-foreground font-medium text-right max-w-[60%]">{apt.barber.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Summary */}
      <div className="px-5 mb-5">
        <div className="glass-card p-5">
          <h3 className="text-sm font-semibold text-foreground mb-3">Payment Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Service Amount</span>
              <span className="text-foreground">₹{apt.totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tip</span>
              <span className="text-foreground">₹0</span>
            </div>
            <div className="h-px bg-border" />
            <div className="flex justify-between">
              <span className="font-semibold text-foreground">Total</span>
              <span className="font-bold gold-text text-lg">₹{apt.totalPrice}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Payment</span>
              <span className="text-foreground capitalize">{apt.paymentMethod}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-5">
        <div className="flex gap-3">
          <button onClick={handleCall} className="flex-1 glass-card p-3 flex flex-col items-center gap-1.5 active:scale-[0.97] transition-transform">
            <Phone size={18} className="text-primary" />
            <span className="text-xs text-muted-foreground">Call</span>
          </button>
          <button onClick={handleDirections} className="flex-1 glass-card p-3 flex flex-col items-center gap-1.5 active:scale-[0.97] transition-transform">
            <Navigation size={18} className="text-primary" />
            <span className="text-xs text-muted-foreground">Directions</span>
          </button>
          <button onClick={() => navigate('/chat', { state: { barber: apt.barber } })} className="flex-1 glass-card p-3 flex flex-col items-center gap-1.5 active:scale-[0.97] transition-transform">
            <MessageSquare size={18} className="text-primary" />
            <span className="text-xs text-muted-foreground">Chat</span>
          </button>
          <button onClick={handleShare} className="flex-1 glass-card p-3 flex flex-col items-center gap-1.5 active:scale-[0.97] transition-transform">
            <Share2 size={18} className="text-primary" />
            <span className="text-xs text-muted-foreground">Share</span>
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      {apt.status === 'upcoming' && (
        <div className="px-5 space-y-3">
          <button onClick={handleReschedule}
            className="w-full h-14 rounded-2xl font-semibold text-foreground text-sm flex items-center justify-center gap-2.5 active:scale-[0.97] transition-all border border-primary/40 bg-primary/5 hover:bg-primary/10">
            <RotateCcw size={16} className="text-primary" /> Reschedule Appointment
          </button>
          <button onClick={() => setShowCancel(true)}
            className="w-full h-14 rounded-2xl font-semibold text-destructive text-sm flex items-center justify-center gap-2.5 active:scale-[0.97] transition-all border border-destructive/30 bg-destructive/5 hover:bg-destructive/10 shadow-[0_0_20px_-6px] shadow-destructive/20">
            <X size={16} /> Cancel Appointment
          </button>
        </div>
      )}

      {apt.status === 'completed' && (
        <div className="px-5 space-y-3">
          <button onClick={() => navigate('/review', { state: { barberId: apt.barberId || apt.barber.id } })}
            className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-sm active:scale-[0.97] transition-transform">
            Leave a Review
          </button>
          <button onClick={() => navigate(`/booking/${apt.barber.id}?service=${apt.service.id}`)}
            className="w-full h-14 rounded-2xl font-semibold text-foreground text-sm flex items-center justify-center gap-2.5 active:scale-[0.97] transition-all border border-primary/40 bg-primary/5 hover:bg-primary/10">
            <RotateCcw size={16} className="text-primary" /> Rebook This Service
          </button>
        </div>
      )}

      {/* Cancel Modal */}
      <AnimatePresence>
        {showCancel && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }}
              className="w-full max-w-lg bg-card border-t border-border rounded-t-3xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-1">Cancel Appointment?</h3>
              <p className="text-sm text-muted-foreground mb-4">Please tell us why you're cancelling.</p>
              <div className="space-y-2 mb-5">
                {cancelReasons.map(r => (
                  <button key={r} onClick={() => setCancelReason(r)}
                    className={`w-full p-4 rounded-xl text-left text-sm font-medium transition-all ${
                      cancelReason === r ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-foreground'
                    }`}>
                    {r}
                  </button>
                ))}
              </div>
              <button onClick={handleCancel} disabled={cancelling}
                className="w-full h-13 bg-destructive rounded-2xl font-semibold text-destructive-foreground text-sm mb-3 flex items-center justify-center gap-2 disabled:opacity-60">
                {cancelling ? <Loader2 size={16} className="animate-spin" /> : null} Confirm Cancellation
              </button>
              <button onClick={() => setShowCancel(false)} className="w-full h-12 bg-secondary rounded-2xl text-sm text-muted-foreground font-medium">
                Keep Appointment
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AppointmentDetailsPage;
