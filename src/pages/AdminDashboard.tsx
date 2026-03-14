import { motion } from 'framer-motion';
import { Users, Store, Calendar, DollarSign, TrendingUp, BarChart3, Settings } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLogo from '@/components/AppLogo';
import NotificationBell from '@/components/NotificationBell';
import { useAuth } from '@/contexts/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const stats = [
    { label: 'Total Users', value: '2,847', icon: Users, sub: '+124 this week', color: 'text-blue-400' },
    { label: 'Total Shops', value: '89', icon: Store, sub: '+5 this week', color: 'text-primary' },
    { label: 'Total Bookings', value: '12,456', icon: Calendar, sub: '+342 this week', color: 'text-green-400' },
    { label: 'Total Revenue', value: '₹24.8L', icon: DollarSign, sub: '+₹2.1L this week', color: 'text-primary' },
  ];

  const recentActivity = [
    { type: 'signup', text: 'New shop "Elite Cuts" registered', time: '2 min ago' },
    { type: 'booking', text: 'Aditya K. booked at Royal Cuts', time: '5 min ago' },
    { type: 'review', text: 'New 5-star review for Vikram Singh', time: '12 min ago' },
    { type: 'payment', text: 'Withdrawal of ₹15,000 by Blade & Fade', time: '1 hr ago' },
    { type: 'signup', text: 'New barber Deepak joined as independent', time: '2 hrs ago' },
  ];

  const topShops = [
    { name: 'Royal Cuts Studio', bookings: 456, revenue: '₹3.2L', rating: 4.8 },
    { name: 'Blade & Fade', bookings: 312, revenue: '₹2.1L', rating: 4.6 },
    { name: 'Urban Edge Salon', bookings: 198, revenue: '₹1.4L', rating: 4.5 },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header - No back button */}
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <div className="flex items-center gap-3">
          <AppLogo size="sm" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Admin Panel</h1>
            <p className="text-xs text-muted-foreground">BookMyBarber Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user && <NotificationBell />}
          <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <Settings size={18} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="px-5 space-y-6">
        <div className="grid grid-cols-2 gap-3">
          {stats.map((stat, i) => (
            <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }} className="glass-card p-4">
              <stat.icon size={18} className={stat.color + ' mb-2'} />
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-xs text-muted-foreground">{stat.label}</p>
              <p className="text-xs text-green-400 mt-1">{stat.sub}</p>
            </motion.div>
          ))}
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" /> Top Shops
          </h2>
          <div className="space-y-2">
            {topShops.map((shop, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="glass-card p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full gold-gradient flex items-center justify-center text-xs font-bold text-primary-foreground">{i + 1}</div>
                  <div>
                    <p className="font-medium text-foreground">{shop.name}</p>
                    <p className="text-xs text-muted-foreground">{shop.bookings} bookings • ⭐ {shop.rating}</p>
                  </div>
                </div>
                <p className="font-bold gold-text">{shop.revenue}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
            <BarChart3 size={18} className="text-primary" /> Recent Activity
          </h2>
          <div className="space-y-2">
            {recentActivity.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="glass-card p-4 flex items-center justify-between">
                <p className="text-sm text-foreground flex-1">{item.text}</p>
                <p className="text-xs text-muted-foreground whitespace-nowrap ml-3">{item.time}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
