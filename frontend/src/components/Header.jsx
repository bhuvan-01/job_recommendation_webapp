import { Link, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Bell, LogOut, MessageSquareText, User, BarChart2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useDispatch } from "react-redux";
import { logout } from "@/app/auth/authSlice";
import { clearToken } from "@/services/apiClient";
import useUser from "@/hooks/useUser";
import { IMG_URL } from "@/utils/constants";
import Notifications from "./Notifications";
import ContactImage from "../assets/images/contactIcon.png";
import { DashboardIcon } from "@radix-ui/react-icons";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useUser();

  const handleLogout = () => {
    dispatch(logout());
    clearToken();
    navigate("/");
  };

  const fallbackName =
    user?.firstName[0].toString() + user?.lastName[0].toString();

  return (
    <div className="py-2 border-b border-transparent bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 backdrop-blur-md shadow-lg sticky top-0 z-50">
      <div className="container px-0 w-[95%] mx-auto max-w-[1400px] flex justify-between items-center">
        <Logo />

        <div className="flex gap-4 items-center text-white">
          {/* <Link
            to="/messages"
            className="flex font-semibold gap-2 items-center hover:text-white hover:scale-105 transition-all duration-300 p-4 px-2"
          >
            <MessageSquareText size={18} />
            <span className="hidden md:inline">Messages</span>
          </Link> */}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="transparent"
                to="/notifications"
                className="flex font-semibold gap-2 items-center hover:text-white hover:scale-105 transition-all duration-300 p-4 px-2"
              >
                <Bell size={18} />
                <span className="hidden md:inline">Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-[400px] mr-80 bg-white text-black shadow-xl rounded-lg">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <Notifications />
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage
                  src={user?.photo ? IMG_URL + "/" + user.photo : ContactImage}
                />
                {user && <AvatarFallback>{fallbackName}</AvatarFallback>}
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white text-black shadow-xl rounded-lg">
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
                  <Link to="/dashboard/employer" className="flex items-center">
                    <DashboardIcon
                      size={16}
                      className="text-gray-800 dark:text-gray-300 mr-2"
                    />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
              )}
              {user?.role === "employer" && (
                <DropdownMenuItem>
                  <Link to="/jobs" className="flex items-center">
                    <DashboardIcon
                      size={16}
                      className="text-gray-800 dark:text-gray-300 mr-2"
                    />
                    Other Posted Jobs
                  </Link>
                </DropdownMenuItem>
              )}

              {user?.role === "employer" && (
                <DropdownMenuItem>
                  <Link
                    to="/dashboard/employer/applications"
                    className="flex items-center"
                  >
                    <BarChart2
                      size={16}
                      className="text-gray-800 dark:text-gray-300 mr-2"
                    />
                    Applications
                  </Link>
                </DropdownMenuItem>
              )}

              {user?.role === "employer" && (
                <DropdownMenuItem>
                  <Link
                    to="/dashboard/employer/analytics"
                    className="flex items-center"
                  >
                    <BarChart2
                      size={16}
                      className="text-gray-800 dark:text-gray-300 mr-2"
                    />
                    Analytics
                  </Link>
                </DropdownMenuItem>
              )}
              {user?.role === "user" && (
                <DropdownMenuItem>
                  <Link to="/jobs/applied" className="flex items-center">
                    <DashboardIcon
                      size={16}
                      className="text-gray-800 dark:text-gray-300 mr-2"
                    />
                    Applied Jobs
                  </Link>
                </DropdownMenuItem>
              )}

              {user?.role === "user" && (
                <DropdownMenuItem>
                  <Link to="/jobs/saved" className="flex items-center">
                    <DashboardIcon
                      size={16}
                      className="text-gray-800 dark:text-gray-300 mr-2"
                    />
                    Saved Jobs
                  </Link>
                </DropdownMenuItem>
              )}

              <DropdownMenuItem
                className="cursor-pointer hover:bg-red-100 transition-all duration-300"
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
        </div>
      </div>
    </div>
  );
};

export default Header;
