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
import AppliedJobs from '@/pages/user/AppliedJobs'
import RecommendedJobs from '@/pages/user/RecommendedJobs';
import SavedJobs from '@/pages/user/SavedJobs';

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
                path: 'jobs/edit/:id',
                element: <EditJob />,
              },
            ],
          },
          {
            path: 'profile/user',
            element: <UserProfile />,
            children: [
              // {
              //   path:'/edit',
              //   element
              // }
            ],
          },
          {
            path: 'profile/employer',
            element: <EmployerProfile />,
          },


          // new router added

          {
            path:'appliedjobs',
            element:<AppliedJobs/>
          },
          {
            path:'recommendedjobs',
            element:<RecommendedJobs/>
          },

          {
            path:'savedjobs',
            element:<SavedJobs/>
          },

          // new router above

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
