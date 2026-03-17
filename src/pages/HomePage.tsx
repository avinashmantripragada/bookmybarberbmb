import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Bell, Store, ChevronRight, Loader2 } from 'lucide-react';
import { useBarbers, useShops } from '@/hooks/useData';
import AppLogo from '@/components/AppLogo';
import NotificationBell from '@/components/NotificationBell';
import EmptyState from '@/components/EmptyState';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Star, MapPin as MapPinIcon, Circle, Users } from 'lucide-react';

const HomePage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'all' | 'barbers' | 'shops'>('all');
  const [activeFilter, setActiveFilter] = useState('all');
  const { user } = useAuth();

  const { data: barbers = [], isLoading: loadingBarbers } = useBarbers();
  const { data: shops = [], isLoading: loadingShops } = useShops();

  const filters = ['All', 'Top Rated', 'Suggested', 'Nearby'];

  const sortedBarbers = [...barbers].sort((a, b) => {
    if (activeFilter === 'top rated') return b.rating - a.rating;
    if (activeFilter === 'suggested') return b.reviewCount - a.reviewCount;
    return 0;
  });

  const sortedShops = [...shops].sort((a, b) => {
    if (activeFilter === 'top rated') return b.rating - a.rating;
    return 0;
  });

  const isLoading = loadingBarbers || loadingShops;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-5 pt-14 pb-3">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-3">
              <AppLogo size="sm" />
              <h1 className="text-lg font-bold gold-text leading-tight">BookMyBarber</h1>
            </div>
            <div className="flex items-center gap-2">
              {user && <NotificationBell />}
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground flex items-center gap-1 ml-14 -mt-1">
            <MapPin size={10} /> Bangalore, Karnataka
          </p>
        </motion.div>
      </div>

      {/* View Mode Tabs */}
      <div className="px-5 mb-3">
        <div className="flex bg-secondary rounded-2xl p-1">
          {(['all', 'barbers', 'shops'] as const).map(mode => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium capitalize transition-all ${viewMode === mode ? 'gold-gradient text-primary-foreground' : 'text-muted-foreground'}`}>
              {mode === 'all' ? 'All' : mode === 'barbers' ? 'Barbers' : 'Shops'}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Pills */}
      <div className="px-5 mb-5">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar">
          {filters.map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(filter.toLowerCase())}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${activeFilter === filter.toLowerCase() ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
              {filter}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 size={32} className="animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-6">
          {/* BARBERS — Horizontal Scroll */}
          {(viewMode === 'all' || viewMode === 'barbers') && (
            <div>
              <div className="flex items-center justify-between px-5 mb-3">
                <h2 className="text-base font-semibold text-foreground">Barbers</h2>
                <button onClick={() => setViewMode('barbers')} className="text-xs text-primary font-medium flex items-center gap-0.5">
                  See All <ChevronRight size={14} />
                </button>
              </div>
              {sortedBarbers.length > 0 ? (
                <div className="flex gap-3 overflow-x-auto hide-scrollbar px-5">
                  {sortedBarbers.map((barber, i) => (
                    <motion.div
                      key={barber.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => navigate(`/barber/${barber.id}`)}
                      className="min-w-[140px] w-[140px] shrink-0 glass-card overflow-hidden cursor-pointer active:scale-[0.97] transition-transform"
                    >
                      {barber.photo ? (
                        <img src={barber.photo} alt={barber.name} className="w-full h-[140px] object-cover" />
                      ) : (
                        <div className="w-full h-[140px] bg-secondary flex items-center justify-center text-3xl font-bold text-primary">
                          {barber.name.charAt(0)}
                        </div>
                      )}
                      <div className="p-3">
                        <p className="font-semibold text-foreground text-sm truncate">{barber.name}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star size={12} className="fill-primary text-primary" />
                          <span className="text-xs font-medium text-foreground">{barber.rating}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{barber.distance}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="px-5">
                  <EmptyState type="no-barbers" onAction={() => navigate('/search')} />
                </div>
              )}
            </div>
          )}

          {/* SHOPS — Vertical List */}
          {(viewMode === 'all' || viewMode === 'shops') && (
            <div className="px-5">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-foreground flex items-center gap-2">
                  <Store size={16} className="text-primary" /> Shops
                </h2>
                <span className="text-xs text-muted-foreground">{sortedShops.length} found</span>
              </div>
              {sortedShops.length > 0 ? (
                <div className="space-y-3">
                  {sortedShops.map((shop, i) => (
                    <motion.div
                      key={shop.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => navigate(`/shop/${shop.id}`)}
                      className="glass-card overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
                    >
                      {shop.photo ? (
                        <div className="relative h-36">
                          <img src={shop.photo} alt={shop.name} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
                          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
                            <Circle size={8} className={`fill-current ${shop.isOpen ? 'text-green-400' : 'text-muted-foreground/50'}`} />
                            <span className={`text-xs font-medium ${shop.isOpen ? 'text-green-400' : 'text-muted-foreground'}`}>
                              {shop.isOpen ? 'Open Now' : 'Closed'}
                            </span>
                          </div>
                        </div>
                      ) : null}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-semibold text-foreground text-base">{shop.name}</h3>
                          <div className="flex items-center gap-1 shrink-0">
                            <Star size={14} className="fill-primary text-primary" />
                            <span className="text-sm font-medium text-foreground">{shop.rating}</span>
                            <span className="text-xs text-muted-foreground">({shop.reviewCount})</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><MapPinIcon size={12} />{shop.location}</span>
                          <span>•</span>
                          <span>{shop.distance}</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground mt-1.5">
                          <span className="flex items-center gap-1"><Users size={12} />{shop.barbers.length} barbers</span>
                          {shop.services.length > 0 && (
                            <span>from <span className="gold-text font-semibold">₹{Math.min(...shop.services.map(s => s.price))}</span></span>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <EmptyState type="no-barbers" onAction={() => navigate('/search')} />
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
