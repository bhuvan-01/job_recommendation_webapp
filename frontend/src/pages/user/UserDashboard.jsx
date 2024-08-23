import Header from '@/components/Header';
import UserDashboardContent from '@/components/UserDashboardContent';
import Footer from '@/components/Footer';
import { Outlet } from 'react-router-dom';

const userDashboard = () => {
  return (
    <div>
      <Header />
      <UserDashboardContent />
      <Footer/>
      <Outlet/>
    </div>
  );
};

export default userDashboard;
