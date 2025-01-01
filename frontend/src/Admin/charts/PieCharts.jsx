import React from "react";
import { Pie } from "react-chartjs-2";
import Chart from "chart.js/auto";

const PieChart = ({ stats }) => {
  const data = {
    labels: ["Total Users", "Total Jobs", "Total Applications", "Total Hired"],
    datasets: [
      {
        label: "Overview",
        data: [
          stats.totalUsers,
          stats.totalJobs,
          stats.totalApplications,
          stats.totalHired,
        ],
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 20,
        },
      },
    },
  };

  return (
    <div className="w-full h-64">
      <Pie data={data} options={options} />
    </div>
  );
};

export default PieChart;
