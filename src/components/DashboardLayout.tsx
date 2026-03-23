import { ReactNode } from 'react';
import DashboardBottomNav from './DashboardBottomNav';

interface DashboardLayoutProps {
  children: ReactNode;
}

const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {children}
      <DashboardBottomNav />
    </div>
  );
};

export default DashboardLayout;
