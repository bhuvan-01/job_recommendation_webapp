import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import { Box, Typography } from "@mui/material";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import apiClient from "@/services/apiClient";

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminStatsLineChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get("/admin/stats-by-month");
        const data = response.data;

        const months = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];

        const jobData = new Array(12).fill(0);
        const jobSeekersData = new Array(12).fill(0);
        const employersData = new Array(12).fill(0);
        const hiredData = new Array(12).fill(0);
        const applicationsData = new Array(12).fill(0);

        data.monthlyJobs.forEach((item) => {
          const monthIndex = item._id.month - 1;
          jobData[monthIndex] = item.totalJobs;
        });

        data.monthlyJobSeekers.forEach((item) => {
          const monthIndex = item._id.month - 1;
          jobSeekersData[monthIndex] = item.totalJobSeekers;
        });

        data.monthlyEmployers.forEach((item) => {
          const monthIndex = item._id.month - 1;
          employersData[monthIndex] = item.totalEmployers;
        });

        data.monthlyHired.forEach((item) => {
          const monthIndex = item._id.month - 1;
          hiredData[monthIndex] = item.totalHired;
        });

        data.monthlyApplications.forEach((item) => {
          const monthIndex = item._id.month - 1;
          applicationsData[monthIndex] = item.totalApplications;
        });

        const maxValue = Math.max(
          ...jobData,
          ...jobSeekersData,
          ...employersData,
          ...hiredData,
          ...applicationsData
        );

        setChartData({
          labels: months,
          datasets: [
            {
              label: "Total Jobs",
              data: jobData,
              borderColor: "#3f51b5",
              backgroundColor: "rgba(63, 81, 181, 0.3)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "Total Job Seekers",
              data: jobSeekersData,
              borderColor: "#f50057",
              backgroundColor: "rgba(245, 0, 87, 0.3)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "Total Employers",
              data: employersData,
              borderColor: "#4caf50",
              backgroundColor: "rgba(76, 175, 80, 0.3)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "Total Hired",
              data: hiredData,
              borderColor: "#ff9800",
              backgroundColor: "rgba(255, 152, 0, 0.3)",
              fill: true,
              tension: 0.4,
            },
            {
              label: "Total Applications",
              data: applicationsData,
              borderColor: "#673ab7",
              backgroundColor: "rgba(103, 58, 183, 0.3)",
              fill: true,
              tension: 0.4,
            },
          ],
          maxValue,
        });
      } catch (error) {
        console.error("Failed to fetch admin stats:", error);
      }
    };

    fetchStats();
  }, []);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ padding: 3, backgroundColor: "white", borderRadius: "8px" }}>
      <Typography variant="h6" gutterBottom>
        Monthly Admin Stats
      </Typography>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: "Month",
                font: {
                  size: 14,
                },
              },
              grid: {
                display: false,
              },
            },
            y: {
              title: {
                display: true,
                text: "Count",
                font: {
                  size: 14,
                },
              },
              beginAtZero: true,
              ticks: {
                precision: 0,
              },
              grid: {
                display: true,
                color: "rgba(200, 200, 200, 0.3)",
              },
              suggestedMax: chartData.maxValue + 5,
            },
          },
        }}
      />
    </Box>
  );
};

export default AdminStatsLineChart;
