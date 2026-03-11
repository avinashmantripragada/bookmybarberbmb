import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, SlidersHorizontal } from 'lucide-react';
import { mockBarbers } from '@/data/mockData';
import BarberCard from '@/components/BarberCard';
import AppLogo from '@/components/AppLogo';

const HomePage = () => {
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');

  const filters = ['All', 'Nearest', 'Top Rated', 'Budget'];

  const filtered = mockBarbers
    .filter(b =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.shopName.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (activeFilter === 'top rated') return b.rating - a.rating;
      if (activeFilter === 'budget') return a.startingPrice - b.startingPrice;
      if (activeFilter === 'nearest') return parseFloat(a.distance) - parseFloat(b.distance);
      return 0;
    });

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-14 pb-4">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <AppLogo size="sm" />
              <div>
                <h1 className="text-lg font-bold gold-text leading-tight">BookMyBarber</h1>
                <p className="text-xs text-muted-foreground">Your grooming, simplified.</p>
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <MapPin size={18} className="text-primary" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <MapPin size={12} /> Bangalore, Karnataka
          </p>
        </motion.div>
      </div>

      {/* Search */}
      <div className="px-5 mb-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="relative"
        >
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search barbers or shops..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-11 pr-12 rounded-2xl bg-secondary border-none text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
          <button className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center">
            <SlidersHorizontal size={16} className="text-primary" />
          </button>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="px-5 mb-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex gap-2 overflow-x-auto hide-scrollbar"
        >
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter.toLowerCase())}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                activeFilter === filter.toLowerCase()
                  ? 'gold-gradient text-primary-foreground'
                  : 'bg-secondary text-muted-foreground'
              }`}
            >
              {filter}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Barber List */}
      <div className="px-5 space-y-3">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold text-foreground">Nearby Barbers</h2>
          <span className="text-xs text-muted-foreground">{filtered.length} found</span>
        </div>
        {filtered.map((barber, i) => (
          <BarberCard key={barber.id} barber={barber} index={i} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
