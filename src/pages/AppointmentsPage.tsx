import { motion } from 'framer-motion';
import { ArrowLeft, Clock, Check, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { mockAppointments } from '@/data/mockData';
import EmptyState from '@/components/EmptyState';

const statusConfig = {
  upcoming: { label: 'Upcoming', icon: Clock, color: 'text-primary' },
  completed: { label: 'Completed', icon: Check, color: 'text-green-400' },
  cancelled: { label: 'Cancelled', icon: X, color: 'text-destructive' },
};

const AppointmentsPage = () => {
  const navigate = useNavigate();
  const appointments = mockAppointments;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">My Appointments</h1>
      </div>

      <div className="px-5 space-y-3">
        {appointments.length > 0 ? (
          appointments.map((apt, i) => {
            const config = statusConfig[apt.status];
            const StatusIcon = config.icon;
            return (
              <motion.div
                key={apt.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="glass-card p-4"
              >
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
                      <h3 className="font-semibold text-foreground">{apt.barber.name}</h3>
                      <span className={`flex items-center gap-1 text-xs font-medium ${config.color}`}>
                        <StatusIcon size={12} />
                        {config.label}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{apt.service.name}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">{apt.date} • {apt.time}</p>
                      <span className="font-bold gold-text">₹{apt.totalPrice}</span>
                    </div>
                  </div>
                </div>
                {apt.status === 'upcoming' && (
                  <div className="flex gap-2 mt-3">
                    <button className="flex-1 h-10 bg-secondary rounded-xl text-sm font-medium text-foreground">
                      Cancel
                    </button>
                    <button className="flex-1 h-10 gold-gradient rounded-xl text-sm font-medium text-primary-foreground">
                      Reschedule
                    </button>
                  </div>
                )}
                {apt.status === 'completed' && (
                  <button
                    onClick={() => navigate('/review')}
                    className="w-full h-10 bg-secondary rounded-xl text-sm font-medium text-foreground mt-3"
                  >
                    Leave a Review
                  </button>
                )}
              </motion.div>
            );
          })
        ) : (
          <EmptyState type="no-bookings" onAction={() => navigate('/home')} />
        )}
      </div>
    </div>
  );
};

export default AppointmentsPage;
