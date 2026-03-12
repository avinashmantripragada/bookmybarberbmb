import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Camera, Plus, Trash2, Clock, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface ServiceEntry { name: string; price: string; duration: string; }

const BarberOnboardingPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const totalSteps = 5;

  const [barberName, setBarberName] = useState('');
  const [bio, setBio] = useState('');
  const [experience, setExperience] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');

  const [services, setServices] = useState<ServiceEntry[]>([{ name: '', price: '', duration: '30' }]);

  const [workingHours, setWorkingHours] = useState(
    days.map(day => ({ day, enabled: day !== 'Sunday', open: '09:00', close: '19:00' }))
  );

  const [portfolioCount, setPortfolioCount] = useState(0);

  const toggleDay = (index: number) => {
    const updated = [...workingHours];
    updated[index].enabled = !updated[index].enabled;
    setWorkingHours(updated);
  };

  const addService = () => setServices([...services, { name: '', price: '', duration: '30' }]);
  const removeService = (i: number) => setServices(services.filter((_, idx) => idx !== i));
  const updateService = (i: number, field: keyof ServiceEntry, value: string) => {
    const updated = [...services];
    updated[i][field] = value;
    setServices(updated);
  };

  const handleNext = async () => {
    if (step === 1 && !barberName.trim()) { toast.error('Enter your name'); return; }
    if (step === totalSteps) {
      if (!user) { toast.error('Please sign in first'); navigate('/signin'); return; }

      setSaving(true);
      try {
        // Create barber profile
        const { data: barber, error: barberError } = await supabase
          .from('barbers')
          .insert({
            user_id: user.id,
            name: barberName,
            bio,
            experience_years: experience ? parseInt(experience) : 0,
            phone: phoneNumber,
            address,
            city,
            state,
            pincode,
          })
          .select()
          .single();

        if (barberError) throw barberError;

        // Create services
        const validServices = services.filter(s => s.name.trim() && s.price);
        if (validServices.length > 0) {
          const { error: svcError } = await supabase.from('services').insert(
            validServices.map(s => ({
              barber_id: barber.id,
              service_name: s.name,
              price: parseInt(s.price),
              duration: parseInt(s.duration) || 30,
            }))
          );
          if (svcError) throw svcError;
        }

        toast.success('Profile created! Welcome to BookMyBarber.');
        navigate('/dashboard');
      } catch (err: any) {
        toast.error(err.message || 'Failed to create profile');
      } finally {
        setSaving(false);
      }
      return;
    }
    setStep(step + 1);
  };

  const stepTitles = ['Your Profile', 'Location', 'Services', 'Working Hours', 'Portfolio'];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Independent Barber Setup</h1>
            <p className="text-xs text-muted-foreground">Step {step} of {totalSteps} — {stepTitles[step - 1]}</p>
          </div>
        </div>
        <div className="flex gap-1.5">
          {Array.from({ length: totalSteps }, (_, i) => (
            <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i < step ? 'gold-gradient' : 'bg-secondary'}`} />
          ))}
        </div>
      </div>

      <div className="flex-1 px-5 pb-32 overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <div className="flex justify-center mb-2">
                <button className="w-24 h-24 rounded-3xl bg-secondary border-2 border-dashed border-border flex flex-col items-center justify-center gap-1">
                  <Camera size={24} className="text-muted-foreground" /><span className="text-[10px] text-muted-foreground">Add Photo</span>
                </button>
              </div>
              <input placeholder="Your Name *" value={barberName} onChange={e => setBarberName(e.target.value)}
                className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <textarea placeholder="Bio — tell customers about yourself" value={bio} onChange={e => setBio(e.target.value)}
                className="w-full h-24 px-5 py-4 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              <input placeholder="Years of Experience" value={experience} onChange={e => setExperience(e.target.value.replace(/\D/g, ''))}
                className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <div className="relative">
                <span className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">+91</span>
                <input type="tel" placeholder="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full h-14 pl-14 pr-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <input placeholder="Full Address" value={address} onChange={e => setAddress(e.target.value)} className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input placeholder="City" value={city} onChange={e => setCity(e.target.value)} className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input placeholder="State" value={state} onChange={e => setState(e.target.value)} className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input placeholder="Pin Code" value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))} className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <div className="glass-card p-4 h-40 rounded-2xl flex items-center justify-center"><p className="text-sm text-muted-foreground">📍 Map location picker will appear here</p></div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              {services.map((svc, i) => (
                <div key={i} className="glass-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Service {i + 1}</span>
                    {services.length > 1 && <button onClick={() => removeService(i)} className="text-destructive"><Trash2 size={16} /></button>}
                  </div>
                  <input placeholder="Service Name" value={svc.name} onChange={e => updateService(i, 'name', e.target.value)} className="w-full h-12 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                      <input placeholder="Price" value={svc.price} onChange={e => updateService(i, 'price', e.target.value.replace(/\D/g, ''))} className="w-full h-12 pl-8 pr-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                    </div>
                    <div className="relative flex-1">
                      <Clock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input placeholder="Min" value={svc.duration} onChange={e => updateService(i, 'duration', e.target.value.replace(/\D/g, ''))} className="w-full h-12 pl-10 pr-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={addService} className="w-full h-12 border-2 border-dashed border-border rounded-2xl text-sm text-muted-foreground flex items-center justify-center gap-2"><Plus size={16} /> Add Service</button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
              {workingHours.map((wh, i) => (
                <div key={wh.day} className="glass-card p-4 flex items-center gap-3">
                  <button onClick={() => toggleDay(i)} className={`w-10 h-6 rounded-full relative transition-all ${wh.enabled ? 'gold-gradient' : 'bg-secondary'}`}>
                    <div className={`w-4 h-4 rounded-full bg-background absolute top-1 transition-all ${wh.enabled ? 'right-1' : 'left-1'}`} />
                  </button>
                  <span className={`text-sm font-medium w-24 ${wh.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>{wh.day}</span>
                  {wh.enabled && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <input type="time" value={wh.open} onChange={e => { const u = [...workingHours]; u[i].open = e.target.value; setWorkingHours(u); }} className="bg-secondary rounded-lg px-2 py-1.5 text-foreground" />
                      <span>to</span>
                      <input type="time" value={wh.close} onChange={e => { const u = [...workingHours]; u[i].close = e.target.value; setWorkingHours(u); }} className="bg-secondary rounded-lg px-2 py-1.5 text-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {step === 5 && (
            <motion.div key="s5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <p className="text-sm text-muted-foreground">Upload photos of your best work to attract customers.</p>
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: portfolioCount }, (_, i) => (
                  <div key={i} className="aspect-square rounded-2xl bg-secondary flex items-center justify-center overflow-hidden"><div className="w-full h-full gold-gradient opacity-20" /></div>
                ))}
                <button onClick={() => { setPortfolioCount(portfolioCount + 1); toast.success('Photo added!'); }}
                  className="aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1">
                  <Camera size={24} className="text-muted-foreground" /><span className="text-xs text-muted-foreground">Add</span>
                </button>
              </div>
              <p className="text-xs text-muted-foreground text-center">You can add more photos later from your dashboard.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-lg mx-auto">
          <button onClick={handleNext} disabled={saving}
            className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform disabled:opacity-60 flex items-center justify-center gap-2">
            {saving ? <><Loader2 size={20} className="animate-spin" /> Saving...</> : step === totalSteps ? 'Complete Setup' : 'Continue'}
            {step < totalSteps && !saving && <ArrowRight size={18} />}
          </button>
          {step < totalSteps && <button onClick={() => setStep(step + 1)} className="w-full py-3 text-sm text-muted-foreground mt-1">Skip for now</button>}
        </div>
      </div>
    </div>
  );
};

export default BarberOnboardingPage;
