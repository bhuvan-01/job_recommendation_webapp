import App from '@/App';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Signup from '@/pages/Signup';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import UserDashboard from '../pages/user/UserDashboard';
import PrivateRoute from './PrivateRoute';
import UserProfile from '@/pages/user/UserProfile';
import EmployerProfile from '@/pages/employer/EmployerProfile';
import EmployerDashboard from '@/pages/employer/EmployerDashboard';
import EmployerDashboardContent from '@/components/EmployerDashboardContent';
import CreateJobs from '@/pages/employer/CreateJobs';
import EditJob from '@/pages/employer/EditJob';
import NotFound from '@/pages/NotFound';
import Jobs from '@/pages/Jobs';
import JobsApplied from '@/pages/user/JobsApplied';
import JobDetailed from '@/pages/JobDetailed';
import JobsList from '@/pages/JobsList';
import JobsSaved from '@/pages/user/JobsSaved';
import EmployerJobDetailed from '@/pages/employer/EmployerJobDetailed';
import EmployerApplicationDetails from '@/pages/employer/EmployerApplicationDetails';
import AboutUs from '@/components/AboutUs';
import ContactUs from '@/components/ContactUs';
import ForgotPassword from '@/pages/ForgotPassword';
import AdminPanel from '@/Admin/Admin';
import UserManagement from '@/Admin/UserManagement';
import JobManagement from '@/Admin/JobManagement';
import Features from '@/components/Features';
import Newsletter from '@/components/NewsLetters';
import Community from '@/components/Community';



const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: 'login',
        element: <Login />,
      },
      {
        path: 'signup',
        element: <Signup />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },

        {path:'features',
          element:<Features/>
        },

        {path:'community',
          element:<Community/>
        },

     
      {
        path:'aboutus',
        element:<AboutUs/>
      },

      { path:'newsletters',
        element:<Newsletter/>
      },
      { 
        path:'contactus',
        element:<ContactUs/>
      },
      {
        path:'admin',
        element:<AdminPanel/>,
        children:[
          {
            path:'users',
            element:<UserManagement/>
          },
          { path: "jobs", 
            element: <JobManagement /> },
        ]
        },

      {
        path: '/',
        element: <PrivateRoute />,
        children: [
          
          {
            path: 'dashboard/user',
            element: <UserDashboard />,
          },
          {
            path: 'dashboard/employer',
            element: <EmployerDashboard />,
            children: [
              {
                index: true,
                element: <EmployerDashboardContent />,
              },
              {
                path: 'jobs/add',
                element: <CreateJobs />,
              },
              {
                path: 'jobs/:id',
                element: <EmployerJobDetailed />,
              },
              {
                path: 'jobs/edit/:id',
                element: <EditJob />,
              },
              {
                path: 'jobs/edit/:id',
                element: <EditJob />,
              },
              {
                path: 'jobs/applications/:id',
                element: <EmployerApplicationDetails />,
              },
            ],
          },
          {
            path: 'profile/user',
            element: <UserProfile />,
          },
          {
            path: 'profile/employer',
            element: <EmployerProfile />,
          },
        ],
      },
      {
        path: 'jobs',
        element: <Jobs />,
        children: [
          {
            index: true,
            element: <JobsList />,
          },
          {
            path: 'applied',
            element: <JobsApplied />,
          },
          {
            path: 'saved',
            element: <JobsSaved />,
          },
          {
            path: ':id',
            element: <JobDetailed />,
          },
        ],
      },
    ],
    
  },
  
  {
    path: '*',
    element: <NotFound />,
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
