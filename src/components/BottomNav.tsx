import { Link } from 'react-router-dom';
import { Home, Search, Calendar, User } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const tabs = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: Search, label: 'Search', path: '/search' },
  { icon: Calendar, label: 'Bookings', path: '/appointments' },
  { icon: User, label: 'Profile', path: '/profile' },
];

const BottomNav = () => {
  const location = useLocation();

  // Hide on certain pages
  const hiddenPaths = ['/login', '/signin', '/signup', '/verify', '/forgot-password', '/welcome', '/booking/', '/payment/', '/barber-onboarding', '/shop-onboarding', '/admin'];
  if (location.pathname === '/' || hiddenPaths.some(p => location.pathname.startsWith(p))) return null;

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
              <Icon size={22} strokeWidth={active ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
