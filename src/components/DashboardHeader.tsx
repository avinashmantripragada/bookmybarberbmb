import AppLogo from '@/components/AppLogo';
import NotificationBell from '@/components/NotificationBell';
import { useAuth } from '@/contexts/AuthContext';

const DashboardHeader = () => {
  const { profile } = useAuth();
  return (
    <div className="flex items-center justify-between px-5 pt-12 pb-3">
      <div className="flex items-center gap-2.5">
        <AppLogo size="sm" />
        <div>
          <h1 className="text-lg font-bold gold-text leading-none">BookMyBarber</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">{profile?.name || 'Dashboard'}</p>
        </div>
      </div>
      <NotificationBell />
    </div>
  );
};

export default DashboardHeader;
