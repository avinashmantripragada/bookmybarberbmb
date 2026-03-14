import bmbLogo from '@/assets/bmb-logo.png';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const AppLogo = ({ size = 'sm' }: AppLogoProps) => {
  const dims = size === 'lg' ? 'w-24 h-24' : size === 'md' ? 'w-14 h-14' : 'w-11 h-11';

  return (
    <img
      src={bmbLogo}
      alt="BookMyBarber"
      className={`${dims} rounded-xl object-cover`}
    />
  );
};

export default AppLogo;
