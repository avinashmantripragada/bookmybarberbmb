import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface Props {
  open: boolean;
  shopId: string;
  onClose: () => void;
  onSaved: () => void;
}

const AddBarberModal = ({ open, shopId, onClose, onSaved }: Props) => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [experience, setExperience] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!name.trim()) { toast.error('Barber name is required'); return; }
    setSaving(true);
    try {
      const { error } = await supabase.from('barbers').insert({
        name: name.trim(),
        phone: phone.trim() || null,
        experience_years: Number(experience) || 0,
        shop_id: shopId,
        user_id: null,
      });
      if (error) throw error;
      toast.success(`${name} added successfully`);
      setName(''); setPhone(''); setExperience('');
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.message || 'Failed to add barber');
    } finally {
      setSaving(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-6">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-6 w-full max-w-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Add Barber</h3>
          <button onClick={onClose}><X size={20} className="text-muted-foreground" /></button>
        </div>

        <input placeholder="Barber Name *" value={name} onChange={e => setName(e.target.value)}
          className="w-full h-12 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />

        <input placeholder="Phone (optional)" value={phone} onChange={e => setPhone(e.target.value)}
          className="w-full h-12 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />

        <input placeholder="Years of Experience" value={experience} onChange={e => setExperience(e.target.value.replace(/\D/g, ''))}
          className="w-full h-12 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />

        <div className="flex gap-2">
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

export default AddBarberModal;
