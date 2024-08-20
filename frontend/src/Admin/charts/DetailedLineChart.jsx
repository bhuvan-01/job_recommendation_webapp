import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import apiClient from '@/services/apiClient'; // Make sure this path is correct

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
        const response = await apiClient.get('/admin/stats-by-month');
        const data = response.data;

        // All months
        const months = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        // Initialize data arrays with zeroes for each month
        const jobData = new Array(12).fill(0);
        const jobSeekersData = new Array(12).fill(0);
        const employersData = new Array(12).fill(0);
        const hiredData = new Array(12).fill(0);

        // Fill the data arrays with actual values from the response
        data.monthlyJobs.forEach((item) => {
          const monthIndex = item._id.month - 1; // Month is 1-based in MongoDB, 0-based in JS
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

        // Calculate the maximum value for the y-axis
        const maxValue = Math.max(
          ...jobData,
          ...jobSeekersData,
          ...employersData,
          ...hiredData
        );

        setChartData({
          labels: months,
          datasets: [
            {
              label: 'Total Jobs',
              data: jobData,
              borderColor: '#3f51b5',
              fill: false,
            },
            {
              label: 'Total Job Seekers',
              data: jobSeekersData,
              borderColor: '#f50057',
              fill: false,
            },
            {
              label: 'Total Employers',
              data: employersData,
              borderColor: '#4caf50',
              fill: false,
            },
            {
              label: 'Total Hired',
              data: hiredData,
              borderColor: '#ff9800',
              fill: false,
            },
          ],
          maxValue, // Store the calculated max value for later use
        });
      } catch (error) {
        console.error('Failed to fetch admin stats:', error);
      }
    };

    fetchStats();
  }, []);

  if (!chartData) {
    return <div>Loading...</div>;
  }

  return (
    <Box sx={{ padding: 3, backgroundColor: 'white' }}>
      <Typography variant="h6" gutterBottom>
        Monthly Admin Stats
      </Typography>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
          scales: {
            x: {
              title: {
                display: true,
                text: 'Month',
              },
              grid: {
                display: false, // Removes the grid lines on the x-axis
              },
            },
            y: {
              title: {
                display: true,
                text: 'Count',
              },
              beginAtZero: true,
              ticks: {
                precision: 0, // Ensures the y-axis shows whole numbers
              },
              grid: {
                display: false, // Removes the grid lines on the y-axis
              },
              suggestedMax: chartData.maxValue + 5, // Adds a margin to the highest value to scale the graph better
            },
          },
        }}
      />
    </Box>
  );
};

export default AdminStatsLineChart;
