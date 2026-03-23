import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Calendar, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const BottomNav = () => {
  const location = useLocation();
  const { activeRole, profile } = useAuth();

  // Hide on these paths
  const hiddenPaths = ['/login', '/signin', '/signup', '/verify', '/forgot-password', '/reset-password', '/welcome', '/booking/', '/payment/', '/barber-onboarding', '/shop-onboarding', '/chat', '/appointment-details'];
  if (location.pathname === '/' || hiddenPaths.some(p => location.pathname.startsWith(p))) return null;

  // Hide for barber/shop_owner — they use DashboardBottomNav
  if ((activeRole === 'barber' || activeRole === 'shop_owner') && location.pathname.startsWith('/dashboard')) return null;

  // Only show customer nav for customer role or guest
  if (activeRole === 'barber' || activeRole === 'shop_owner') {
    // If on non-dashboard pages like /profile, /settings, etc. still show customer nav
    if (!['/home', '/search', '/appointments', '/profile'].some(p => location.pathname.startsWith(p))) return null;
  }

  const tabs = [
    { icon: Home, label: 'Home', path: '/home' },
    { icon: Search, label: 'Search', path: '/search' },
    { icon: Calendar, label: 'Bookings', path: '/appointments' },
    { icon: null, label: 'Profile', path: '/profile' },
  ];

  const initial = profile?.name?.charAt(0)?.toUpperCase() || 'U';

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/90 backdrop-blur-xl border-t border-border/50 safe-bottom">
      <div className="flex items-center justify-around max-w-lg mx-auto h-16">
        {tabs.map(({ icon: Icon, label, path }) => {
          const active = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center gap-1 px-4 py-2 transition-all duration-200 ${
                active ? 'text-primary scale-105' : 'text-muted-foreground'
              }`}
            >
              {Icon ? (
                <Icon size={22} strokeWidth={active ? 2.5 : 1.5} />
              ) : (
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  active ? 'gold-gradient text-primary-foreground' : 'bg-secondary text-muted-foreground'
                }`}>
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-6 h-6 rounded-full object-cover" />
                  ) : initial}
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

export default BottomNav;
