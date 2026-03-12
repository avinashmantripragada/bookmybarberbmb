import { motion } from 'framer-motion';
import { Star, MapPin, Circle, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Shop } from '@/types';

interface ShopCardProps {
  shop: Shop;
  index: number;
}

const ShopCard = ({ shop, index }: ShopCardProps) => {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      onClick={() => navigate(`/shop/${shop.id}`)}
      className="glass-card overflow-hidden cursor-pointer active:scale-[0.98] transition-transform"
    >
      {shop.photo && (
        <div className="relative h-32">
          <img src={shop.photo} alt={shop.name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5">
            <Circle size={8} className={`fill-current ${shop.isOpen ? 'text-green-400' : 'text-muted-foreground/50'}`} />
            <span className={`text-xs font-medium ${shop.isOpen ? 'text-green-400' : 'text-muted-foreground'}`}>
              {shop.isOpen ? 'Open Now' : 'Closed'}
            </span>
          </div>
        </div>
      )}
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-foreground">{shop.name}</h3>
          <div className="flex items-center gap-1">
            <Star size={14} className="fill-primary text-primary" />
            <span className="text-sm font-medium text-foreground">{shop.rating}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><MapPin size={12} />{shop.distance}</span>
          <span className="flex items-center gap-1"><Users size={12} />{shop.barbers.length} barbers</span>
        </div>
      </div>
    </motion.div>
  );
};

export default ShopCard;
