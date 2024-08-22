import FooterWithSocialLinks from "@/components/footer";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

const EmployerDashboard = () => {
  return (
    <div>
      <Header />
      <Outlet />
      <FooterWithSocialLinks/>
    </div>
  );
};

export default EmployerDashboard;
