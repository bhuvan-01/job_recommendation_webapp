import React from 'react';

const StatsCards = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <div className="bg-blue-500 text-white p-4 rounded shadow">
        <h3 className="text-lg">Total Job Seekers</h3>
        <p className="text-2xl font-semibold">{stats.totalJobSeekers}</p>
      </div>
      <div className="bg-green-500 text-white p-4 rounded shadow">
        <h3 className="text-lg">Total Employers</h3>
        <p className="text-2xl font-semibold">{stats.totalEmployers}</p>
      </div>
      <div className="bg-orange-500 text-white p-4 rounded shadow">
        <h3 className="text-lg">Total Jobs</h3>
        <p className="text-2xl font-semibold">{stats.totalJobs}</p>
      </div>
      <div className="bg-red-500 text-white p-4 rounded shadow">
        <h3 className="text-lg">Total Hired People</h3>
        <p className="text-2xl font-semibold">{stats.totalHired}</p>
      </div>
    </div>
  );
};

export default StatsCards;
