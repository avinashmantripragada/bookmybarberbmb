import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, List, CheckCircle, X, RotateCcw, Eye, Phone, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardHeader from '@/components/DashboardHeader';

interface Booking {
  id: string;
  time: string;
  date: string;
  customerName: string;
  customerPhone: string;
  service: string;
  barberName: string;
  status: string;
  price: number;
}

const DashboardBookings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [tab, setTab] = useState<'upcoming' | 'completed' | 'cancelled'>('upcoming');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchBookings();
  }, [user]);

  const fetchBookings = async () => {
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
        .select('*, services(service_name, price), barbers(name)')
        .in('barber_id', barberIds)
        .order('appointment_date', { ascending: false });

      const custIds = [...new Set((appointments || []).map(a => a.customer_id))];
      const { data: profiles } = custIds.length
        ? await supabase.from('profiles').select('user_id, name, phone').in('user_id', custIds)
        : { data: [] };
      const pMap: Record<string, { name: string; phone: string }> = {};
      (profiles || []).forEach(p => { pMap[p.user_id] = { name: p.name, phone: p.phone || '' }; });

      setBookings((appointments || []).map(a => ({
        id: a.id,
        time: a.appointment_time,
        date: a.appointment_date,
        customerName: pMap[a.customer_id]?.name || 'Customer',
        customerPhone: pMap[a.customer_id]?.phone || '',
        service: (a as any).services?.service_name || 'Service',
        barberName: (a as any).barbers?.name || 'Barber',
        status: a.status,
        price: Number((a as any).services?.price) || 0,
      })));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id: string, action: 'completed' | 'cancelled') => {
    await supabase.from('appointments').update({ status: action as any }).eq('id', id);
    fetchBookings();
  };

  const filteredBookings = bookings.filter(b => {
    if (tab === 'upcoming') return b.status === 'pending' || b.status === 'confirmed';
    if (tab === 'completed') return b.status === 'completed';
    return b.status === 'cancelled';
  });

  const dateBookings = selectedDate
    ? filteredBookings.filter(b => b.date === selectedDate)
    : filteredBookings;

  // Calendar: get unique dates with counts
  const dateCounts: Record<string, number> = {};
  filteredBookings.forEach(b => { dateCounts[b.date] = (dateCounts[b.date] || 0) + 1; });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'confirmed': return 'text-blue-400 bg-blue-400/10';
      case 'pending': return 'text-primary bg-primary/10';
      case 'cancelled': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-secondary';
    }
  };

  const tabs = ['upcoming', 'completed', 'cancelled'] as const;

  return (
    <DashboardLayout>
      <DashboardHeader />

      <div className="px-5 space-y-4">
        {/* Tab + View Toggle */}
        <div className="flex items-center gap-3">
          <div className="flex-1 flex bg-secondary rounded-2xl p-1">
            {tabs.map(t => (
              <button key={t} onClick={() => { setTab(t); setSelectedDate(null); }}
                className={`flex-1 py-2 rounded-xl text-xs font-medium capitalize transition-all ${
                  tab === t ? 'gold-gradient text-primary-foreground' : 'text-muted-foreground'
                }`}>
                {t}
              </button>
            ))}
          </div>
          <div className="flex bg-secondary rounded-xl p-1 gap-0.5">
            <button onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-card text-primary' : 'text-muted-foreground'}`}>
              <List size={16} />
            </button>
            <button onClick={() => setViewMode('calendar')}
              className={`p-2 rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-card text-primary' : 'text-muted-foreground'}`}>
              <CalendarIcon size={16} />
            </button>
          </div>
        </div>

        {/* Calendar View */}
        {viewMode === 'calendar' && (
          <div className="space-y-2">
            {Object.entries(dateCounts).sort().map(([date, count]) => (
              <button key={date} onClick={() => setSelectedDate(selectedDate === date ? null : date)}
                className={`w-full glass-card p-4 flex items-center justify-between text-left transition-all ${
                  selectedDate === date ? 'ring-1 ring-primary' : ''
                }`}>
                <div>
                  <p className="font-medium text-foreground text-sm">
                    {new Date(date + 'T00:00:00').toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <span className="text-xs font-semibold gold-text">{count} booking{count > 1 ? 's' : ''}</span>
              </button>
            ))}
            {Object.keys(dateCounts).length === 0 && (
              <div className="glass-card p-8 text-center">
                <p className="text-sm text-muted-foreground">No {tab} bookings</p>
              </div>
            )}
          </div>
        )}

        {/* List View */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 size={24} className="animate-spin text-primary" />
          </div>
        ) : (viewMode === 'list' || selectedDate) && (
          <div className="space-y-2">
            {(viewMode === 'calendar' ? dateBookings : filteredBookings).length === 0 ? (
              <div className="glass-card p-8 text-center">
                <CalendarIcon size={32} className="text-muted-foreground/30 mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">No {tab} bookings</p>
              </div>
            ) : (
              (viewMode === 'calendar' ? dateBookings : filteredBookings).map((b, i) => (
                <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                  onClick={() => navigate(`/appointment-details?id=${b.id}`)}
                  className="glass-card p-4 cursor-pointer active:scale-[0.98] transition-transform">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{b.customerName}</p>
                      <p className="text-xs text-muted-foreground">{b.service} • {b.barberName}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(b.date + 'T00:00:00').toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} • {b.time}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="text-sm font-bold gold-text">₹{b.price}</span>
                      <span className={`block text-[10px] font-semibold px-2 py-0.5 rounded-full mt-1 capitalize ${getStatusColor(b.status)}`}>
                        {b.status}
                      </span>
                    </div>
                  </div>

                  {tab === 'upcoming' && (
                    <div className="flex gap-2 mt-2">
                      <button onClick={() => handleAction(b.id, 'completed')}
                        className="flex-1 h-9 bg-green-400/10 rounded-xl text-xs font-medium text-green-400 flex items-center justify-center gap-1">
                        <CheckCircle size={13} /> Complete
                      </button>
                      <button onClick={() => navigate(`/appointment-details?id=${b.id}`)}
                        className="flex-1 h-9 bg-secondary rounded-xl text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
                        <Eye size={13} /> Details
                      </button>
                      <button onClick={() => handleAction(b.id, 'cancelled')}
                        className="h-9 px-3 bg-destructive/10 rounded-xl text-xs font-medium text-destructive flex items-center justify-center">
                        <X size={13} />
                      </button>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default DashboardBookings;
