import Header from '@/components/Header';
import { Outlet } from 'react-router-dom';
import DashboardCards from './../../components/DashboardCard';
import EmployerLineChart from '@/components/charts/EmployerLine';
import GridAndPieChart from '@/components/charts/GridAndPieChart';
// import StackedBar from '@/components/charts/StackedBar';
import GroupedBarChart from '@/components/charts/GroupedBar'


const EmployerDashboard = () => {
  return (
    <div>
      <Header />
      
      <Outlet />
      <DashboardCards/>
      <EmployerLineChart/>
      <GridAndPieChart/>
      {/* <StackedBar/> */}
      <GroupedBarChart/>
    </div>
  );
};

export default EmployerDashboard;
