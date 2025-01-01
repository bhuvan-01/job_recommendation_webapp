import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import apiClient from "@/services/apiClient";

const MonthlyStatsChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
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

        // Initialize data arrays
        const jobData = Array(12).fill(0);
        const jobSeekerData = Array(12).fill(0);
        const employerData = Array(12).fill(0);
        const hiredData = Array(12).fill(0);
        const applicationData = Array(12).fill(0);

        data.monthlyJobs.forEach((item) => {
          jobData[item._id.month - 1] = item.totalJobs;
        });

        data.monthlyJobSeekers.forEach((item) => {
          jobSeekerData[item._id.month - 1] = item.totalJobSeekers;
        });

        data.monthlyEmployers.forEach((item) => {
          employerData[item._id.month - 1] = item.totalEmployers;
        });

        data.monthlyHired.forEach((item) => {
          hiredData[item._id.month - 1] = item.totalHired;
        });

        data.monthlyApplications.forEach((item) => {
          applicationData[item._id.month - 1] = item.totalApplications;
        });

        setChartData({
          labels: months,
          datasets: [
            {
              label: "Jobs",
              data: jobData,
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
            {
              label: "Job Seekers",
              data: jobSeekerData,
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 1,
            },
            {
              label: "Employers",
              data: employerData,
              backgroundColor: "rgba(255, 159, 64, 0.2)",
              borderColor: "rgba(255, 159, 64, 1)",
              borderWidth: 1,
            },
            {
              label: "Hired",
              data: hiredData,
              backgroundColor: "rgba(54, 162, 235, 0.2)",
              borderColor: "rgba(54, 162, 235, 1)",
              borderWidth: 1,
            },
            {
              label: "Applications",
              data: applicationData,
              backgroundColor: "rgba(255, 206, 86, 0.2)",
              borderColor: "rgba(255, 206, 86, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching the data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full max-w-6x1.5 mx-auto p-4 bg-white rounded-lg ">
      {chartData ? (
        <Bar
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: true,
              },
            },
          }}
          height={400}
        />
      ) : (
        <p>Loading data...</p>
      )}
    </div>
  );
};

export default MonthlyStatsChart;
