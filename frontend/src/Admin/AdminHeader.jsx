import { Link, useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';
import { Button } from '../components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { useDispatch } from 'react-redux';
import { logout } from '@/app/auth/authSlice';
import { clearToken } from '@/services/apiClient';
import useUser from '@/hooks/useUser';
import { LogOut } from 'lucide-react';

const AdminHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useUser();

  const handleLogout = () => {
    dispatch(logout());
    clearToken();
    navigate('/login'); 
  };

  return (
    <div className="py-2 border-b border-b-gray-100/75 bg-white/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container px-4 md:px-6 lg:px-8 w-[95%] mx-auto max-w-[1400px] flex justify-between items-center">
        <Link to="/">
          <Logo />
        </Link>

        <div className="flex gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Button variant="transparent">
                LogOut
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Admin Panel</DropdownMenuLabel>
              <DropdownMenuSeparator />
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
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
