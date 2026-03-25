import { ReactNode } from 'react';
import { Loader2 } from 'lucide-react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { CUSTOMER_HOME_ROUTE, OWNER_HOME_ROUTE } from '@/lib/role-routing';

const RouteLoadingState = () => (
  <div className="min-h-screen bg-background flex items-center justify-center">
    <Loader2 size={28} className="animate-spin text-primary" />
  </div>
);

export const EntryRoute = ({ children }: { children: ReactNode }) => {
  const { loading, hasSelectedRole, getDefaultRoute } = useAuth();

  if (loading) return <RouteLoadingState />;
  if (hasSelectedRole) return <Navigate to={getDefaultRoute()} replace />;

  return <>{children}</>;
};

export const SelectedRoleRoute = ({ children }: { children: ReactNode }) => {
  const { loading, hasSelectedRole } = useAuth();

  if (loading) return <RouteLoadingState />;
  if (!hasSelectedRole) return <Navigate to="/" replace />;

  return <>{children}</>;
};

export const CustomerRoute = ({ children }: { children: ReactNode }) => {
  const { loading, appRole, hasSelectedRole } = useAuth();

  if (loading) return <RouteLoadingState />;
  if (!hasSelectedRole) return <Navigate to="/" replace />;
  if (appRole !== 'customer') return <Navigate to={OWNER_HOME_ROUTE} replace />;

  return <>{children}</>;
};

export const OwnerRoute = ({ children }: { children: ReactNode }) => {
  const { loading, appRole, hasSelectedRole } = useAuth();

  if (loading) return <RouteLoadingState />;
  if (!hasSelectedRole) return <Navigate to="/" replace />;
  if (appRole !== 'owner') return <Navigate to={CUSTOMER_HOME_ROUTE} replace />;

  return <>{children}</>;
};