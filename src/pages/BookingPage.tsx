import { useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Loader2 } from 'lucide-react';
import { useBarber } from '@/hooks/useData';
import { Service } from '@/types';
import ServiceIcon from '@/components/ServiceIcon';

const tipOptions = [0, 20, 50, 100];

const BookingPage = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data, isLoading } = useBarber(id);

  const preselectedServiceId = searchParams.get('service');
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDateISO, setSelectedDateISO] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [tip, setTip] = useState(0);
  const [customTip, setCustomTip] = useState('');
  const [showCustomTip, setShowCustomTip] = useState(false);
  const [step, setStep] = useState(preselectedServiceId ? 2 : 1);
  const [initialized, setInitialized] = useState(false);

  if (isLoading) return <div className="min-h-screen bg-background flex items-center justify-center"><Loader2 size={32} className="animate-spin text-primary" /></div>;
  if (!data) return null;

  const { barber } = data;

  if (!initialized && barber.services.length > 0) {
    if (preselectedServiceId) {
      const found = barber.services.find(s => s.id === preselectedServiceId);
      if (found && !selectedService) {
        setSelectedService(found);
        setStep(2);
      }
    }
    setInitialized(true);
  }

  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return {
      full: d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' }),
      iso: d.toISOString().split('T')[0],
      day: d.toLocaleDateString('en-IN', { weekday: 'short' }),
      date: d.getDate().toString(),
      isToday: i === 0,
    };
  });

  const effectiveTip = showCustomTip ? (Number(customTip) || 0) : tip;
  const totalPrice = (selectedService?.price || 0) + effectiveTip;
  const canProceed = selectedService && selectedDate && selectedTime;

  return (
    <div className="min-h-screen bg-background pb-32">
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <div>
          <h1 className="text-xl font-bold text-foreground">Book Appointment</h1>
          <p className="text-sm text-muted-foreground">{barber.name} • {barber.shopName}</p>
        </div>
      </div>

      <div className="px-5 mb-6">
        <div className="flex gap-2">
          {[1, 2, 3].map(s => <div key={s} className={`h-1 flex-1 rounded-full transition-all duration-300 ${s <= step ? 'gold-gradient' : 'bg-secondary'}`} />)}
        </div>
        <div className="flex justify-between mt-2">
          <span className={`text-xs ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>Service</span>
          <span className={`text-xs ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>Date & Time</span>
          <span className={`text-xs ${step >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>Confirm</span>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5 space-y-2">
            <h2 className="text-lg font-semibold text-foreground mb-3">Select a service</h2>
            {barber.services.map(service => (
              <button key={service.id} onClick={() => { setSelectedService(service); setStep(2); }}
                className={`w-full glass-card p-4 flex items-center justify-between text-left transition-all ${selectedService?.id === service.id ? 'ring-2 ring-primary' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center"><ServiceIcon icon={service.icon} size={18} /></div>
                  <div>
                    <p className="font-medium text-foreground">{service.name} <span className="text-xs text-muted-foreground">• {service.duration} min</span></p>
                    {service.description && <p className="text-xs text-muted-foreground">{service.description}</p>}
                  </div>
                </div>
                <span className="font-bold gold-text">₹{service.price}</span>
              </button>
            ))}
          </motion.div>
        )}

        {step === 2 && (
          <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5">
            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><Calendar size={18} className="text-primary" /> Select date</h2>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar mb-6">
              {dates.map((d) => (
                <button key={d.full} onClick={() => { setSelectedDate(d.full); setSelectedDateISO(d.iso); }}
                  className={`flex flex-col items-center min-w-[60px] py-3 px-3 rounded-2xl transition-all ${selectedDate === d.full ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                  <span className="text-xs font-medium">{d.isToday ? 'Today' : d.day}</span>
                  <span className="text-xl font-bold mt-1">{d.date}</span>
                </button>
              ))}
            </div>

            <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2"><Clock size={18} className="text-primary" /> Select time</h2>
            <div className="grid grid-cols-3 gap-2">
              {barber.availability.map((slot) => (
                <button key={slot.id} disabled={!slot.available} onClick={() => setSelectedTime(slot.time)}
                  className={`py-3 rounded-xl text-sm font-medium transition-all ${!slot.available ? 'bg-secondary/50 text-muted-foreground/40 cursor-not-allowed' : selectedTime === slot.time ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-foreground'}`}>
                  {slot.time}
                </button>
              ))}
            </div>

            {selectedDate && selectedTime && (
              <motion.button initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={() => setStep(3)}
                className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg mt-6 active:scale-[0.97] transition-transform shadow-[0_4px_20px_-4px_hsl(42,87%,55%,0.4)]">
                Continue
              </motion.button>
            )}
          </motion.div>
        )}

        {step === 3 && canProceed && (
          <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="px-5">
            <h2 className="text-lg font-semibold text-foreground mb-4">Booking Summary</h2>
            <div className="glass-card p-5 space-y-4">
              <div className="flex items-center gap-3">
                {barber.photo ? <img src={barber.photo} alt={barber.name} className="w-12 h-12 rounded-2xl object-cover" /> :
                  <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-xl font-bold text-primary">{barber.name.charAt(0)}</div>}
                <div><p className="font-semibold text-foreground">{barber.name}</p><p className="text-sm text-muted-foreground">{barber.shopName}</p></div>
              </div>
              <div className="h-px bg-border" />
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Service</span><span className="text-foreground font-medium">{selectedService.name}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Date</span><span className="text-foreground font-medium">{selectedDate}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Time</span><span className="text-foreground font-medium">{selectedTime}</span></div>
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Duration</span><span className="text-foreground font-medium">{selectedService.duration} min</span></div>
              </div>
            </div>

            {/* Tip Selection */}
            <div className="mt-5">
              <h3 className="text-sm font-semibold text-foreground mb-3">Add a Tip</h3>
              <div className="flex gap-2 mb-2">
                {tipOptions.map(t => (
                  <button key={t} onClick={() => { setTip(t); setShowCustomTip(false); }}
                    className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${!showCustomTip && tip === t ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                    {t === 0 ? 'None' : `₹${t}`}
                  </button>
                ))}
                <button onClick={() => { setShowCustomTip(true); setTip(0); }}
                  className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${showCustomTip ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                  Custom
                </button>
              </div>
              {showCustomTip && (
                <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                  <input type="number" placeholder="Enter tip amount (₹)" value={customTip} onChange={(e) => setCustomTip(e.target.value)}
                    className="w-full h-12 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
                </motion.div>
              )}
            </div>

            {/* Total */}
            <div className="glass-card p-4 mt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-muted-foreground">Service</span><span className="text-foreground">₹{selectedService.price}</span></div>
                {effectiveTip > 0 && <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tip</span><span className="text-foreground">₹{effectiveTip}</span></div>}
                <div className="h-px bg-border" />
                <div className="flex justify-between"><span className="font-semibold text-foreground">Total</span><span className="text-xl font-bold gold-text">₹{totalPrice}</span></div>
              </div>
            </div>

            <button onClick={() => navigate(`/payment/${barber.id}`, {
              state: { service: selectedService, date: selectedDate, dateISO: selectedDateISO, time: selectedTime, barber, barberId: barber.id, tip: effectiveTip }
            })} className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg mt-6 active:scale-[0.97] transition-transform">
              Proceed to Payment
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingPage;
