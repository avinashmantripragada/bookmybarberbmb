import { motion } from 'framer-motion';
import { Search, Calendar, Star, MapPin } from 'lucide-react';

type EmptyStateType = 'no-barbers' | 'no-bookings' | 'no-reviews' | 'no-results';

const config: Record<EmptyStateType, { icon: React.ElementType; title: string; message: string; action?: string }> = {
  'no-barbers': {
    icon: MapPin,
    title: 'No barbers found',
    message: 'We couldn\'t find any barbers in your area. Try adjusting your location or filters.',
    action: 'Find Barbers Nearby',
  },
  'no-bookings': {
    icon: Calendar,
    title: 'No bookings yet',
    message: 'You haven\'t booked any appointments yet. Find a barber and book your first session!',
    action: 'Find Barbers Nearby',
  },
  'no-reviews': {
    icon: Star,
    title: 'No reviews yet',
    message: 'This barber hasn\'t received any reviews yet. Be the first to leave one!',
  },
  'no-results': {
    icon: Search,
    title: 'No results found',
    message: 'Try a different search term or browse all barbers.',
  },
};

interface EmptyStateProps {
  type: EmptyStateType;
  onAction?: () => void;
}

const EmptyState = ({ type, onAction }: EmptyStateProps) => {
  const { icon: Icon, title, message, action } = config[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center py-16 px-6 text-center"
    >
      <div className="w-20 h-20 rounded-3xl bg-secondary flex items-center justify-center mb-5">
        <Icon size={36} className="text-muted-foreground/40" />
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-[280px]">{message}</p>
      {action && onAction && (
        <button
          onClick={onAction}
          className="h-12 px-8 gold-gradient rounded-2xl font-semibold text-primary-foreground text-sm active:scale-[0.97] transition-transform"
        >
          {action}
        </button>
      )}
    </motion.div>
  );
};

export default EmptyState;
