import FooterWithSocialLinks from "@/components/footer";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const EmployerDashboard = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-grow">
        <Outlet />
      </div>
      <FooterWithSocialLinks />
    </div>
  );
};

export default EmployerDashboard;
