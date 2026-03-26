import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CUSTOMER_HOME, SHOP_OWNER_HOME, BARBER_HOME } from '@/lib/role-routing';

const RouteLoading = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 size={28} className="animate-spin text-primary" />
  </div>
);

/** Root "/" — redirects if user already has a profile selected */
export const EntryRoute = ({ children }: { children: ReactNode }) => {
  const { loading, hasSelectedProfile, getHomeRoute } = useAuth();
  if (loading) return <RouteLoading />;
  if (hasSelectedProfile) return <Navigate to={getHomeRoute()} replace />;
  return <>{children}</>;
};

/** Any route that requires a profile to be selected */
export const SelectedRoleRoute = ({ children }: { children: ReactNode }) => {
  const { loading, hasSelectedProfile } = useAuth();
  if (loading) return <RouteLoading />;
  if (!hasSelectedProfile) return <Navigate to="/" replace />;
  return <>{children}</>;
};

/** Customer-only routes */
export const CustomerRoute = ({ children }: { children: ReactNode }) => {
  const { loading, activeProfile, hasSelectedProfile } = useAuth();
  if (loading) return <RouteLoading />;
  if (!hasSelectedProfile) return <Navigate to="/" replace />;
  if (activeProfile !== 'customer') return <Navigate to={activeProfile === 'shop_owner' ? SHOP_OWNER_HOME : BARBER_HOME} replace />;
  return <>{children}</>;
};

/** Shop owner routes */
export const OwnerRoute = ({ children }: { children: ReactNode }) => {
  const { loading, activeProfile, hasSelectedProfile } = useAuth();
  if (loading) return <RouteLoading />;
  if (!hasSelectedProfile) return <Navigate to="/" replace />;
  if (activeProfile !== 'shop_owner') return <Navigate to={activeProfile === 'independent_barber' ? BARBER_HOME : CUSTOMER_HOME} replace />;
  return <>{children}</>;
};

/** Independent barber routes */
export const BarberRoute = ({ children }: { children: ReactNode }) => {
  const { loading, activeProfile, hasSelectedProfile } = useAuth();
  if (loading) return <RouteLoading />;
  if (!hasSelectedProfile) return <Navigate to="/" replace />;
  if (activeProfile !== 'independent_barber') return <Navigate to={activeProfile === 'shop_owner' ? SHOP_OWNER_HOME : CUSTOMER_HOME} replace />;
  return <>{children}</>;
};
