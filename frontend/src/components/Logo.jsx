import { Link } from 'react-router-dom';
import logoImage from '../assets/images/logo.png'; // Ensure the path is correct

const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-4">
      <img src={logoImage} alt="JobWipe Logo" className="w-23 h-20" /> 
      <h1 className="text-2xl font-bold"></h1> 
    </Link>
  );
};

export default Logo;
