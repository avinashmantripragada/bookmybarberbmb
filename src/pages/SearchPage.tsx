import { useState, useEffect } from 'react';
import { Search, Clock, TrendingUp, X, Store, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBarbers, useShops } from '@/hooks/useData';
import BarberCard from '@/components/BarberCard';
import ShopCard from '@/components/ShopCard';
import EmptyState from '@/components/EmptyState';
import { useNavigate } from 'react-router-dom';

const RECENT_KEY = 'bmb_recent_searches';

const SearchPage = () => {
  const [search, setSearch] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const navigate = useNavigate();
  const { data: barbers = [], isLoading: lb } = useBarbers();
  const { data: shops = [], isLoading: ls } = useShops();

  useEffect(() => {
    const stored = localStorage.getItem(RECENT_KEY);
    if (stored) setRecentSearches(JSON.parse(stored));
  }, []);

  const addRecent = (term: string) => {
    const updated = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const removeRecent = (term: string) => {
    const updated = recentSearches.filter(s => s !== term);
    setRecentSearches(updated);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  };

  const handleSearch = (term: string) => {
    setSearch(term);
    if (term.trim()) addRecent(term.trim());
  };

  const filteredBarbers = barbers.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.shopName.toLowerCase().includes(search.toLowerCase()) ||
    b.location.toLowerCase().includes(search.toLowerCase())
  );

  const filteredShops = shops.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.location.toLowerCase().includes(search.toLowerCase())
  );

  const hasResults = filteredBarbers.length > 0 || filteredShops.length > 0;
  const isLoading = lb || ls;

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-2xl font-bold text-foreground mb-4">Search</h1>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input type="text" placeholder="Search barbers, shops, locations..." value={search} onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch(search)} autoFocus
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2"><X size={16} className="text-muted-foreground" /></button>
          )}
        </div>
      </div>

      <div className="px-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-primary" /></div>
        ) : search ? (
          hasResults ? (
            <div className="space-y-6">
              {filteredShops.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2"><Store size={14} /> Shops</h3>
                  <div className="space-y-3">{filteredShops.map((s, i) => <ShopCard key={s.id} shop={s} index={i} />)}</div>
                </div>
              )}
              {filteredBarbers.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">Barbers</h3>
                  <div className="space-y-3">{filteredBarbers.map((b, i) => <BarberCard key={b.id} barber={b} index={i} />)}</div>
                </div>
              )}
            </div>
          ) : (
            <EmptyState type="no-results" />
          )
        ) : (
          <div className="space-y-6">
            {recentSearches.length > 0 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2"><Clock size={14} /> Recent Searches</h3>
                <div className="space-y-1">
                  {recentSearches.map((term) => (
                    <div key={term} className="flex items-center justify-between py-2.5">
                      <button onClick={() => handleSearch(term)} className="text-foreground text-sm flex-1 text-left">{term}</button>
                      <button onClick={() => removeRecent(term)} className="p-1"><X size={14} className="text-muted-foreground" /></button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2"><TrendingUp size={14} /> Popular Barbers</h3>
              <div className="space-y-2">
                {barbers.slice(0, 3).map((b) => (
                  <button key={b.id} onClick={() => navigate(`/barber/${b.id}`)} className="flex items-center gap-3 w-full py-2.5">
                    {b.photo ? <img src={b.photo} alt={b.name} className="w-10 h-10 rounded-xl object-cover" /> :
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-sm font-bold text-primary">{b.name.charAt(0)}</div>}
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{b.name}</p>
                      <p className="text-xs text-muted-foreground">{b.shopName} {b.type === 'independent' && '• Independent'}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2"><Store size={14} /> Popular Shops</h3>
              <div className="space-y-2">
                {shops.slice(0, 3).map((s) => (
                  <button key={s.id} onClick={() => navigate(`/shop/${s.id}`)} className="flex items-center gap-3 w-full py-2.5">
                    {s.photo ? <img src={s.photo} alt={s.name} className="w-10 h-10 rounded-xl object-cover" /> :
                      <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center text-sm font-bold text-primary">{s.name.charAt(0)}</div>}
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">{s.name}</p>
                      <p className="text-xs text-muted-foreground">{s.location}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
