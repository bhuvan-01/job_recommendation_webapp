import Header from "@/components/Header";
import UserDashboardContent from "@/components/UserDashboardContent";
import Footer from "@/components/Footer";
import { Outlet } from "react-router-dom";

const userDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <UserDashboardContent />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default userDashboard;
