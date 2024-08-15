import { Link, useNavigate } from 'react-router-dom';
import Logo from './Logo';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import {
  Bell,
  LogOut,
  Map,
  MapPin,
  MessageSquareText,
  Search,
  User,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useDispatch } from 'react-redux';
import { logout } from '@/app/auth/authSlice';
import { clearToken } from '@/services/apiClient';
import useUser from '@/hooks/useUser';
import { IMG_URL } from '@/utils/constants';
import Notifications from './Notifications';
import ContactImage from '../assets/images/contactIcon.png';


const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useUser();
  const handleLogout = () => {
    dispatch(logout());
    clearToken();
    navigate('/');
  };

  // console.log('user: ', user);

  const fallbackName =
    user?.firstName[0].toString() + user?.lastName[0].toString();

  return (
    <div className='py-2 border-b border-b-gray-100/75 bg-white/50 backdrop-blur-md sticky top-0'>
      <div className='container px-0 w-[95%] mx-auto max-w-[1400px] flex justify-between items-center'>
        <Logo />

        <div className='flex gap-2 items-center'>
          <Link
            to='/messages'
            className='flex font-semibold gap-2 items-center hover:text-blue-600 p-4 px-2'
          >
            <MessageSquareText size={18} />
            <span className='hidden md:visible'>Messages</span>
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='transparent'
                to='/notifications'
                className='flex font-semibold gap-2 items-center hover:text-blue-600 p-4 px-2'
              >
                <Bell size={18} />
                <span className='hidden md:visible'>Notifications</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className='w-[400px] mr-24'>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {/* <DropdownMenuItem>Profile</DropdownMenuItem> */}

              <Notifications />
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar>
                <AvatarImage
                  src={
                    user?.photo
                      ? IMG_URL + '/' + user.photo
                      : ContactImage
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
                    user?.role === 'employer'
                      ? '/profile/employer'
                      : '/profile/user'
                  }
                  className='flex items-center'
                >
                  <User
                    size={16}
                    className='text-gray-800 dark:text-gray-300 mr-2'
                  />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                className='cursor-pointer'
                onClick={handleLogout}
              >
                <LogOut
                  size={16}
                  className='text-gray-800 dark:text-gray-300 mr-2'
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
