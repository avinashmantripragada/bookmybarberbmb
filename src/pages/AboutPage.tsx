import { ArrowLeft, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppLogo from '@/components/AppLogo';

const AboutPage = () => {
  const navigate = useNavigate();

  const links = [
    { label: 'Website', url: '#' },
    { label: 'Terms of Service', url: '#' },
    { label: 'Privacy Policy', url: '#' },
    { label: 'Licenses', url: '#' },
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="flex items-center gap-3 px-5 pt-14 pb-4">
        <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
          <ArrowLeft size={20} className="text-foreground" />
        </button>
        <h1 className="text-xl font-bold text-foreground">About Us</h1>
      </div>

      <div className="px-5">
        <div className="flex flex-col items-center py-8">
          <AppLogo size="lg" />
          <h2 className="text-xl font-bold gold-text mt-4">BookMyBarber</h2>
          <p className="text-sm text-muted-foreground mt-1">Your premium grooming companion</p>
          <p className="text-xs text-muted-foreground mt-0.5">Version 1.0.0</p>
        </div>

        <div className="glass-card p-5 mb-5">
          <p className="text-sm text-muted-foreground leading-relaxed">
            BookMyBarber is a premium grooming platform that connects customers with skilled barbers and barbershops.
            Book appointments, manage services, and discover the best grooming professionals near you.
          </p>
        </div>

        <div className="space-y-2">
          {links.map(link => (
            <button key={link.label} onClick={() => window.open(link.url, '_blank')}
              className="w-full glass-card p-4 flex items-center justify-between text-left">
              <span className="text-sm font-medium text-foreground">{link.label}</span>
              <ExternalLink size={16} className="text-muted-foreground" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
