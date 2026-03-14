import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Settings, Plus, Edit2, Star, DollarSign, BarChart3, Check, X, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLogo from '@/components/AppLogo';
import NotificationBell from '@/components/NotificationBell';
import { useAuth } from '@/contexts/AuthContext';

type Tab = 'overview' | 'barbers' | 'services' | 'bookings' | 'earnings';

const ShopOwnerDashboard = () => {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('overview');

  const stats = [
    { label: 'Today', value: '12', icon: Calendar, sub: 'bookings' },
    { label: 'Barbers', value: '4', icon: Users, sub: 'active' },
    { label: 'Earnings', value: '₹18.5K', icon: DollarSign, sub: 'this week' },
    { label: 'Rating', value: '4.7', icon: Star, sub: '589 reviews' },
  ];

  const barbers = [
    { name: 'Rahul Sharma', bookings: 4, earnings: '₹4,200', rating: 4.8, active: true },
    { name: 'Amit Kumar', bookings: 3, earnings: '₹3,100', rating: 4.6, active: true },
    { name: 'Suresh P.', bookings: 5, earnings: '₹5,800', rating: 4.9, active: true },
    { name: 'Jay Mehta', bookings: 0, earnings: '₹0', rating: 4.2, active: false },
  ];

  const bookings = [
    { time: '10:00 AM', customer: 'Aditya K.', barber: 'Rahul', service: 'Haircut', status: 'confirmed', price: 200 },
    { time: '10:30 AM', customer: 'Priya M.', barber: 'Amit', service: 'Hair Color', status: 'pending', price: 500 },
    { time: '11:00 AM', customer: 'Rohan S.', barber: 'Suresh', service: 'Beard Trim', status: 'confirmed', price: 100 },
    { time: '02:00 PM', customer: 'Sneha R.', barber: 'Rahul', service: 'Combo', status: 'confirmed', price: 280 },
  ];

  const services = [
    { name: 'Haircut', price: 200, duration: 30, active: true },
    { name: 'Beard Trim', price: 100, duration: 15, active: true },
    { name: 'Hair + Beard Combo', price: 280, duration: 45, active: true },
    { name: 'Hair Color', price: 500, duration: 60, active: true },
    { name: 'Head Massage', price: 150, duration: 20, active: false },
  ];

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'overview', label: 'Overview', icon: BarChart3 },
    { key: 'barbers', label: 'Barbers', icon: Users },
    { key: 'bookings', label: 'Bookings', icon: Calendar },
    { key: 'services', label: 'Services', icon: Edit2 },
    { key: 'earnings', label: 'Earnings', icon: DollarSign },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="flex items-center justify-between px-5 pt-14 pb-4">
        <div className="flex items-center gap-3">
          <AppLogo size="sm" />
          <div>
            <h1 className="text-xl font-bold text-foreground">Shop Dashboard</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1"><Store size={12} /> {profile?.name || 'Shop Owner'}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {user && <NotificationBell />}
          <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
            <Settings size={18} className="text-muted-foreground" />
          </button>
        </div>
      </div>

      <div className="px-5 mb-4">
        <div className="flex gap-1 overflow-x-auto hide-scrollbar">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${activeTab === tab.key ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
              <tab.icon size={14} />{tab.label}
            </button>
          ))}
        </div>
      </div>

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
            <button onClick={() => navigate('/shop-onboarding')} className="flex-1 h-12 bg-secondary rounded-2xl text-sm font-medium text-foreground flex items-center justify-center gap-2">
              <Edit2 size={16} className="text-primary" /> Edit Shop
            </button>
            <button onClick={() => setActiveTab('barbers')} className="flex-1 h-12 gold-gradient rounded-2xl text-sm font-medium text-primary-foreground flex items-center justify-center gap-2">
              <Plus size={16} /> Add Barber
            </button>
          </div>
        </div>
      )}

      {activeTab === 'barbers' && (
        <div className="px-5 space-y-4">
          <div className="space-y-2">
            {barbers.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">{b.name.charAt(0)}</div>
                    <div>
                      <p className="font-medium text-foreground">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.bookings} bookings today • {b.earnings}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1"><Star size={12} className="fill-primary text-primary" /><span className="text-sm text-foreground">{b.rating}</span></div>
                    <button className={`w-10 h-6 rounded-full relative transition-all ${b.active ? 'gold-gradient' : 'bg-secondary'}`}>
                      <div className={`w-4 h-4 rounded-full bg-background absolute top-1 transition-all ${b.active ? 'right-1' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <button className="w-full h-12 border-2 border-dashed border-border rounded-2xl text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Plus size={16} /> Add New Barber
          </button>
        </div>
      )}

      {activeTab === 'bookings' && (
        <div className="px-5 space-y-2">
          {bookings.map((apt, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="glass-card p-4">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="font-medium text-foreground">{apt.customer}</p>
                  <p className="text-sm text-muted-foreground">{apt.service} • {apt.time} • <span className="text-primary">{apt.barber}</span></p>
                </div>
                <span className="text-sm font-bold gold-text">₹{apt.price}</span>
              </div>
              {apt.status === 'pending' && (
                <div className="flex gap-2">
                  <button className="flex-1 h-10 bg-green-400/10 rounded-xl text-sm font-medium text-green-400 flex items-center justify-center gap-1"><Check size={14} /> Accept</button>
                  <button className="flex-1 h-10 bg-destructive/10 rounded-xl text-sm font-medium text-destructive flex items-center justify-center gap-1"><X size={14} /> Reject</button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}

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

      {activeTab === 'earnings' && (
        <div className="px-5 space-y-6">
          <div className="grid grid-cols-3 gap-3">
            {[{ label: 'Today', value: '₹2,580' }, { label: 'This Week', value: '₹18,500' }, { label: 'This Month', value: '₹68,200' }].map((e, i) => (
              <motion.div key={e.label} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.06 }} className="glass-card p-4 text-center">
                <p className="text-xs text-muted-foreground mb-1">{e.label}</p>
                <p className="text-lg font-bold gold-text">{e.value}</p>
              </motion.div>
            ))}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-3">By Barber</h2>
            <div className="space-y-2">
              {barbers.filter(b => b.active).map((b, i) => (
                <div key={i} className="glass-card p-4 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-bold text-primary">{b.name.charAt(0)}</div>
                    <p className="font-medium text-foreground">{b.name}</p>
                  </div>
                  <p className="font-bold text-green-400">{b.earnings}</p>
                </div>
              ))}
            </div>
          </div>
          <button className="w-full h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-lg active:scale-[0.97] transition-transform">
            Withdraw Earnings
          </button>
        </div>
      )}
    </div>
  );
};

export default ShopOwnerDashboard;
