import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CreditCard, Smartphone, Wallet, Plus, Trash2, History, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface PaymentMethod {
  id: string;
  type: 'upi' | 'card';
  label: string;
  detail: string;
}

const PaymentMethodsPage = () => {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'methods' | 'history'>('methods');
  const [methods, setMethods] = useState<PaymentMethod[]>([
    { id: '1', type: 'upi', label: 'Google Pay', detail: 'user@okaxis' },
    { id: '2', type: 'upi', label: 'PhonePe', detail: 'user@ybl' },
  ]);
  const [showAdd, setShowAdd] = useState(false);
  const [addType, setAddType] = useState<'upi' | 'card'>('upi');
  const [addLabel, setAddLabel] = useState('');
  const [addDetail, setAddDetail] = useState('');

  // Mock payment history
  const history = [
    { id: '1', service: 'Haircut', amount: 300, date: 'Mar 15, 2026', status: 'completed' },
    { id: '2', service: 'Beard Trim', amount: 150, date: 'Mar 10, 2026', status: 'completed' },
    { id: '3', service: 'Hair + Beard', amount: 450, date: 'Feb 28, 2026', status: 'refunded' },
  ];

  const handleAdd = () => {
    if (!addLabel || !addDetail) { toast.error('Fill in all fields'); return; }
    setMethods(prev => [...prev, { id: Date.now().toString(), type: addType, label: addLabel, detail: addDetail }]);
    setShowAdd(false);
    setAddLabel('');
    setAddDetail('');
    toast.success('Payment method added');
  };

  const handleRemove = (id: string) => {
    setMethods(prev => prev.filter(m => m.id !== id));
    toast.success('Payment method removed');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">Payments</h1>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-4">
        <div className="flex bg-secondary rounded-2xl p-1">
          {(['methods', 'history'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${tab === t ? 'gold-gradient text-primary-foreground' : 'text-muted-foreground'}`}>
              {t === 'methods' ? 'Payment Methods' : 'History'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5">
        {tab === 'methods' ? (
          <div className="space-y-2">
            {methods.map((m, i) => (
              <motion.div key={m.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                  {m.type === 'upi' ? <Smartphone size={18} className="text-primary" /> : <CreditCard size={18} className="text-primary" />}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{m.label}</p>
                  <p className="text-xs text-muted-foreground">{m.detail}</p>
                </div>
                <button onClick={() => handleRemove(m.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                  <Trash2 size={16} />
                </button>
              </motion.div>
            ))}

            <button onClick={() => setShowAdd(true)}
              className="w-full glass-card p-4 flex items-center gap-4 border border-dashed border-border">
              <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                <Plus size={18} className="text-primary" />
              </div>
              <span className="font-medium text-muted-foreground text-sm">Add Payment Method</span>
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map((h, i) => (
              <motion.div key={h.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground text-sm">{h.service}</p>
                  <p className="text-xs text-muted-foreground">{h.date}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold gold-text">₹{h.amount}</p>
                  <span className={`text-[10px] font-semibold capitalize ${h.status === 'completed' ? 'text-green-400' : 'text-primary'}`}>
                    {h.status}
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add Modal */}
      <AnimatePresence>
        {showAdd && (
          <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm">
            <motion.div initial={{ y: 300 }} animate={{ y: 0 }} exit={{ y: 300 }}
              className="w-full max-w-lg bg-card border-t border-border rounded-t-3xl p-6">
              <h3 className="text-lg font-bold text-foreground mb-4">Add Payment Method</h3>

              <div className="flex gap-2 mb-4">
                <button onClick={() => setAddType('upi')}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${addType === 'upi' ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                  UPI
                </button>
                <button onClick={() => setAddType('card')}
                  className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${addType === 'card' ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                  Card
                </button>
              </div>

              <input value={addLabel} onChange={e => setAddLabel(e.target.value)}
                placeholder={addType === 'upi' ? 'UPI App Name (e.g. Google Pay)' : 'Card Name (e.g. HDFC Visa)'}
                className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-primary/30" />

              <input value={addDetail} onChange={e => setAddDetail(e.target.value)}
                placeholder={addType === 'upi' ? 'UPI ID (e.g. user@okaxis)' : 'Last 4 digits'}
                className="w-full h-14 px-5 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm mb-5 focus:outline-none focus:ring-2 focus:ring-primary/30" />

              <button onClick={handleAdd} className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-sm mb-3">
                Add Method
              </button>
              <button onClick={() => setShowAdd(false)} className="w-full h-12 bg-secondary rounded-2xl text-sm text-muted-foreground font-medium">
                Cancel
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PaymentMethodsPage;
