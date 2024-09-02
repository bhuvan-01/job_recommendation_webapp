import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import apiClient from "@/services/apiClient";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const EmployerStatsPieChart = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetching data from the API
        const response = await apiClient.get("/jobs/employer-stats");
        const {
          totalJobsPosted,
          totalApplications,
          totalJobsSaved,
          totalPeopleHired,
        } = response.data;

        // Preparing data for the pie chart
        const chartData = [
          { name: "Jobs Posted", value: totalJobsPosted },
          { name: "Applications", value: totalApplications },
          { name: "Jobs Saved", value: totalJobsSaved },
          { name: "People Hired", value: totalPeopleHired },
        ];

        setData(chartData);
      } catch (error) {
        console.error("Error fetching pie chart data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default EmployerStatsPieChart;
