import AdminHeader from '@/Admin/AdminHeader';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Outlet } from 'react-router-dom';

const AdminPanel = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="h-screen flex flex-col">
      <AdminHeader />

      <div className="flex flex-1 bg-gray-100">
        {/* Sidebar */}
        <div
          className={`fixed inset-y-0 z-30 transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 ease-in-out  lg:translate-x-0 lg:w-64 bg-white shadow-md`}
        >
          <div className="p-4 text-xl font-semibold border-b border-gray-200">
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

        {/* Content Area */}
        <div className="flex-1 p-6 lg:ml-64">
          <button
            className="lg:hidden p-2 text-gray-500 focus:outline-none focus:bg-gray-200 rounded-md"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
