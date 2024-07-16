import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className='flex justify-center items-center min-h-screen'>
      <div className='text-center'>
        <h1 className='text-4xl md:text-8xl text-gray-700 font-bold'>404</h1>
        <p className='text-xl'> Not Found</p>

        <Link
          to='/'
          className='bg-gray-200 p-2 px-4 rounded-md inline-block my-4'
        >
          Go home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
