import React from "react";
import DashboardCards from "./../../components/DashboardCard";
import EmployerLineChart from "@/components/charts/EmployerLine";
import PieChart from "@/components/charts/PieChart";
import GroupedBarChart from "@/components/charts/BarChart";
import DetailedLineChart from "@/components/charts/DetailedLineChart";

function Analytics() {
  return (
    <div className="container mx-auto mt-5">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>

      <div className="p-4 space-y-8 max-w-full overflow-hidden">
        <DashboardCards />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Stats Overview</h2>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <EmployerLineChart />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-8">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <PieChart />
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <GroupedBarChart />
        </div>
      </div>

      <div className="mt-8 bg-white p-4 rounded-lg shadow-md">
        <DetailedLineChart />
      </div>
    </div>
  );
}

export default Analytics;
