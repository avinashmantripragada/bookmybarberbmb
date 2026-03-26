import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, Users, BarChart3, Loader2, ToggleLeft, ToggleRight, Clock, Star } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardHeader from '@/components/DashboardHeader';
import AddBarberModal from '@/components/AddBarberModal';

type ShopTab = 'services' | 'barbers' | 'insights';

interface ServiceItem { id: string; service_name: string; price: number; duration: number; barber_id: string; }
interface BarberItem { id: string; name: string; profile_image: string | null; experience_years: number; phone: string | null; rating: number; }

const DashboardShop = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<ShopTab>('services');
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [barbers, setBarbers] = useState<BarberItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [insightPeriod, setInsightPeriod] = useState<'today' | 'weekly' | 'monthly'>('today');
  const [insights, setInsights] = useState({ bookings: 0, completed: 0, cancelled: 0, revenue: 0, clients: 0, rating: 0 });
  const [showAddBarber, setShowAddBarber] = useState(false);
  const [shopId, setShopId] = useState<string | null>(null);

  // Edit service modal state
  const [editingSvc, setEditingSvc] = useState<ServiceItem | null>(null);
  const [svcName, setSvcName] = useState('');
  const [svcPrice, setSvcPrice] = useState('');
  const [svcDuration, setSvcDuration] = useState('30');
  const [showAddService, setShowAddService] = useState(false);

  useEffect(() => {
    if (!user) {
      setServices([]);
      setBarbers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchData();
  }, [user]);

  const getBarberIds = async () => {
    const { data: myBarber } = await supabase.from('barbers').select('id').eq('user_id', user!.id);
    const { data: shops } = await supabase.from('shops').select('id').eq('owner_id', user!.id);
    if (shops?.length) setShopId(shops[0].id);
    const ids = (myBarber || []).map(b => b.id);
    if (shops?.length) {
      const { data: shopBarbers } = await supabase.from('barbers').select('id, name, profile_image, experience_years, phone, rating').in('shop_id', shops.map(s => s.id));
      (shopBarbers || []).forEach(sb => {
        if (!ids.includes(sb.id)) ids.push(sb.id);
      });
      setBarbers((shopBarbers || []).map(b => ({ ...b, rating: Number(b.rating) || 0, experience_years: b.experience_years || 0 })));
    }
    // Include own barber profile
    if (myBarber?.length) {
      const { data: own } = await supabase.from('barbers').select('id, name, profile_image, experience_years, phone, rating').in('id', myBarber.map(b => b.id));
      if (own) {
        const existing = barbers.map(b => b.id);
        own.forEach(o => {
          if (!existing.includes(o.id)) {
            setBarbers(prev => [...prev, { ...o, rating: Number(o.rating) || 0, experience_years: o.experience_years || 0 }]);
          }
        });
      }
    }
    return ids;
  };

  const fetchData = async () => {
    try {
      const ids = await getBarberIds();
      if (!ids.length) { setLoading(false); return; }

      const { data: svcData } = await supabase.from('services').select('*').in('barber_id', ids);
      setServices((svcData || []) as ServiceItem[]);

      // Fetch insights
      await fetchInsights(ids, insightPeriod);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchInsights = async (barberIds: string[], period: string) => {
    let dateFilter = new Date().toISOString().split('T')[0];
    if (period === 'weekly') {
      const d = new Date();
      d.setDate(d.getDate() - 7);
      dateFilter = d.toISOString().split('T')[0];
    } else if (period === 'monthly') {
      const d = new Date();
      d.setMonth(d.getMonth() - 1);
      dateFilter = d.toISOString().split('T')[0];
    }

    const query = supabase.from('appointments').select('*, services(price)').in('barber_id', barberIds);
    const { data } = period === 'today'
      ? await query.eq('appointment_date', dateFilter)
      : await query.gte('appointment_date', dateFilter);

    const apts = data || [];
    const completed = apts.filter(a => a.status === 'completed');
    const revenue = completed.reduce((sum, a) => sum + Number((a as any).services?.price || 0), 0);
    const uniqueClients = new Set(apts.map(a => a.customer_id)).size;

    setInsights({
      bookings: apts.length,
      completed: completed.length,
      cancelled: apts.filter(a => a.status === 'cancelled').length,
      revenue,
      clients: uniqueClients,
      rating: 0,
    });
  };

  const handleDeleteService = async (id: string) => {
    await supabase.from('services').delete().eq('id', id);
    setServices(services.filter(s => s.id !== id));
    toast.success('Service deleted');
  };

  const handleSaveService = async () => {
    if (!svcName.trim() || !svcPrice) { toast.error('Fill all fields'); return; }
    const ids = await getBarberIds();
    if (!ids.length) { toast.error('No barber profile found'); return; }

    if (editingSvc) {
      await supabase.from('services').update({
        service_name: svcName,
        price: Number(svcPrice),
        duration: Number(svcDuration) || 30,
      }).eq('id', editingSvc.id);
      toast.success('Service updated');
    } else {
      await supabase.from('services').insert({
        barber_id: ids[0],
        service_name: svcName,
        price: Number(svcPrice),
        duration: Number(svcDuration) || 30,
      });
      toast.success('Service added');
    }
    setEditingSvc(null);
    setShowAddService(false);
    setSvcName('');
    setSvcPrice('');
    setSvcDuration('30');
    fetchData();
  };

  const openEditService = (svc: ServiceItem) => {
    setEditingSvc(svc);
    setSvcName(svc.service_name);
    setSvcPrice(String(svc.price));
    setSvcDuration(String(svc.duration));
    setShowAddService(true);
  };

  const tabs: { key: ShopTab; label: string }[] = [
    { key: 'services', label: 'Services' },
    { key: 'barbers', label: 'Barbers' },
    { key: 'insights', label: 'Insights' },
  ];

  const insightCards = [
    { label: 'Bookings', value: insights.bookings },
    { label: 'Completed', value: insights.completed },
    { label: 'Cancelled', value: insights.cancelled },
    { label: 'Revenue', value: `₹${insights.revenue.toLocaleString()}` },
    { label: 'Clients', value: insights.clients },
    { label: 'Avg Rating', value: insights.rating || '—' },
  ];

  return (
    <DashboardLayout>
      <DashboardHeader />

      <div className="px-5 space-y-4">
        {/* Tab Toggle */}
        <div className="flex bg-secondary rounded-2xl p-1">
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all ${
                tab === t.key ? 'gold-gradient text-primary-foreground' : 'text-muted-foreground'
              }`}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={24} className="animate-spin text-primary" /></div>
        ) : (
          <>
            {/* Services */}
            {tab === 'services' && (
              <div className="space-y-2">
                {services.map((svc, i) => (
                  <motion.div key={svc.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="glass-card p-4 flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground text-sm">{svc.service_name}</p>
                      <p className="text-xs text-muted-foreground">₹{svc.price} • {svc.duration} min</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => openEditService(svc)} className="p-2 rounded-lg bg-secondary text-muted-foreground">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => handleDeleteService(svc.id)} className="p-2 rounded-lg bg-destructive/10 text-destructive">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </motion.div>
                ))}
                <button onClick={() => { setEditingSvc(null); setSvcName(''); setSvcPrice(''); setSvcDuration('30'); setShowAddService(true); }}
                  className="w-full h-12 border-2 border-dashed border-border rounded-2xl text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Plus size={16} /> Add Service
                </button>
              </div>
            )}

            {/* Barbers */}
            {tab === 'barbers' && (
              <div className="space-y-2">
                {barbers.map((b, i) => (
                  <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="glass-card p-4 flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
                      {b.profile_image ? <img src={b.profile_image} className="w-full h-full rounded-xl object-cover" /> : b.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.experience_years}y exp • ⭐ {b.rating}</p>
                    </div>
                  </motion.div>
                ))}
                {barbers.length === 0 && (
                  <div className="glass-card p-8 text-center">
                    <Users size={32} className="text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-sm text-muted-foreground">No barbers yet</p>
                  </div>
                )}
                <button onClick={() => setShowAddBarber(true)}
                  className="w-full h-12 border-2 border-dashed border-border rounded-2xl text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Plus size={16} /> Add Barber
                </button>
                {shopId && <AddBarberModal open={showAddBarber} shopId={shopId} onClose={() => setShowAddBarber(false)} onSaved={fetchData} />}
              </div>
            )}

            {/* Insights */}
            {tab === 'insights' && (
              <div className="space-y-4">
                <div className="flex bg-secondary rounded-2xl p-1">
                  {(['today', 'weekly', 'monthly'] as const).map(p => (
                    <button key={p} onClick={async () => {
                      setInsightPeriod(p);
                      const ids = await getBarberIds();
                      fetchInsights(ids, p);
                    }}
                      className={`flex-1 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                        insightPeriod === p ? 'gold-gradient text-primary-foreground' : 'text-muted-foreground'
                      }`}>
                      {p}
                    </button>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {insightCards.map((c, i) => (
                    <motion.div key={c.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.05 }}
                      onClick={() => {
                        if (c.label === 'Bookings' || c.label === 'Completed' || c.label === 'Cancelled') navigate('/dashboard/bookings');
                        else if (c.label === 'Clients') navigate('/dashboard/clients');
                      }}
                      className="glass-card p-4 text-center cursor-pointer active:scale-[0.97] transition-transform">
                      <p className="text-xs text-muted-foreground mb-1">{c.label}</p>
                      <p className="text-xl font-bold text-foreground">{c.value}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Service Modal */}
      {showAddService && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm px-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="glass-card p-6 w-full max-w-sm space-y-4">
            <h3 className="text-lg font-semibold text-foreground">{editingSvc ? 'Edit Service' : 'Add Service'}</h3>
            <input placeholder="Service Name" value={svcName} onChange={e => setSvcName(e.target.value)}
              className="w-full h-12 px-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
            <div className="flex gap-3">
              <div className="relative flex-1">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">₹</span>
                <input placeholder="Price" value={svcPrice} onChange={e => setSvcPrice(e.target.value.replace(/\D/g, ''))}
                  className="w-full h-12 pl-8 pr-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
              </div>
              <div className="relative flex-1">
                <Clock size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input placeholder="Min" value={svcDuration} onChange={e => setSvcDuration(e.target.value.replace(/\D/g, ''))}
                  className="w-full h-12 pl-10 pr-4 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setShowAddService(false)}
                className="flex-1 h-12 bg-secondary rounded-xl text-sm font-medium text-muted-foreground">Cancel</button>
              <button onClick={handleSaveService}
                className="flex-1 h-12 gold-gradient rounded-xl text-sm font-semibold text-primary-foreground">Save</button>
            </div>
          </motion.div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardShop;
