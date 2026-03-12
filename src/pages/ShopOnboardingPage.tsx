import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Camera, Plus, Trash2, Clock, User } from 'lucide-react';
import { toast } from 'sonner';

const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

interface BarberEntry { name: string; phone: string; experience: string; }
interface ServiceEntry { name: string; price: string; duration: string; }

const ShopOnboardingPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const totalSteps = 4;

  // Step 1: Shop Details
  const [shopName, setShopName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [hours, setHours] = useState(
    days.map(day => ({ day, enabled: day !== 'Sunday', open: '09:00', close: '19:00' }))
  );

  // Step 2: Barbers
  const [barbers, setBarbers] = useState<BarberEntry[]>([{ name: '', phone: '', experience: '' }]);

  // Step 3: Services
  const [services, setServices] = useState<ServiceEntry[]>([{ name: '', price: '', duration: '30' }]);

  // Step 4: Gallery
  const [galleryCount, setGalleryCount] = useState(0);

  const toggleDay = (i: number) => {
    const u = [...hours]; u[i].enabled = !u[i].enabled; setHours(u);
  };

  const handleNext = () => {
    if (step === 1 && !shopName.trim()) { toast.error('Enter shop name'); return; }
    if (step === totalSteps) {
      toast.success('Shop created! Welcome to BookMyBarber.');
      navigate('/shop-dashboard');
      return;
    }
    setStep(step + 1);
  };

  const stepTitles = ['Shop Details', 'Add Barbers', 'Add Services', 'Shop Gallery'];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-5 pt-14 pb-4">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => step > 1 ? setStep(step - 1) : navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Create Your Shop</h1>
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
              <input placeholder="Shop Name *" value={shopName} onChange={e => setShopName(e.target.value)}
                className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <textarea placeholder="Description" value={description} onChange={e => setDescription(e.target.value)}
                className="w-full h-24 px-5 py-4 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none" />
              <input placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <input placeholder="Full Address" value={address} onChange={e => setAddress(e.target.value)}
                className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              <div className="flex gap-3">
                <input placeholder="City" value={city} onChange={e => setCity(e.target.value)}
                  className="flex-1 h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <input placeholder="State" value={state} onChange={e => setState(e.target.value)}
                  className="flex-1 h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <input placeholder="Pin Code" value={pincode} onChange={e => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />

              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pt-2">Opening Hours</h3>
              {hours.map((wh, i) => (
                <div key={wh.day} className="glass-card p-4 flex items-center gap-3">
                  <button onClick={() => toggleDay(i)}
                    className={`w-10 h-6 rounded-full relative transition-all ${wh.enabled ? 'gold-gradient' : 'bg-secondary'}`}>
                    <div className={`w-4 h-4 rounded-full bg-background absolute top-1 transition-all ${wh.enabled ? 'right-1' : 'left-1'}`} />
                  </button>
                  <span className={`text-sm font-medium w-24 ${wh.enabled ? 'text-foreground' : 'text-muted-foreground'}`}>{wh.day}</span>
                  {wh.enabled && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <input type="time" value={wh.open} onChange={e => { const u = [...hours]; u[i].open = e.target.value; setHours(u); }}
                        className="bg-secondary rounded-lg px-2 py-1.5 text-foreground" />
                      <span>to</span>
                      <input type="time" value={wh.close} onChange={e => { const u = [...hours]; u[i].close = e.target.value; setHours(u); }}
                        className="bg-secondary rounded-lg px-2 py-1.5 text-foreground" />
                    </div>
                  )}
                </div>
              ))}
            </motion.div>
          )}

          {step === 2 && (
            <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <p className="text-sm text-muted-foreground">Add barbers who work at your shop.</p>
              {barbers.map((b, i) => (
                <div key={i} className="glass-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User size={18} className="text-primary" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">Barber {i + 1}</span>
                    </div>
                    {barbers.length > 1 && (
                      <button onClick={() => setBarbers(barbers.filter((_, idx) => idx !== i))} className="text-destructive"><Trash2 size={16} /></button>
                    )}
                  </div>
                  <input placeholder="Barber Name" value={b.name} onChange={e => { const u = [...barbers]; u[i].name = e.target.value; setBarbers(u); }}
                    className="w-full h-12 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                  <div className="flex gap-3">
                    <input placeholder="Phone" value={b.phone} onChange={e => { const u = [...barbers]; u[i].phone = e.target.value.replace(/\D/g, '').slice(0, 10); setBarbers(u); }}
                      className="flex-1 h-12 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                    <input placeholder="Exp (yrs)" value={b.experience} onChange={e => { const u = [...barbers]; u[i].experience = e.target.value.replace(/\D/g, ''); setBarbers(u); }}
                      className="w-24 h-12 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                  </div>
                </div>
              ))}
              <button onClick={() => setBarbers([...barbers, { name: '', phone: '', experience: '' }])}
                className="w-full h-12 border-2 border-dashed border-border rounded-2xl text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Plus size={16} /> Add Another Barber
              </button>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <p className="text-sm text-muted-foreground">Add the services your shop offers.</p>
              {services.map((svc, i) => (
                <div key={i} className="glass-card p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Service {i + 1}</span>
                    {services.length > 1 && (
                      <button onClick={() => setServices(services.filter((_, idx) => idx !== i))} className="text-destructive"><Trash2 size={16} /></button>
                    )}
                  </div>
                  <input placeholder="Service Name" value={svc.name} onChange={e => { const u = [...services]; u[i].name = e.target.value; setServices(u); }}
                    className="w-full h-12 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                      <input placeholder="Price" value={svc.price} onChange={e => { const u = [...services]; u[i].price = e.target.value.replace(/\D/g, ''); setServices(u); }}
                        className="w-full h-12 pl-8 pr-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                    </div>
                    <div className="relative flex-1">
                      <Clock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                      <input placeholder="Min" value={svc.duration} onChange={e => { const u = [...services]; u[i].duration = e.target.value.replace(/\D/g, ''); setServices(u); }}
                        className="w-full h-12 pl-10 pr-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
                    </div>
                  </div>
                </div>
              ))}
              <button onClick={() => setServices([...services, { name: '', price: '', duration: '30' }])}
                className="w-full h-12 border-2 border-dashed border-border rounded-2xl text-sm text-muted-foreground flex items-center justify-center gap-2">
                <Plus size={16} /> Add Service
              </button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div key="s4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              <p className="text-sm text-muted-foreground">Upload photos of your shop to attract customers.</p>
              <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: galleryCount }, (_, i) => (
                  <div key={i} className="aspect-square rounded-2xl bg-secondary flex items-center justify-center overflow-hidden">
                    <div className="w-full h-full gold-gradient opacity-20" />
                  </div>
                ))}
                <button onClick={() => { setGalleryCount(galleryCount + 1); toast.success('Photo added!'); }}
                  className="aspect-square rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-1">
                  <Camera size={24} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">Add</span>
                </button>
              </div>
              <p className="text-xs text-muted-foreground text-center">You can add more photos later from your dashboard.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-background via-background to-transparent">
        <div className="max-w-lg mx-auto">
          <button onClick={handleNext}
            className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform flex items-center justify-center gap-2">
            {step === totalSteps ? 'Create Shop' : 'Continue'}
            {step < totalSteps && <ArrowRight size={18} />}
          </button>
          {step < totalSteps && (
            <button onClick={() => setStep(step + 1)} className="w-full py-3 text-sm text-muted-foreground mt-1">Skip for now</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopOnboardingPage;
