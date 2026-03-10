import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Clock, Users, TrendingUp, Settings, Plus, Edit2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BarberDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('today');

  const todayAppointments = [
    { time: '10:00 AM', name: 'Aditya K.', service: 'Haircut', status: 'confirmed' },
    { time: '11:00 AM', name: 'Rohan S.', service: 'Beard Trim', status: 'confirmed' },
    { time: '02:00 PM', name: 'Priya M.', service: 'Hair Color', status: 'pending' },
    { time: '03:30 PM', name: 'Vikash T.', service: 'Haircut + Beard', status: 'confirmed' },
  ];

  const stats = [
    { label: 'Today', value: '4', icon: Calendar, sub: 'bookings' },
    { label: 'This Week', value: '18', icon: TrendingUp, sub: 'bookings' },
    { label: 'Earnings', value: '₹4.2K', icon: TrendingUp, sub: 'this week' },
    { label: 'Rating', value: '4.8', icon: Users, sub: '234 reviews' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
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
        <button className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <Settings size={18} className="text-muted-foreground" />
        </button>
      </div>

      {/* Stats */}
      <div className="px-5 mb-6">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.06 }}
              className="glass-card p-4"
            >
              <stat.icon size={18} className="text-primary mb-2" />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-5 mb-6">
        <div className="flex gap-2">
          <button className="flex-1 h-12 bg-secondary rounded-2xl text-sm font-medium text-foreground flex items-center justify-center gap-2">
            <Edit2 size={16} className="text-primary" /> Edit Profile
          </button>
          <button className="flex-1 h-12 gold-gradient rounded-2xl text-sm font-medium text-primary-foreground flex items-center justify-center gap-2">
            <Plus size={16} /> Add Service
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 mb-4">
        <div className="flex bg-secondary rounded-2xl p-1">
          {['today', 'upcoming', 'history'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${
                activeTab === tab ? 'gold-gradient text-primary-foreground' : 'text-muted-foreground'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Appointments */}
      <div className="px-5 space-y-2">
        {todayAppointments.map((apt, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="glass-card p-4 flex items-center gap-4"
          >
            <div className="text-center min-w-[50px]">
              <p className="text-xs text-muted-foreground">
                {apt.time.split(' ')[0]}
              </p>
              <p className="text-xs text-muted-foreground">
                {apt.time.split(' ')[1]}
              </p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="flex-1">
              <p className="font-medium text-foreground">{apt.name}</p>
              <p className="text-sm text-muted-foreground">{apt.service}</p>
            </div>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${
              apt.status === 'confirmed' ? 'bg-green-400/10 text-green-400' : 'bg-primary/10 text-primary'
            }`}>
              {apt.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default BarberDashboard;
