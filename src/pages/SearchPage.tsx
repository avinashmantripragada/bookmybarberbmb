import { useState, useEffect } from 'react';
import { Search, Clock, TrendingUp, X, Store, Loader2, MapPin, SlidersHorizontal, Star, Circle, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBarbers, useShops } from '@/hooks/useData';
import EmptyState from '@/components/EmptyState';
import FilterPanel, { FilterValues } from '@/components/FilterPanel';
import { useNavigate } from 'react-router-dom';

const RECENT_KEY = 'bmb_recent_searches';

const SearchPage = () => {
  const [search, setSearch] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [resultView, setResultView] = useState<'barbers' | 'shops'>('barbers');
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

  const q = search.toLowerCase();
  const filteredBarbers = barbers.filter(b =>
    b.name.toLowerCase().includes(q) || b.shopName.toLowerCase().includes(q) || b.location.toLowerCase().includes(q)
  );
  const filteredShops = shops.filter(s =>
    s.name.toLowerCase().includes(q) || s.location.toLowerCase().includes(q)
  );

  const hasResults = filteredBarbers.length > 0 || filteredShops.length > 0;
  const isLoading = lb || ls;

  const handleApplyFilters = (filters: FilterValues) => {
    console.log('Filters applied:', filters);
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14 pb-2">
        <h1 className="text-2xl font-bold text-foreground mb-4">Search</h1>

        {/* Search Bar + Filter */}
        <div className="flex gap-2 mb-3">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input type="text" placeholder="Search barbers, shops..." value={search} onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch(search)} autoFocus
              className="w-full h-12 pl-11 pr-10 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2"><X size={16} className="text-muted-foreground" /></button>
            )}
          </div>
          <button onClick={() => setShowFilters(true)}
            className="w-12 h-12 rounded-2xl bg-secondary flex items-center justify-center shrink-0">
            <SlidersHorizontal size={18} className="text-primary" />
          </button>
        </div>

        {/* Location */}
        <button className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-secondary text-sm text-muted-foreground w-full mb-4">
          <MapPin size={14} className="text-primary" />
          <span>Current Location</span>
        </button>
      </div>

      <div className="px-5">
        {isLoading ? (
          <div className="flex items-center justify-center py-20"><Loader2 size={32} className="animate-spin text-primary" /></div>
        ) : search ? (
          hasResults ? (
            <div>
              {/* Toggle */}
              <div className="flex bg-secondary rounded-2xl p-1 mb-4">
                <button onClick={() => setResultView('barbers')}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${resultView === 'barbers' ? 'gold-gradient text-primary-foreground' : 'text-muted-foreground'}`}>
                  Barbers ({filteredBarbers.length})
                </button>
                <button onClick={() => setResultView('shops')}
                  className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${resultView === 'shops' ? 'gold-gradient text-primary-foreground' : 'text-muted-foreground'}`}>
                  Shops ({filteredShops.length})
                </button>
              </div>

              {resultView === 'barbers' ? (
                <div className="space-y-3">
                  {filteredBarbers.map((b, i) => (
                    <motion.div key={b.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      onClick={() => navigate(`/barber/${b.id}`)}
                      className="glass-card p-4 flex gap-4 cursor-pointer active:scale-[0.98] transition-transform">
                      {b.photo ? <img src={b.photo} alt={b.name} className="w-14 h-14 rounded-2xl object-cover shrink-0" /> :
                        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-xl font-bold text-primary shrink-0">{b.name.charAt(0)}</div>}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{b.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{b.shopName}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star size={12} className="fill-primary text-primary" /><span className="text-xs font-medium text-foreground">{b.rating}</span>
                          <span className="text-xs text-muted-foreground">• {b.distance}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredShops.map((s, i) => (
                    <motion.div key={s.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                      onClick={() => navigate(`/shop/${s.id}`)}
                      className="glass-card p-4 flex gap-4 cursor-pointer active:scale-[0.98] transition-transform">
                      {s.photo ? <img src={s.photo} alt={s.name} className="w-14 h-14 rounded-2xl object-cover shrink-0" /> :
                        <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center text-xl font-bold text-primary shrink-0">{s.name.charAt(0)}</div>}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-foreground truncate">{s.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{s.location}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Star size={12} className="fill-primary text-primary" /><span className="text-xs font-medium text-foreground">{s.rating}</span>
                          <span className="text-xs text-muted-foreground">• {s.distance}</span>
                          <span className="text-xs text-muted-foreground">• <Users size={10} className="inline" /> {s.barbers.length}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <EmptyState type="no-results" />
          )
        ) : (
          /* Default: same layout as Home — barbers horizontal, shops vertical */
          <div className="space-y-6">
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2"><Clock size={14} /> Recent</h3>
                <div className="space-y-1">
                  {recentSearches.map((term) => (
                    <div key={term} className="flex items-center justify-between py-2.5">
                      <button onClick={() => handleSearch(term)} className="text-foreground text-sm flex-1 text-left">{term}</button>
                      <button onClick={() => removeRecent(term)} className="p-1"><X size={14} className="text-muted-foreground" /></button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Barbers horizontal */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2"><TrendingUp size={14} /> Popular Barbers</h3>
              <div className="flex gap-3 overflow-x-auto hide-scrollbar -mx-5 px-5">
                {barbers.slice(0, 5).map((b) => (
                  <button key={b.id} onClick={() => navigate(`/barber/${b.id}`)} className="min-w-[120px] w-[120px] shrink-0 glass-card overflow-hidden text-left">
                    {b.photo ? <img src={b.photo} alt={b.name} className="w-full h-[120px] object-cover" /> :
                      <div className="w-full h-[120px] bg-secondary flex items-center justify-center text-2xl font-bold text-primary">{b.name.charAt(0)}</div>}
                    <div className="p-2">
                      <p className="text-xs font-medium text-foreground truncate">{b.name}</p>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Star size={10} className="fill-primary text-primary" /><span className="text-[10px] text-foreground">{b.rating}</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Shops vertical */}
            <div>
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2"><Store size={14} /> Popular Shops</h3>
              <div className="space-y-3">
                {shops.slice(0, 5).map((s) => (
                  <button key={s.id} onClick={() => navigate(`/shop/${s.id}`)} className="glass-card p-4 flex items-center gap-3 w-full text-left active:scale-[0.98] transition-transform">
                    {s.photo ? <img src={s.photo} alt={s.name} className="w-12 h-12 rounded-xl object-cover" /> :
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-sm font-bold text-primary">{s.name.charAt(0)}</div>}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{s.location}</p>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <Star size={12} className="fill-primary text-primary" /><span className="text-xs font-medium text-foreground">{s.rating}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <FilterPanel open={showFilters} onClose={() => setShowFilters(false)} onApply={handleApplyFilters} />
    </div>
  );
};

export default SearchPage;
