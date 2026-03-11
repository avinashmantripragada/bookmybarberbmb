import { Scissors, Brush, Sparkles, Palette, Hand, Crown, Flame, Baby, Sun, Zap } from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  scissors: Scissors,
  brush: Brush,
  sparkles: Sparkles,
  palette: Palette,
  hand: Hand,
  crown: Crown,
  flame: Flame,
  baby: Baby,
  sun: Sun,
};

interface ServiceIconProps {
  icon?: string;
  size?: number;
  className?: string;
}

const ServiceIcon = ({ icon, size = 18, className = 'text-primary' }: ServiceIconProps) => {
  const Icon = icon ? iconMap[icon] || Zap : Zap;
  return <Icon size={size} className={className} />;
};

export default ServiceIcon;
