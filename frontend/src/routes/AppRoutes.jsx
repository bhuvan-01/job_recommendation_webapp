import App from "@/App";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Signup from "@/pages/Signup";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import UserDashboard from "../pages/user/UserDashboard";
import PrivateRoute from "./PrivateRoute";
import UserProfile from "@/pages/user/UserProfile";
import EmployerProfile from "@/pages/employer/EmployerProfile";
import EmployerDashboard from "@/pages/employer/EmployerDashboard";
import EmployerDashboardContent from "@/components/EmployerDashboardContent";
import CreateJobs from "@/pages/employer/CreateJobs";
import EditJob from "@/pages/employer/EditJob";
import NotFound from "@/pages/NotFound";
import AppliedJobs from "@/pages/user/AppliedJobs";
import JobRecommendations from "@/pages/user/RecommendedJobs";
import SavedJobs from "@/pages/user/SavedJobs";
import UserDashboardContent from "@/components/UserDashboardContent";
import ApplyNow from "@/pages/user/ApplyNow";
import ForgotPassword from '@/components/ForgotPassword'

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPassword />,
      },
      {
        path: "/",
        element: <PrivateRoute />,
        children: [
          {
            path: "dashboard/user",
            element: <UserDashboard />,
            children: [
              {
                index: true,
                element: <UserDashboardContent />,
              },
              {
                path: "appliedjobs",
                element: <AppliedJobs />,
              },
              {
                path: "savedjobs",
                element: <SavedJobs />,
              },
              {
                path: "recommended",
                element: <JobRecommendations />,
              },
              {
                path: "jobs/:jobId/apply",
                element: <ApplyNow />,
              },
            ],
          },
          {
            path: "dashboard/employer",
            element: <EmployerDashboard />,
            children: [
              {
                index: true,
                element: <EmployerDashboardContent />,
              },
              {
                path: "jobs/add",
                element: <CreateJobs />,
              },
              {
                path: "jobs/edit/:id",
                element: <EditJob />,
              },
            ],
          },
          {
            path: "profile/user",
            element: <UserProfile />,
            children: [
              // {
              //   path:'/edit',
              //   element
              // }
            ],
          },
          {
            path: "profile/employer",
            element: <EmployerProfile />,
          },

          // new router added

          // new router above
        ],
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

const AppRoutes = () => {
  return <RouterProvider router={router} />;
};

export default AppRoutes;
