import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, Typography } from '@mui/material';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import apiClient from '@/services/apiClient'; // Make sure this path is correct

// Register the components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminStatsBarChart = () => {
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

        setChartData({
          labels: months,
          datasets: [
            {
              label: 'Total Jobs',
              data: jobData,
              backgroundColor: '#3f51b5',
            },
            {
              label: 'Total Job Seekers',
              data: jobSeekersData,
              backgroundColor: '#f50057',
            },
            {
              label: 'Total Employers',
              data: employersData,
              backgroundColor: '#4caf50',
            },
            {
              label: 'Total Hired',
              data: hiredData,
              backgroundColor: '#ff9800',
            },
          ],
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
        Monthly Admin Stats - Bar Chart
      </Typography>
      <Bar
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
                display: false, // Optionally remove grid lines
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
                display: false, // Optionally remove grid lines
              },
            },
          },
        }}
      />
    </Box>
  );
};

export default AdminStatsBarChart;
