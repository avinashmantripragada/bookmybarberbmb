import { Star } from 'lucide-react';
import { Barber } from '@/types';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

interface BarberCardProps {
  barber: Barber;
  index: number;
}

const BarberCard = ({ barber, index }: BarberCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      onClick={() => navigate(`/barber/${barber.id}`)}
      className="glass-card p-4 cursor-pointer active:scale-[0.98] transition-transform duration-150"
    >
      <div className="flex gap-4">
        <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-2xl font-bold text-primary shrink-0">
          {barber.name.charAt(0)}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground truncate">{barber.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{barber.shopName}</p>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Star size={14} className="fill-primary text-primary" />
              <span className="text-sm font-medium text-foreground">{barber.rating}</span>
              <span className="text-xs text-muted-foreground">({barber.reviewCount})</span>
            </div>
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">{barber.distance}</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <span className="text-xs text-muted-foreground">from</span>
          <p className="text-lg font-bold gold-text">₹{barber.startingPrice}</p>
        </div>
      </div>
    </motion.div>
  );
};

export default BarberCard;
