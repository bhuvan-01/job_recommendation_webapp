import React from 'react';

const AdminPanel = () => {
  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <div className="w-64 bg-gray-800 text-white">
        <div className="p-4">
          <h2 className="text-2xl font-semibold">Admin Panel</h2>
        </div>
        <ul className="mt-4">
          <li className="p-4 hover:bg-gray-700">
            <a href="#">Dashboard</a>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <a href="#">Users</a>
          </li>
          <li className="p-4 hover:bg-gray-700">
            <a href="#">Job Postings</a>
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-10 bg-gray-100">
        <h1 className="text-3xl font-bold">Welcome to the Admin Panel</h1>
        <p className="mt-4">Select an option from the sidebar to get started.</p>
      </div>
    </div>
  );
};

export default AdminPanel;
