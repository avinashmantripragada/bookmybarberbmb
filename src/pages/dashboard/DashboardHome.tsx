import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, CheckCircle, Clock, Plus, ChevronRight, Phone, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import DashboardLayout from '@/components/DashboardLayout';
import DashboardHeader from '@/components/DashboardHeader';
import WalkInBookingModal from '@/components/WalkInBookingModal';

interface BookingItem {
  id: string;
  time: string;
  customerName: string;
  service: string;
  barberName: string;
  status: string;
}

const DashboardHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bookings, setBookings] = useState<BookingItem[]>([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, upcoming: 0 });
  const [loading, setLoading] = useState(true);
  const [showWalkIn, setShowWalkIn] = useState(false);

  useEffect(() => {
    if (!user) {
      setBookings([]);
      setStats({ total: 0, completed: 0, upcoming: 0 });
      setLoading(false);
      return;
    }

    setLoading(true);
    fetchTodayData();
  }, [user]);

  const fetchTodayData = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];

      // Get barber id(s) for this user
      const { data: barberData } = await supabase
        .from('barbers')
        .select('id, name, shop_id')
        .eq('user_id', user!.id);

      if (!barberData?.length) {
        setLoading(false);
        return;
      }

      const barberIds = barberData.map(b => b.id);

      // Also get barbers from owned shops
      const { data: shops } = await supabase
        .from('shops')
        .select('id')
        .eq('owner_id', user!.id);

      if (shops?.length) {
        const { data: shopBarbers } = await supabase
          .from('barbers')
          .select('id, name')
          .in('shop_id', shops.map(s => s.id));
        if (shopBarbers) {
          shopBarbers.forEach(sb => {
            if (!barberIds.includes(sb.id)) barberIds.push(sb.id);
          });
        }
      }

      const { data: appointments } = await supabase
        .from('appointments')
        .select('*, services(service_name), barbers(name)')
        .in('barber_id', barberIds)
        .eq('appointment_date', today)
        .order('appointment_time');

      const { data: customerProfiles } = appointments?.length
        ? await supabase.from('profiles').select('user_id, name').in('user_id', appointments.map(a => a.customer_id))
        : { data: [] };

      const profileMap: Record<string, string> = {};
      (customerProfiles || []).forEach(p => { profileMap[p.user_id] = p.name; });

      const mapped = (appointments || []).map(a => ({
        id: a.id,
        time: a.appointment_time,
        customerName: profileMap[a.customer_id] || 'Customer',
        service: (a as any).services?.service_name || 'Service',
        barberName: (a as any).barbers?.name || 'Barber',
        status: a.status,
      }));

      setBookings(mapped);
      setStats({
        total: mapped.length,
        completed: mapped.filter(b => b.status === 'completed').length,
        upcoming: mapped.filter(b => b.status === 'pending' || b.status === 'confirmed').length,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (id: string) => {
    await supabase.from('appointments').update({ status: 'completed' as any }).eq('id', id);
    fetchTodayData();
  };

  const statCards = [
    { label: 'Total', value: stats.total, icon: Calendar, color: 'text-primary' },
    { label: 'Completed', value: stats.completed, icon: CheckCircle, color: 'text-green-400' },
    { label: 'Upcoming', value: stats.upcoming, icon: Clock, color: 'text-blue-400' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-400 bg-green-400/10';
      case 'confirmed': return 'text-blue-400 bg-blue-400/10';
      case 'pending': return 'text-primary bg-primary/10';
      case 'cancelled': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-secondary';
    }
  };

  return (
    <DashboardLayout>
      <DashboardHeader />

      <div className="px-5 space-y-5">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {statCards.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }}
              className="glass-card p-4 text-center">
              <s.icon size={18} className={`${s.color} mx-auto mb-1.5`} />
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
              <p className="text-[10px] text-muted-foreground">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <button onClick={() => setShowWalkIn(true)}
          className="w-full h-12 border-2 border-dashed border-border rounded-2xl text-sm text-muted-foreground flex items-center justify-center gap-2 active:scale-[0.98] transition-transform">
          <Plus size={16} className="text-primary" /> Add Walk-in Booking
        </button>

        <WalkInBookingModal open={showWalkIn} onClose={() => setShowWalkIn(false)} onSaved={fetchTodayData} />

        {/* Today's Bookings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-foreground">Today's Bookings</h2>
            <button onClick={() => navigate('/dashboard/bookings')} className="text-xs text-primary font-medium flex items-center gap-0.5">
              View All <ChevronRight size={14} />
            </button>
          </div>

          {loading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="glass-card p-4 animate-pulse h-20 rounded-2xl" />
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <Calendar size={32} className="text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">No bookings today</p>
              <p className="text-xs text-muted-foreground/60 mt-1">Your appointments will appear here</p>
            </div>
          ) : (
            <div className="space-y-2">
              {bookings.map((b, i) => (
                <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                  onClick={() => navigate(`/appointment-details?id=${b.id}`)}
                  className="glass-card p-4 cursor-pointer active:scale-[0.98] transition-transform">
                  <div className="flex items-center gap-4">
                    <div className="text-center min-w-[50px]">
                      <p className="text-sm font-semibold text-foreground">{b.time}</p>
                    </div>
                    <div className="w-px h-10 bg-border" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{b.customerName}</p>
                      <p className="text-xs text-muted-foreground truncate">{b.service} • {b.barberName}</p>
                    </div>
                    <span className={`text-[10px] font-semibold px-2 py-1 rounded-full capitalize ${getStatusColor(b.status)}`}>
                      {b.status}
                    </span>
                  </div>
                  {(b.status === 'pending' || b.status === 'confirmed') && (
                    <div className="flex gap-2 mt-3">
                      <button onClick={() => handleMarkComplete(b.id)}
                        className="flex-1 h-9 bg-green-400/10 rounded-xl text-xs font-medium text-green-400 flex items-center justify-center gap-1">
                        <CheckCircle size={14} /> Complete
                      </button>
                      <button onClick={() => navigate(`/appointment-details?id=${b.id}`)}
                        className="flex-1 h-9 bg-secondary rounded-xl text-xs font-medium text-muted-foreground flex items-center justify-center gap-1">
                        <Eye size={14} /> Details
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default DashboardHome;
