import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, Store, Users, Scissors } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const DashboardBottomNav = () => {
  const location = useLocation();
  const { profile, activeProfile } = useAuth();

  // Different tabs for shop_owner vs independent_barber
  const tabs = activeProfile === 'shop_owner' ? [
    { icon: Home, label: 'Home', path: '/dashboard' },
    { icon: Calendar, label: 'Bookings', path: '/dashboard/bookings' },
    { icon: Store, label: 'Shop', path: '/dashboard/shop' },
    { icon: Users, label: 'Clients', path: '/dashboard/clients' },
    { icon: null, label: 'Profile', path: '/profile' },
  ] : [
    { icon: Home, label: 'Home', path: '/barber-dashboard' },
    { icon: Calendar, label: 'Bookings', path: '/barber-dashboard/bookings' },
    { icon: Scissors, label: 'Services', path: '/barber-dashboard/services' },
    { icon: Users, label: 'Clients', path: '/barber-dashboard/clients' },
    { icon: null, label: 'Profile', path: '/profile' },
  ];

  const initial = profile?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border/50 safe-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {tabs.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <Link key={path} to={path}
              className={`flex flex-col items-center gap-1 px-3 py-2 transition-all duration-200 ${active ? 'text-primary scale-105' : 'text-muted-foreground'}`}>
              {Icon ? (
                <Icon size={22} strokeWidth={active ? 2.5 : 1.5} />
              ) : (
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${active ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                  {profile?.avatar_url ? <img src={profile.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" /> : initial}
                </div>
              )}
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default DashboardBottomNav;
