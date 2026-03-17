import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, IndianRupee, Star, Scissors, Clock, Home } from 'lucide-react';

interface FilterPanelProps {
  open: boolean;
  onClose: () => void;
  onApply: (filters: FilterValues) => void;
}

export interface FilterValues {
  distance: number;
  priceRange: [number, number];
  minRating: number;
  services: string[];
  openNow: boolean;
  mobileService: boolean;
  sortBy: string;
}

const sortOptions = ['Nearby', 'Suggested', 'Top Rated', 'Low Price'];

const FilterPanel = ({ open, onClose, onApply }: FilterPanelProps) => {
  const [distance, setDistance] = useState(10);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [minRating, setMinRating] = useState(0);
  const [services, setServices] = useState<string[]>([]);
  const [openNow, setOpenNow] = useState(false);
  const [mobileService, setMobileService] = useState(false);
  const [sortBy, setSortBy] = useState('Nearby');

  const handleApply = () => {
    onApply({ distance, priceRange, minRating, services, openNow, mobileService, sortBy });
    onClose();
  };

  const handleReset = () => {
    setDistance(10);
    setPriceRange([0, 1000]);
    setMinRating(0);
    setServices([]);
    setOpenNow(false);
    setMobileService(false);
    setSortBy('Nearby');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" onClick={onClose} />
          <motion.div
            initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-50 max-w-lg mx-auto bg-card rounded-t-3xl max-h-[85vh] overflow-y-auto"
          >
            <div className="p-5">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Filters</h2>
                <button onClick={onClose} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                  <X size={20} className="text-foreground" />
                </button>
              </div>

              {/* Sort By */}
              <div className="mb-6">
                <span className="font-medium text-foreground text-sm mb-3 block">Sort By</span>
                <div className="flex flex-wrap gap-2">
                  {sortOptions.map(s => (
                    <button key={s} onClick={() => setSortBy(s)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${sortBy === s ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Distance */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <MapPin size={16} className="text-primary" />
                  <span className="font-medium text-foreground text-sm">Distance</span>
                  <span className="ml-auto text-sm text-muted-foreground">{distance}+ km</span>
                </div>
                <input type="range" min={1} max={20} value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))} className="w-full accent-primary" />
              </div>

              {/* Price */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <IndianRupee size={16} className="text-primary" />
                  <span className="font-medium text-foreground text-sm">Price Range</span>
                  <span className="ml-auto text-sm text-muted-foreground">₹{priceRange[0]} – ₹{priceRange[1]}+</span>
                </div>
                <input type="range" min={0} max={1000} step={50} value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])} className="w-full accent-primary" />
              </div>

              {/* Rating */}
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <Star size={16} className="text-primary" />
                  <span className="font-medium text-foreground text-sm">Minimum Rating</span>
                </div>
                <div className="flex gap-2">
                  {[0, 3, 3.5, 4, 4.5].map(r => (
                    <button key={r} onClick={() => setMinRating(r)}
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${minRating === r ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                      {r === 0 ? 'Any' : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="mb-6 space-y-4">
                <button onClick={() => setOpenNow(!openNow)} className="flex items-center gap-3 w-full">
                  <Clock size={16} className="text-primary" />
                  <span className="font-medium text-foreground text-sm">Open Now</span>
                  <div className={`ml-auto w-12 h-7 rounded-full transition-colors ${openNow ? 'gold-gradient' : 'bg-secondary'} relative`}>
                    <div className={`w-5 h-5 bg-foreground rounded-full absolute top-1 transition-all ${openNow ? 'right-1' : 'left-1'}`} />
                  </div>
                </button>
                <button onClick={() => setMobileService(!mobileService)} className="flex items-center gap-3 w-full">
                  <Home size={16} className="text-primary" />
                  <span className="font-medium text-foreground text-sm">Mobile Service</span>
                  <div className={`ml-auto w-12 h-7 rounded-full transition-colors ${mobileService ? 'gold-gradient' : 'bg-secondary'} relative`}>
                    <div className={`w-5 h-5 bg-foreground rounded-full absolute top-1 transition-all ${mobileService ? 'right-1' : 'left-1'}`} />
                  </div>
                </button>
              </div>

              <div className="flex gap-3">
                <button onClick={handleReset} className="flex-1 h-14 bg-secondary rounded-2xl font-semibold text-foreground text-base">Reset</button>
                <button onClick={handleApply} className="flex-1 h-14 gold-gradient rounded-2xl font-semibold text-primary-foreground text-base active:scale-[0.97] transition-transform">Apply</button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default FilterPanel;
