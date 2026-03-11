import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Users, TrendingUp, Settings, Plus, Edit2, Star, DollarSign, BarChart3, Check, X, MessageSquare, Image, CalendarClock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type DashboardTab = 'overview' | 'appointments' | 'services' | 'earnings' | 'reviews' | 'availability';

const BarberDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [appointmentFilter, setAppointmentFilter] = useState<'today' | 'upcoming' | 'history'>('today');

  const todayAppointments = [
    { time: '10:00 AM', name: 'Aditya K.', service: 'Haircut', status: 'confirmed', price: 200 },
    { time: '11:00 AM', name: 'Rohan S.', service: 'Beard Trim', status: 'confirmed', price: 100 },
    { time: '02:00 PM', name: 'Priya M.', service: 'Hair Color', status: 'pending', price: 500 },
    { time: '03:30 PM', name: 'Vikash T.', service: 'Haircut + Beard', status: 'confirmed', price: 280 },
  ];

  const stats = [
    { label: 'Today', value: '4', icon: Calendar, sub: 'bookings' },
    { label: 'This Week', value: '18', icon: TrendingUp, sub: 'bookings' },
    { label: 'Earnings', value: '₹4.2K', icon: DollarSign, sub: 'this week' },
    { label: 'Rating', value: '4.8', icon: Star, sub: '234 reviews' },
  ];

  const services = [
    { name: 'Haircut', price: 200, duration: 30, active: true },
    { name: 'Beard Trim', price: 100, duration: 15, active: true },
    { name: 'Hair + Beard Combo', price: 280, duration: 45, active: true },
    { name: 'Hair Color', price: 500, duration: 60, active: true },
    { name: 'Head Massage', price: 150, duration: 20, active: false },
  ];

  const earnings = {
    today: '₹580',
    week: '₹4,200',
    month: '₹16,800',
    transactions: [
      { name: 'Aditya K.', service: 'Haircut', amount: 200, time: '10:30 AM', method: 'UPI' },
      { name: 'Rohan S.', service: 'Beard Trim', amount: 100, time: '11:15 AM', method: 'Cash' },
      { name: 'Sneha R.', service: 'Hair Color', amount: 500, time: 'Yesterday', method: 'Card' },
    ],
  };

  const reviews = [
    { name: 'Aditya K.', rating: 5, comment: 'Best haircut ever!', date: '2 days ago', replied: true },
    { name: 'Priya M.', rating: 4, comment: 'Great experience, clean shop.', date: '1 week ago', replied: false },
    { name: 'Rohan S.', rating: 5, comment: 'Amazing beard work.', date: '2 weeks ago', replied: false },
  ];

  const tabs: { key: DashboardTab; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'appointments', label: 'Bookings', icon: Calendar },
    { key: 'services', label: 'Services', icon: Edit2 },
    { key: 'earnings', label: 'Earnings', icon: DollarSign },
    { key: 'reviews', label: 'Reviews', icon: MessageSquare },
    { key: 'availability', label: 'Hours', icon: CalendarClock },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <ArrowLeft size={20} className="text-foreground" />
          </button>
          <div>
            <h1 className="text-xl font-bold text-foreground">Dashboard</h1>
            <p className="text-xs text-muted-foreground">Royal Cuts Studio</p>
          </div>
        </div>
        <button onClick={() => navigate('/barber-settings')} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <Settings size={18} className="text-muted-foreground" />
        </button>
      </div>

      {/* Tab Bar */}
      <div className="px-5 mb-4">
        <div className="flex gap-1 overflow-x-auto hide-scrollbar">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.key ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="px-5 space-y-6">
          <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }} className="glass-card p-4">
                <stat.icon size={18} className="text-primary mb-2" />
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.sub}</p>
              </motion.div>
            ))}
          </div>

          <div className="flex gap-2">
            <button onClick={() => navigate('/barber-onboarding')} className="flex-1 h-12 bg-secondary rounded-2xl text-sm font-medium text-foreground flex items-center justify-center gap-2">
              <Edit2 size={16} className="text-primary" /> Edit Profile
            </button>
            <button onClick={() => setActiveTab('services')} className="flex-1 h-12 gold-gradient rounded-2xl text-sm font-medium text-primary-foreground flex items-center justify-center gap-2">
              <Plus size={16} /> Add Service
            </button>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">Today's Bookings</h2>
            <div className="space-y-2">
              {todayAppointments.map((apt, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }} className="glass-card p-4 flex items-center gap-4">
                  <div className="text-center min-w-[50px]">
                    <p className="text-xs text-muted-foreground">{apt.time.split(' ')[0]}</p>
                    <p className="text-xs text-muted-foreground">{apt.time.split(' ')[1]}</p>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{apt.name}</p>
                    <p className="text-sm text-muted-foreground">{apt.service}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-bold gold-text">₹{apt.price}</span>
                    <span className={`block text-xs font-medium mt-0.5 ${apt.status === 'confirmed' ? 'text-green-400' : 'text-primary'}`}>
                      {apt.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Appointments Tab */}
      {activeTab === 'appointments' && (
        <div className="px-5 space-y-4">
          <div className="flex bg-secondary rounded-2xl p-1">
            {(['today', 'upcoming', 'history'] as const).map(tab => (
              <button key={tab} onClick={() => setAppointmentFilter(tab)}
                className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${appointmentFilter === tab ? 'gold-gradient text-primary-foreground' : 'text-muted-foreground'}`}>
                {tab}
              </button>
            ))}
          </div>
          <div className="space-y-2">
            {todayAppointments.map((apt, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-medium text-foreground">{apt.name}</p>
                    <p className="text-sm text-muted-foreground">{apt.service} • {apt.time}</p>
                  </div>
                  <span className="text-sm font-bold gold-text">₹{apt.price}</span>
                </div>
                {apt.status === 'pending' && (
                  <div className="flex gap-2">
                    <button className="flex-1 h-10 bg-green-400/10 rounded-xl text-sm font-medium text-green-400 flex items-center justify-center gap-1">
                      <Check size={14} /> Accept
                    </button>
                    <button className="flex-1 h-10 bg-destructive/10 rounded-xl text-sm font-medium text-destructive flex items-center justify-center gap-1">
                      <X size={14} /> Reject
                    </button>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Services Tab */}
      {activeTab === 'services' && (
        <div className="px-5 space-y-4">
          <div className="space-y-2">
            {services.map((svc, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">{svc.name}</p>
                  <p className="text-xs text-muted-foreground">₹{svc.price} • {svc.duration} min</p>
                </div>
                <div className="flex items-center gap-3">
                  <button className={`w-10 h-6 rounded-full relative transition-all ${svc.active ? 'gold-gradient' : 'bg-secondary'}`}>
                    <div className={`w-4 h-4 rounded-full bg-background absolute top-1 transition-all ${svc.active ? 'right-1' : 'left-1'}`} />
                  </button>
                  <button className="text-muted-foreground"><Edit2 size={16} /></button>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="w-full h-12 border-2 border-dashed border-border rounded-2xl text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Plus size={16} /> Add New Service
          </button>
        </div>
      )}

      {/* Earnings Tab */}
      {activeTab === 'earnings' && (
        <div className="px-5 space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Today', value: earnings.today },
              { label: 'This Week', value: earnings.week },
              { label: 'This Month', value: earnings.month },
            ].map((e, i) => (
              <motion.div key={e.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }} className="glass-card p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">{e.label}</p>
                <p className="text-lg font-bold gold-text">{e.value}</p>
              </motion.div>
            ))}
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-semibold text-foreground">Transactions</h2>
              <button className="text-sm text-primary font-medium">Withdraw</button>
            </div>
            <div className="space-y-2">
              {earnings.transactions.map((tx, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">{tx.name}</p>
                    <p className="text-xs text-muted-foreground">{tx.service} • {tx.time}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">+₹{tx.amount}</p>
                    <p className="text-xs text-muted-foreground">{tx.method}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <button className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform">
            Withdraw Earnings
          </button>
        </div>
      )}

      {/* Reviews Tab */}
      {activeTab === 'reviews' && (
        <div className="px-5 space-y-4">
          <div className="glass-card p-5 text-center">
            <p className="text-3xl font-bold gold-text">4.8</p>
            <div className="flex justify-center gap-0.5 my-2">
              {[1, 2, 3, 4, 5].map(s => (
                <Star key={s} size={16} className={`${s <= 4 ? 'fill-primary text-primary' : 'text-muted-foreground/30'}`} />
              ))}
            </div>
            <p className="text-sm text-muted-foreground">Based on 234 reviews</p>
          </div>
          <div className="space-y-2">
            {reviews.map((r, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-xs font-bold text-primary">
                      {r.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{r.name}</p>
                      <p className="text-xs text-muted-foreground">{r.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Star size={12} className="fill-primary text-primary" />
                    <span className="text-sm font-medium text-foreground">{r.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{r.comment}</p>
                <button className="text-xs text-primary font-medium">
                  {r.replied ? 'View Reply' : 'Reply'}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Availability Tab */}
      {activeTab === 'availability' && (
        <div className="px-5 space-y-4">
          <p className="text-sm text-muted-foreground">Manage your working hours and block specific time slots.</p>
          {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day, i) => (
            <motion.div key={day} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }} className="glass-card p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{day}</p>
                <p className="text-xs text-muted-foreground">{day === 'Sunday' ? 'Closed' : '9:00 AM – 7:00 PM'}</p>
              </div>
              <button className={`w-10 h-6 rounded-full relative transition-all ${day !== 'Sunday' ? 'gold-gradient' : 'bg-secondary'}`}>
                <div className={`w-4 h-4 rounded-full bg-background absolute top-1 transition-all ${day !== 'Sunday' ? 'right-1' : 'left-1'}`} />
              </button>
            </motion.div>
          ))}
          <button className="w-full h-12 border-2 border-dashed border-border rounded-2xl text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Clock size={16} /> Block Time Slot
          </button>
        </div>
      )}
    </div>
  );
};

export default BarberDashboard;
