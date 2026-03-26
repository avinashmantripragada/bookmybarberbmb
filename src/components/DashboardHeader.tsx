import { useState, useEffect } from 'react';
import AppLogo from '@/components/AppLogo';
import NotificationBell from '@/components/NotificationBell';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const DashboardHeader = () => {
  const { user, profile, activeProfile } = useAuth();
  const [displayName, setDisplayName] = useState('Dashboard');

  useEffect(() => {
    if (!user) {
      setDisplayName(activeProfile === 'shop_owner' ? 'Shop Dashboard' : activeProfile === 'independent_barber' ? 'Barber Dashboard' : 'Dashboard');
      return;
    }
    loadProfileName();
  }, [user, activeProfile]);

  const loadProfileName = async () => {
    if (activeProfile === 'shop_owner') {
      const { data } = await supabase.from('shops').select('shop_name').eq('owner_id', user!.id).limit(1).single();
      setDisplayName(data?.shop_name || 'Shop Dashboard');
    } else if (activeProfile === 'independent_barber') {
      const { data } = await supabase.from('barbers').select('name').eq('user_id', user!.id).limit(1).single();
      setDisplayName(data?.name || 'Barber Dashboard');
    } else {
      setDisplayName(profile?.name || 'Dashboard');
    }
  };

  return (
    <div className="flex items-center justify-between px-5 pt-12 pb-3">
      <div className="flex items-center gap-2.5">
        <AppLogo size="sm" />
        <div>
          <h1 className="text-lg font-bold gold-text leading-none">BookMyBarber</h1>
          <p className="text-[11px] text-muted-foreground mt-0.5">{displayName}</p>
        </div>
      </div>
      <NotificationBell />
    </div>
  );
};

export default DashboardHeader;
