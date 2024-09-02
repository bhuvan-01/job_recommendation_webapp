import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import logoImage from "../assets/images/logo.png";

const Logo = () => {
  const user = useSelector((state) => state.auth.user);
  const isAdmin = user?.role === "admin";
  const isEmployer = user?.role === "employer";
  const navigate = useNavigate();

  const handleLogoClick = (e) => {
    if (isEmployer) {
      e.preventDefault();
      navigate("/dashboard/employer");
    }
  };

  return (
    <>
      {isAdmin ? (
        <div className="flex items-center gap-4">
          <img src={logoImage} alt="JobWipe Logo" className="w-23 h-10" />
          <h1 className="text-2xl font-bold"></h1>
        </div>
      ) : (
        <Link
          to="/"
          onClick={handleLogoClick}
          className="flex items-center gap-4"
        >
          <img src={logoImage} alt="JobWipe Logo" className="w-23 h-10" />
          <h1 className="text-2xl font-bold"></h1>
        </Link>
      )}
    </>
  );
};

export default Logo;
