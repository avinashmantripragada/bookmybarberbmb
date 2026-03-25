import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Phone, MessageSquare, Users, ChevronRight, Share2, QrCode, Mail, Loader2, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardHeader from '@/components/DashboardHeader';

interface Client {
  id: string;
  name: string;
  phone: string;
  totalVisits: number;
  lastVisit: string;
  tag: 'VIP' | 'Regular' | 'New';
}

const DashboardClients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<'all' | 'new' | 'regular' | 'vip'>('all');
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [showInvite, setShowInvite] = useState(false);

  useEffect(() => {
    if (!user) {
      setClients([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchClients();
  }, [user]);

  const fetchClients = async () => {
    try {
      const { data: barberData } = await supabase.from('barbers').select('id').eq('user_id', user!.id);
      const { data: shops } = await supabase.from('shops').select('id').eq('owner_id', user!.id);
      const barberIds = (barberData || []).map(b => b.id);
      if (shops?.length) {
        const { data: shopBarbers } = await supabase.from('barbers').select('id').in('shop_id', shops.map(s => s.id));
        (shopBarbers || []).forEach(sb => { if (!barberIds.includes(sb.id)) barberIds.push(sb.id); });
      }
      if (!barberIds.length) { setLoading(false); return; }

      const { data: appointments } = await supabase
        .from('appointments')
        .select('customer_id, appointment_date, status')
        .in('barber_id', barberIds)
        .eq('status', 'completed');

      // Aggregate per customer
      const custMap: Record<string, { visits: number; lastDate: string }> = {};
      (appointments || []).forEach(a => {
        if (!custMap[a.customer_id]) {
          custMap[a.customer_id] = { visits: 0, lastDate: a.appointment_date };
        }
        custMap[a.customer_id].visits += 1;
        if (a.appointment_date > custMap[a.customer_id].lastDate) {
          custMap[a.customer_id].lastDate = a.appointment_date;
        }
      });

      const custIds = Object.keys(custMap);
      if (!custIds.length) { setLoading(false); return; }

      const { data: profiles } = await supabase.from('profiles').select('user_id, name, phone').in('user_id', custIds);
      const pMap: Record<string, { name: string; phone: string }> = {};
      (profiles || []).forEach(p => { pMap[p.user_id] = { name: p.name, phone: p.phone || '' }; });

      setClients(custIds.map(id => {
        const visits = custMap[id].visits;
        return {
          id,
          name: pMap[id]?.name || 'Customer',
          phone: pMap[id]?.phone || '',
          totalVisits: visits,
          lastVisit: custMap[id].lastDate,
          tag: visits >= 10 ? 'VIP' as const : visits >= 3 ? 'Regular' as const : 'New' as const,
        };
      }).sort((a, b) => b.totalVisits - a.totalVisits));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = clients.filter(c => {
    const matchesSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search);
    const matchesFilter = filter === 'all' || c.tag.toLowerCase() === filter;
    return matchesSearch && matchesFilter;
  });

  const tagColor = (tag: string) => {
    switch (tag) {
      case 'VIP': return 'text-primary bg-primary/10';
      case 'Regular': return 'text-blue-400 bg-blue-400/10';
      default: return 'text-green-400 bg-green-400/10';
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader />

      <div className="px-5 space-y-4">
        {/* Actions */}
        <div className="flex gap-2">
          <button onClick={() => setShowInvite(true)}
            className="flex-1 h-11 gold-gradient rounded-xl text-sm font-semibold text-primary-foreground flex items-center justify-center gap-2">
            <Plus size={16} /> Add / Invite
          </button>
          <button onClick={() => toast.info('Broadcast coming soon')}
            className="flex-1 h-11 bg-secondary rounded-xl text-sm font-medium text-foreground flex items-center justify-center gap-2 border border-border/50">
            <MessageSquare size={16} className="text-primary" /> Broadcast
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input placeholder="Search clients..." value={search} onChange={e => setSearch(e.target.value)}
            className="w-full h-11 pl-10 pr-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
        </div>

        {/* Filter */}
        <div className="flex gap-2">
          {(['all', 'new', 'regular', 'vip'] as const).map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${
                filter === f ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Client List */}
        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-primary" /></div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <Users size={32} className="text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">No clients yet</p>
            <p className="text-xs text-muted-foreground/60 mt-1">Clients from completed bookings appear here</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((c, i) => (
              <motion.button key={c.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                onClick={() => setSelectedClient(c)}
                className="w-full glass-card p-4 flex items-center gap-3 text-left">
                <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                  {c.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.totalVisits} visits • Last: {new Date(c.lastVisit + 'T00:00:00').toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-1 rounded-full ${tagColor(c.tag)}`}>{c.tag}</span>
                <ChevronRight size={16} className="text-muted-foreground" />
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {/* Client Detail Modal */}
      {selectedClient && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-background/80 backdrop-blur-sm">
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 w-full max-w-lg rounded-t-3xl space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="w-12 h-1 bg-border rounded-full mx-auto" />
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary">
                {selectedClient.name.charAt(0)}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">{selectedClient.name}</h3>
                <p className="text-sm text-muted-foreground">{selectedClient.phone || 'No phone'}</p>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${tagColor(selectedClient.tag)}`}>{selectedClient.tag}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="glass-card p-3 text-center">
                <p className="text-lg font-bold text-foreground">{selectedClient.totalVisits}</p>
                <p className="text-[10px] text-muted-foreground">Total Visits</p>
              </div>
              <div className="glass-card p-3 text-center">
                <p className="text-sm font-bold text-foreground">
                  {new Date(selectedClient.lastVisit + 'T00:00:00').toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
                <p className="text-[10px] text-muted-foreground">Last Visit</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              {selectedClient.phone && (
                <button onClick={() => window.open(`tel:${selectedClient.phone}`)}
                  className="h-11 bg-secondary rounded-xl text-sm font-medium text-foreground flex items-center justify-center gap-2">
                  <Phone size={15} className="text-primary" /> Call
                </button>
              )}
              <button onClick={() => toast.info('Messaging coming soon')}
                className="h-11 bg-secondary rounded-xl text-sm font-medium text-foreground flex items-center justify-center gap-2">
                <MessageSquare size={15} className="text-primary" /> Message
              </button>
            </div>

            <button onClick={() => setSelectedClient(null)}
              className="w-full h-11 bg-secondary rounded-xl text-sm font-medium text-muted-foreground">Close</button>
          </motion.div>
        </div>
      )}

      {/* Invite Modal */}
      {showInvite && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 w-full max-w-sm space-y-3">
            <h3 className="text-lg font-semibold text-foreground mb-2">Invite Client</h3>
            {[
              { icon: MessageSquare, label: 'SMS', action: () => toast.info('SMS invite coming soon') },
              { icon: Phone, label: 'WhatsApp', action: () => toast.info('WhatsApp invite coming soon') },
              { icon: Share2, label: 'Share Link', action: () => { navigator.clipboard.writeText(window.location.origin); toast.success('Link copied!'); } },
              { icon: QrCode, label: 'QR Code', action: () => toast.info('QR code coming soon') },
            ].map(opt => (
              <button key={opt.label} onClick={() => { opt.action(); setShowInvite(false); }}
                className="w-full glass-card p-4 flex items-center gap-3 text-left">
                <opt.icon size={18} className="text-primary" />
                <span className="font-medium text-foreground text-sm">{opt.label}</span>
              </button>
            ))}
            <button onClick={() => setShowInvite(false)}
              className="w-full h-10 bg-secondary rounded-xl text-sm text-muted-foreground mt-2">Cancel</button>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardClients;
