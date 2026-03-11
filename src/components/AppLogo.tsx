import { Scissors } from 'lucide-react';

interface AppLogoProps {
  size?: 'sm' | 'md';
}

const AppLogo = ({ size = 'sm' }: AppLogoProps) => {
  const dims = size === 'md' ? 'w-12 h-12' : 'w-11 h-11';
  const iconSize = size === 'md' ? 22 : 20;

  return (
    <div
      className={`${dims} rounded-xl bg-secondary flex items-center justify-center shadow-[0_0_20px_rgba(210,160,60,0.1)]`}
    >
      <Scissors size={iconSize} className="text-primary" strokeWidth={2.2} />
    </div>
  );
};

export default AppLogo;
