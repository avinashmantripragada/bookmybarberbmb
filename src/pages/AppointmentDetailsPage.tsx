import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Phone, Navigation, Calendar, Clock, CheckCircle2, Circle, X, MessageSquare, Share2, RotateCcw, Loader2, Check } from 'lucide-react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const statusSteps = ['Booked', 'Confirmed', 'In Progress', 'Completed'];
const cancelReasons = ['Changed plans', 'Found another barber', 'Too expensive', 'Other'];

interface AptData {
  id: string;
  status: string;
  date: string;
  time: string;
  customerName: string;
  customerPhone: string;
  barberName: string;
  barberPhone: string;
  barberAddress: string;
  barberId: string;
  serviceName: string;
  serviceId: string;
  serviceDuration: number;
  price: number;
  paymentStatus: string;
}

const AppointmentDetailsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { user, activeProfile } = useAuth();
  const [apt, setApt] = useState<AptData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const isOwnerOrBarber = activeProfile === 'shop_owner' || activeProfile === 'independent_barber';

  useEffect(() => {
    const stateApt = (location.state as any)?.appointment;
    const queryId = searchParams.get('id');

    if (stateApt?.id) {
      // Legacy: from location.state
      setApt({
        id: stateApt.id,
        status: stateApt.status,
        date: stateApt.date || stateApt.appointment_date,
        time: stateApt.time || stateApt.appointment_time,
        customerName: stateApt.customerName || 'Customer',
        customerPhone: stateApt.customerPhone || '',
        barberName: stateApt.barber?.name || stateApt.barberName || 'Barber',
        barberPhone: stateApt.barber?.phone || '',
        barberAddress: stateApt.barber?.address || '',
        barberId: stateApt.barber?.id || stateApt.barberId || '',
        serviceName: stateApt.service?.name || stateApt.serviceName || 'Service',
        serviceId: stateApt.service?.id || stateApt.serviceId || '',
        serviceDuration: stateApt.service?.duration || 30,
        price: stateApt.totalPrice || stateApt.price || 0,
        paymentStatus: stateApt.paymentMethod || stateApt.payment_status || 'pending',
      });
      setLoading(false);
    } else if (queryId) {
      fetchAppointment(queryId);
    } else {
      setLoading(false);
    }
  }, [location.state, searchParams]);

  const fetchAppointment = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*, services(service_name, price, duration), barbers(name, phone, address, id)')
        .eq('id', id)
        .single();

      if (error || !data) { setLoading(false); return; }

      // Get customer info
      const { data: custProfile } = await supabase.from('profiles').select('name, phone').eq('user_id', data.customer_id).single();

      setApt({
        id: data.id,
        status: data.status,
        date: data.appointment_date,
        time: data.appointment_time,
        customerName: custProfile?.name || 'Customer',
        customerPhone: custProfile?.phone || '',
        barberName: (data as any).barbers?.name || 'Barber',
        barberPhone: (data as any).barbers?.phone || '',
        barberAddress: (data as any).barbers?.address || '',
        barberId: (data as any).barbers?.id || data.barber_id,
        serviceName: (data as any).services?.service_name || 'Service',
        serviceId: data.service_id,
        serviceDuration: (data as any).services?.duration || 30,
        price: Number((data as any).services?.price) || 0,
        paymentStatus: data.payment_status,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (status: string) => {
    if (!apt) return;
    const { error } = await supabase.from('appointments').update({ status: status as any }).eq('id', apt.id);
    if (error) { toast.error('Failed to update'); return; }
    toast.success(`Booking ${status}`);
    setApt({ ...apt, status });
  };

  const handleCancel = async () => {
    if (!cancelReason) { toast.error('Please select a reason'); return; }
    setCancelling(true);
    const { error } = await supabase.from('appointments').update({ status: 'cancelled' as any }).eq('id', apt!.id);
    setCancelling(false);
    if (error) { toast.error('Failed to cancel'); return; }
    toast.success('Appointment cancelled');
    navigate(-1);
  };

  const currentStep = !apt ? 0 : apt.status === 'completed' ? 3 : apt.status === 'cancelled' ? -1 : apt.status === 'confirmed' ? 1 : 0;

  if (loading) return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <Loader2 size={28} className="animate-spin text-primary" />
    </div>
  );

  if (!apt) return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
      <p className="text-muted-foreground">No appointment data found.</p>
      <button onClick={() => navigate(-1)} className="text-primary text-sm font-medium">Go Back</button>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-36">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Appointment Details</h1>
      </div>

      {/* Info Card */}
      <div className="px-5 mb-5">
        <div className="glass-card p-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
              {isOwnerOrBarber ? apt.customerName.charAt(0) : apt.barberName.charAt(0)}
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-foreground">{isOwnerOrBarber ? apt.customerName : apt.barberName}</h2>
              <p className="text-sm text-muted-foreground">{isOwnerOrBarber ? 'Customer' : 'Barber'}</p>
            </div>
            <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${
              apt.status === 'completed' ? 'text-green-400 bg-green-400/10' :
              apt.status === 'confirmed' ? 'text-blue-400 bg-blue-400/10' :
              apt.status === 'cancelled' ? 'text-destructive bg-destructive/10' :
              'text-primary bg-primary/10'
            }`}>{apt.status}</span>
          </div>
        </div>
      </div>

      {/* Status Tracker */}
      {apt.status !== 'cancelled' && (
        <div className="px-5 mb-5">
          <div className="glass-card p-5">
            <h3 className="text-sm font-semibold text-foreground mb-4">Status</h3>
            <div className="flex items-center justify-between relative">
              <div className="absolute top-3 left-3 right-3 h-0.5 bg-border" />
              <div className="absolute top-3 left-3 h-0.5 gold-gradient transition-all duration-500"
                style={{ width: `${Math.max(0, (currentStep / (statusSteps.length - 1)) * 100)}%` }} />
              {statusSteps.map((step, i) => (
                <div key={step} className="flex flex-col items-center relative z-10">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                    i <= currentStep ? 'gold-gradient' : 'bg-secondary border-2 border-border'
                  }`}>
                    {i <= currentStep ? <CheckCircle2 size={14} className="text-primary-foreground" /> : <Circle size={8} className="text-muted-foreground" />}
                  </div>
                  <span className={`text-[10px] mt-2 text-center ${i <= currentStep ? 'text-primary font-medium' : 'text-muted-foreground'}`}>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Details */}
      <div className="px-5 mb-5">
        <div className="glass-card p-5 space-y-3">
          {isOwnerOrBarber && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Customer</span>
              <span className="text-foreground font-medium">{apt.customerName}</span>
            </div>
          )}
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Service</span>
            <span className="text-foreground font-medium">{apt.serviceName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Barber</span>
            <span className="text-foreground font-medium">{apt.barberName}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Date</span>
            <span className="text-foreground font-medium flex items-center gap-1.5">
              <Calendar size={13} className="text-primary" />
              {new Date(apt.date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Time</span>
            <span className="text-foreground font-medium flex items-center gap-1.5"><Clock size={13} className="text-primary" />{apt.time}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Duration</span>
            <span className="text-foreground font-medium">{apt.serviceDuration} min</span>
          </div>
          <div className="h-px bg-border" />
          <div className="flex justify-between">
            <span className="font-semibold text-foreground">Total</span>
            <span className="font-bold gold-text text-lg">₹{apt.price}</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-5">
        <div className="flex gap-3">
          <button onClick={() => {
            const phone = isOwnerOrBarber ? apt.customerPhone : apt.barberPhone;
            if (phone) window.open(`tel:${phone}`);
            else toast.info('No phone number available');
          }} className="flex-1 glass-card p-3 flex flex-col items-center gap-1.5 active:scale-[0.97] transition-transform">
            <Phone size={18} className="text-primary" />
            <span className="text-xs text-muted-foreground">Call</span>
          </button>
          {!isOwnerOrBarber && apt.barberAddress && (
            <button onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(apt.barberAddress)}`, '_blank')}
              className="flex-1 glass-card p-3 flex flex-col items-center gap-1.5 active:scale-[0.97] transition-transform">
              <Navigation size={18} className="text-primary" />
              <span className="text-xs text-muted-foreground">Directions</span>
            </button>
          )}
          <button onClick={() => {
            const text = `Appointment: ${apt.serviceName} with ${apt.barberName} on ${apt.date} at ${apt.time}`;
            if (navigator.share) navigator.share({ title: 'Appointment', text });
            else { navigator.clipboard.writeText(text); toast.success('Copied!'); }
          }} className="flex-1 glass-card p-3 flex flex-col items-center gap-1.5 active:scale-[0.97] transition-transform">
            <Share2 size={18} className="text-primary" />
            <span className="text-xs text-muted-foreground">Share</span>
          </button>
        </div>
      </div>

      {/* Owner/Barber Actions */}
      {isOwnerOrBarber && (apt.status === 'pending' || apt.status === 'confirmed') && (
        <div className="px-5 space-y-2 mb-5">
          {apt.status === 'pending' && (
            <button onClick={() => handleStatusUpdate('confirmed')}
              className="w-full h-13 gold-gradient rounded-2xl font-semibold text-primary-foreground text-sm flex items-center justify-center gap-2">
              <Check size={16} /> Accept Booking
            </button>
          )}
          <button onClick={() => handleStatusUpdate('completed')}
            className="w-full h-13 rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 border border-green-400/40 bg-green-400/5 text-green-400">
            <CheckCircle2 size={16} /> Mark Completed
          </button>
          <button onClick={() => setShowCancel(true)}
            className="w-full h-13 rounded-2xl font-semibold text-destructive text-sm flex items-center justify-center gap-2 border border-destructive/30 bg-destructive/5">
            <X size={16} /> Cancel / Reject
          </button>
        </div>
      )}

      {/* Customer Actions */}
      {!isOwnerOrBarber && apt.status === 'pending' && (
        <div className="px-5 space-y-3">
          <button onClick={() => setShowCancel(true)}
            className="w-full h-14 rounded-2xl font-semibold text-destructive text-sm flex items-center justify-center gap-2.5 active:scale-[0.97] transition-all border border-destructive/30 bg-destructive/5">
            <X size={16} /> Cancel Appointment
          </button>
        </div>
      )}

      {!isOwnerOrBarber && apt.status === 'completed' && (
        <div className="px-5 space-y-3">
          <button onClick={() => navigate('/review', { state: { barberId: apt.barberId } })}
            className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-sm active:scale-[0.97] transition-transform">
            Leave a Review
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
              <p className="text-sm text-muted-foreground mb-4">Please tell us why.</p>
              <div className="space-y-2 mb-5">
                {cancelReasons.map(r => (
                  <button key={r} onClick={() => setCancelReason(r)}
                    className={`w-full p-4 rounded-xl text-left text-sm font-medium transition-all ${
                      cancelReason === r ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-foreground'
                    }`}>{r}</button>
                ))}
              </div>
              <button onClick={handleCancel} disabled={cancelling}
                className="w-full h-13 bg-destructive rounded-2xl font-semibold text-destructive-foreground text-sm mb-3 flex items-center justify-center gap-2 disabled:opacity-60">
                {cancelling && <Loader2 size={16} className="animate-spin" />} Confirm Cancellation
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
