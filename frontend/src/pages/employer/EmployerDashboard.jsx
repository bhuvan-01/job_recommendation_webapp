import Header from '@/components/Header';
import { Outlet } from 'react-router-dom';
import DashboardCards from './../../components/DashboardCard';
import EmployerLineChart from '@/components/charts/EmployerLine';
import GridAndPieChart from '@/components/charts/GridAndPieChart';

const EmployerDashboard = () => {
  return (
    <div>
      <Header />
      
      <Outlet />
      <DashboardCards/>
      <EmployerLineChart/>
      <GridAndPieChart/>
    </div>
  );
};

export default EmployerDashboard;
