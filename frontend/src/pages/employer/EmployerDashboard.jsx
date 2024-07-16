import EmployerDahsbordContent from '@/components/EmployerDashboardContent';
import Header from '@/components/Header';
import { Outlet } from 'react-router-dom';

const EmployerDashboard = () => {
  return (
    <div>
      <Header />
      <Outlet />
    </div>
  );
};

export default EmployerDashboard;
