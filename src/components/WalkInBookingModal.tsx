import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface BarberOption { id: string; name: string; }
interface ServiceOption { id: string; service_name: string; price: number; duration: number; barber_id: string; }

interface Props {
  open: boolean;
  onClose: () => void;
  onSaved: () => void;
}

const WalkInBookingModal = ({ open, onClose, onSaved }: Props) => {
  const { user } = useAuth();
  const [barbers, setBarbers] = useState<BarberOption[]>([]);
  const [services, setServices] = useState<ServiceOption[]>([]);
  const [saving, setSaving] = useState(false);

  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [selectedBarber, setSelectedBarber] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (!open || !user) return;
    loadOptions();
  }, [open, user]);

  const loadOptions = async () => {
    const { data: myBarbers } = await supabase.from('barbers').select('id, name').eq('user_id', user!.id);
    const { data: shops } = await supabase.from('shops').select('id').eq('owner_id', user!.id);
    const allBarbers = [...(myBarbers || [])];
    if (shops?.length) {
      const { data: shopBarbers } = await supabase.from('barbers').select('id, name').in('shop_id', shops.map(s => s.id));
      (shopBarbers || []).forEach(sb => {
        if (!allBarbers.find(b => b.id === sb.id)) allBarbers.push(sb);
      });
    }
    setBarbers(allBarbers);
    if (allBarbers.length) {
      setSelectedBarber(allBarbers[0].id);
      const { data: svcData } = await supabase.from('services').select('*').in('barber_id', allBarbers.map(b => b.id));
      setServices((svcData || []) as ServiceOption[]);
    }
  };

  const filteredServices = services.filter(s => !selectedBarber || s.barber_id === selectedBarber);

  const handleSave = async () => {
    if (!customerName.trim()) { toast.error('Customer name is required'); return; }
    if (!selectedBarber) { toast.error('Select a barber'); return; }
    if (!selectedService) { toast.error('Select a service'); return; }
    if (!time) { toast.error('Select a time'); return; }

    setSaving(true);
    try {
      const { error } = await supabase.from('appointments').insert({
        customer_id: user!.id,
        barber_id: selectedBarber,
        service_id: selectedService,
        appointment_date: date,
        appointment_time: time,
        status: 'confirmed' as any,
      });
      if (error) throw error;
      toast.success(`Walk-in booking saved for ${customerName}`);
      resetForm();
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  };

  const resetForm = () => {
    setCustomerName('');
    setCustomerPhone('');
    setSelectedBarber(barbers[0]?.id || '');
    setSelectedService('');
    setDate(new Date().toISOString().split('T')[0]);
    setTime('');
    setNotes('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-4">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 w-full max-w-sm max-h-[85vh] overflow-y-auto space-y-3">
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-semibold text-foreground">Walk-in Booking</h3>
          <button onClick={onClose} className="p-1"><X size={20} className="text-muted-foreground" /></button>
        </div>

        <input placeholder="Customer Name *" value={customerName} onChange={e => setCustomerName(e.target.value)}
          className="w-full h-12 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />

        <input placeholder="Phone (optional)" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)}
          className="w-full h-12 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />

        <select value={selectedBarber} onChange={e => { setSelectedBarber(e.target.value); setSelectedService(''); }}
          className="w-full h-12 px-4 rounded-xl bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm">
          <option value="">Select Barber</option>
          {barbers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
        </select>

        <select value={selectedService} onChange={e => setSelectedService(e.target.value)}
          className="w-full h-12 px-4 rounded-xl bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm">
          <option value="">Select Service</option>
          {filteredServices.map(s => <option key={s.id} value={s.id}>{s.service_name} — ₹{s.price}</option>)}
        </select>

        <div className="flex gap-3">
          <input type="date" value={date} onChange={e => setDate(e.target.value)}
            className="flex-1 h-12 px-4 rounded-xl bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
          <input type="time" value={time} onChange={e => setTime(e.target.value)}
            className="flex-1 h-12 px-4 rounded-xl bg-secondary text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
        </div>

        <textarea placeholder="Notes (optional)" value={notes} onChange={e => setNotes(e.target.value)} rows={2}
          className="w-full px-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm resize-none" />

        <div className="flex gap-2 pt-1">
          <button onClick={onClose} className="flex-1 h-12 bg-secondary rounded-xl text-sm font-medium text-muted-foreground">Cancel</button>
          <button onClick={handleSave} disabled={saving}
            className="flex-1 h-12 gold-gradient rounded-xl text-sm font-semibold text-primary-foreground flex items-center justify-center gap-2 disabled:opacity-60">
            {saving && <Loader2 size={16} className="animate-spin" />} Save
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default WalkInBookingModal;
