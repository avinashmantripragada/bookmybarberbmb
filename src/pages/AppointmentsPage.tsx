import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, Check, X, Loader2, ChevronRight, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAppointments } from '@/hooks/useData';
import EmptyState from '@/components/EmptyState';

const AppointmentsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: appointments = [], isLoading } = useAppointments(user?.id);
  const [tab, setTab] = useState<'upcoming' | 'past'>('upcoming');

  const upcoming = appointments.filter((a: any) => a.status === 'upcoming');
  const past = appointments.filter((a: any) => a.status === 'completed' || a.status === 'cancelled');

  const activeList = tab === 'upcoming' ? upcoming : past;

  const statusBadge = (status: string) => {
    const map: Record<string, { label: string; cls: string }> = {
      upcoming: { label: 'Booked', cls: 'bg-primary/15 text-primary' },
      confirmed: { label: 'Confirmed', cls: 'bg-green-500/15 text-green-400' },
      completed: { label: 'Completed', cls: 'bg-green-500/15 text-green-400' },
      cancelled: { label: 'Cancelled', cls: 'bg-destructive/15 text-destructive' },
    };
    const s = map[status] || map.upcoming;
    return <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full ${s.cls}`}>{s.label}</span>;
  };

  // Skeleton loader
  const SkeletonCard = () => (
    <div className="glass-card p-4 animate-pulse">
      <div className="flex items-start gap-3">
        <div className="w-12 h-12 rounded-2xl bg-secondary shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-secondary rounded w-2/3" />
          <div className="h-3 bg-secondary rounded w-1/2" />
          <div className="h-3 bg-secondary rounded w-1/3" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14 pb-2">
        <h1 className="text-2xl font-bold text-foreground">My Appointments</h1>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-4 mt-2">
        <div className="flex bg-secondary rounded-2xl p-1">
          {(['upcoming', 'past'] as const).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${tab === t ? 'gold-gradient text-primary-foreground' : 'text-muted-foreground'}`}>
              {t === 'upcoming' ? `Upcoming (${upcoming.length})` : `Past (${past.length})`}
            </button>
          ))}
        </div>
      </div>

      <div className="px-5 space-y-3">
        {isLoading ? (
          <>
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </>
        ) : activeList.length > 0 ? (
          <AnimatePresence mode="wait">
            <motion.div key={tab} initial={{ opacity: 0, x: tab === 'upcoming' ? -10 : 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }} className="space-y-3">
              {activeList.map((apt: any, i: number) => (
                <motion.div key={apt.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
                  onClick={() => navigate('/appointment-details', { state: { appointment: apt } })}
                  className="glass-card p-4 cursor-pointer active:scale-[0.98] transition-transform">
                  <div className="flex items-start gap-3">
                    {apt.barber.photo ? (
                      <img src={apt.barber.photo} alt={apt.barber.name} className="w-12 h-12 rounded-2xl object-cover shrink-0" />
                    ) : (
                      <div className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center text-lg font-bold text-primary shrink-0">
                        {apt.barber.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-foreground truncate">{apt.barber.name}</h3>
                        {statusBadge(apt.status)}
                      </div>
                      <p className="text-sm text-muted-foreground">{apt.service.name}</p>
                      <div className="flex items-center justify-between mt-2">
                        <p className="text-xs text-muted-foreground">{apt.date} • {apt.time}</p>
                        <span className="font-bold gold-text">₹{apt.totalPrice}</span>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted-foreground mt-1 shrink-0" />
                  </div>

                  {/* Past appointment actions */}
                  {tab === 'past' && apt.status === 'completed' && (
                    <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
                      <button onClick={(e) => { e.stopPropagation(); navigate('/review', { state: { barberId: apt.barberId || apt.barber.id } }); }}
                        className="flex-1 h-9 bg-secondary rounded-xl text-xs font-medium text-foreground">
                        Leave Review
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); navigate(`/booking/${apt.barber.id}?service=${apt.service.id}`); }}
                        className="flex-1 h-9 gold-gradient rounded-xl text-xs font-semibold text-primary-foreground">
                        Rebook
                      </button>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        ) : (
          <EmptyState
            type={tab === 'upcoming' ? 'no-bookings' : 'no-bookings'}
            onAction={() => navigate('/home')}
          />
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
