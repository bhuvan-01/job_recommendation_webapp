import Header from '@/components/Header';
import UserDashboardContent from '@/components/UserDashboardContent';
import { Outlet } from 'react-router-dom';

const userDashboard = () => {
  return (
    <div>
      <Header />
      {/* <UserDashboardContent /> */}
      <Outlet/>
    </div>
  );
};

export default userDashboard;
