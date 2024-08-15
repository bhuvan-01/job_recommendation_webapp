import AdminHeader from '@/Admin/AdminHeader';
import React from 'react';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const AdminPanel = ({ children }) => {
  return (

    <div> <AdminHeader/>
    
    <div className="flex h-screen bg-gray-100">
    
      <div className="w-64 bg-white shadow-md">
        <div className="p-4 text-xl font-semibold">
          Admin Panel
        </div>
        <nav className="mt-4">
          <Link to="dashboard" className="block p-4 hover:bg-gray-200">
            Dashboard
          </Link>
          <Link to="users" className="block p-4 hover:bg-gray-200">
            Users
          </Link>
          <Link to="jobs" className="block p-4 hover:bg-gray-200">
            Jobs
          </Link>
        </nav>
      </div>

      {/* Main Content Area
      <div className="flex-1 p-6">
        {children}
     
      </div> */}
      <Outlet /> 
    </div>
    </div>
  );
};

export default AdminPanel;
