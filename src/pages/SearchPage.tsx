import { useState } from 'react';
import { Search, SlidersHorizontal, Star, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import { mockBarbers } from '@/data/mockData';
import BarberCard from '@/components/BarberCard';

const SearchPage = () => {
  const [search, setSearch] = useState('');

  const filtered = mockBarbers.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.shopName.toLowerCase().includes(search.toLowerCase()) ||
    b.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="px-5 pt-14 pb-4">
        <h1 className="text-2xl font-bold text-foreground mb-4">Search</h1>
        <div className="relative">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search barbers, shops, locations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className="w-full h-12 pl-11 pr-4 rounded-2xl bg-secondary text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>
      </div>

      <div className="px-5 space-y-3">
        {search ? (
          filtered.length > 0 ? (
            filtered.map((b, i) => <BarberCard key={b.id} barber={b} index={i} />)
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground">No barbers found</p>
            </div>
          )
        ) : (
          <div className="text-center py-16">
            <Search size={48} className="text-muted-foreground/20 mx-auto mb-4" />
            <p className="text-muted-foreground">Search for barbers or shops</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
