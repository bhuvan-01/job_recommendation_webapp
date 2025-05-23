import { Link, useLocation, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { useSelector } from "react-redux";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { LogOut, User } from "lucide-react";
import { IMG_URL } from "@/utils/constants";
import ContactImage from "../assets/images/contactIcon.png";
import { DashboardIcon } from "@radix-ui/react-icons";

const Navbar = () => {
  const { token, user } = useSelector((state) => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Handle logout
  };

  const fallbackName =
    user?.firstName[0].toString() + user?.lastName[0].toString();

  const isLoginPage = location.pathname === "/login";
  const isSignupPage = location.pathname === "/signup";

  const handleFindJobsClick = (e) => {
    e.preventDefault();
    if (!token) {
      navigate("/login");
    } else if (user?.role === "user") {
      navigate("/dashboard/user");
    } else {
      navigate("/jobs");
    }
  };

  return (
    <div className="py-4  border-b-gray-100/75  sticky top-0">
      <div className="container max-w-[1400px] p-0 mx-auto w-[95%] flex justify-between items-center">
        <Logo />

        <div className="flex gap-2 items-center">
          <Link to="/" className="font-medium text-sm p-2 px-4 text-white">
            Home
          </Link>
          <a
            href="/jobs"
            onClick={handleFindJobsClick}
            className="font-medium text-sm p-2 px-4 text-white"
          >
            Find Jobs
          </a>
          <Link
            to="/community"
            className="font-medium text-sm p-2 px-4 text-white"
          >
            Community
          </Link>

          {token ? (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Avatar>
                    <AvatarImage
                      src={
                        user?.photo ? IMG_URL + "/" + user.photo : ContactImage
                      }
                    />
                    {user && <AvatarFallback>{fallbackName}</AvatarFallback>}
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link
                      to={
                        user?.role === "employer"
                          ? "/profile/employer"
                          : "/profile/user"
                      }
                      className="flex items-center"
                    >
                      <User
                        size={16}
                        className="text-gray-800 dark:text-gray-300 mr-2"
                      />
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {user?.role === "employer" && (
                    <DropdownMenuItem>
                      <Link
                        to="/dashboard/employer"
                        className="flex items-center"
                      >
                        <DashboardIcon
                          size={16}
                          className="text-gray-800 dark:text-gray-300 mr-2"
                        />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={handleLogout}
                  >
                    <LogOut
                      size={16}
                      className="text-gray-800 dark:text-gray-300 mr-2"
                    />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              {!isLoginPage && (
                <Link
                  to="/login"
                  className="border font-medium text-sm border-blue-600 p-2 px-4 rounded-md bg-white text-blue-600"
                >
                  Login
                </Link>
              )}

              {!isSignupPage && (
                <Link
                  to="/signup"
                  className="border font-medium text-sm border-blue-600 p-2 px-4 rounded-md bg-blue-600 text-white"
                >
                  Sign Up
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
