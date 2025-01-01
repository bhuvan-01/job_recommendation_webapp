import React, { useEffect, useState } from "react";
import { FaUsers, FaBuilding, FaBriefcase, FaUserCheck } from "react-icons/fa";
import apiClient from "../services/apiClient";
import JobStatsLineChart from "./charts/LineChart";
import PieChartComponent from "./charts/PieCharts";
import AdminStatsLineChart from "./charts/DetailedLineChart";
import AdminStatsBarChart from "./charts/BarChart";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalJobSeekers: 0,
    totalEmployers: 0,
    totalJobs: 0,
    totalApplications: 0,
    totalHired: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get("/admin/stats", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-blue-500 p-4 rounded-lg shadow-md flex items-center justify-between text-white">
          <div>
            <h3 className="text-lg font-semibold">Users</h3>
            <p className="text-2xl font-bold">{stats.totalUsers}</p>
          </div>
          <FaUsers className="text-4xl" />
        </div>

        <div className="bg-blue-500 p-4 rounded-lg shadow-md flex items-center justify-between text-white">
          <div>
            <h3 className="text-lg font-semibold">Jobs</h3>
            <p className="text-2xl font-bold">{stats.totalJobs}</p>
          </div>
          <FaBriefcase className="text-4xl" />
        </div>

        <div className="bg-blue-500 p-4 rounded-lg shadow-md flex items-center justify-between text-white">
          <div>
            <h3 className="text-lg font-semibold">Applications</h3>
            <p className="text-2xl font-bold">{stats.totalApplications}</p>
          </div>
          <FaBuilding className="text-4xl" />
        </div>

        <div className="bg-blue-500 p-4 rounded-lg shadow-md flex items-center justify-between text-white">
          <div>
            <h3 className="text-lg font-semibold">Hired</h3>
            <p className="text-2xl font-bold">{stats.totalHired}</p>
          </div>
          <FaUserCheck className="text-4xl" />
        </div>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4 ">Job Stats Overview</h2>
        <JobStatsLineChart stats={stats} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <div className="bg-white p-4 rounded-lg ">
          <PieChartComponent stats={stats} />
        </div>
        <div className="bg-white p-4 rounded-lg ">
          <AdminStatsBarChart />
        </div>
      </div>
      <div className="mt-8 bg-white p-4 rounded-lg">
        <AdminStatsLineChart />
      </div>
    </div>
  );
};

export default AdminDashboard;
