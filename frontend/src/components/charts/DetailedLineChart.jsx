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
import apiClient from '@/services/apiClient'; // Ensure this path is correct

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

const EmployerStatsLineChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/jobs/employer-stats/monthly');
        const data = response.data;

        // All months
        const months = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        // Initialize data arrays with zeroes for each month
        const jobsPostedData = new Array(12).fill(0);
        const applicationsData = new Array(12).fill(0);
        const jobsSavedData = new Array(12).fill(0);
        const peopleHiredData = new Array(12).fill(0);

        // Fill the data arrays with actual values from the response
        data.monthlyJobsPosted.forEach((item) => {
          const monthIndex = item._id.month - 1; // Month is 1-based in MongoDB, 0-based in JS
          jobsPostedData[monthIndex] = item.totalJobsPosted;
        });

        data.monthlyApplications.forEach((item) => {
          const monthIndex = item._id.month - 1;
          applicationsData[monthIndex] = item.totalApplications;
        });

        data.monthlyJobsSaved.forEach((item) => {
          const monthIndex = item._id.month - 1;
          jobsSavedData[monthIndex] = item.totalJobsSaved;
        });

        data.monthlyPeopleHired.forEach((item) => {
          const monthIndex = item._id.month - 1;
          peopleHiredData[monthIndex] = item.totalPeopleHired;
        });

        // Calculate the maximum value for the y-axis
        const maxValue = Math.max(
          ...jobsPostedData,
          ...applicationsData,
          ...jobsSavedData,
          ...peopleHiredData
        );

        setChartData({
          labels: months,
          datasets: [
            {
              label: 'Jobs Posted',
              data: jobsPostedData,
              borderColor: '#3f51b5',
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Applications',
              data: applicationsData,
              borderColor: '#f50057',
              fill: true,
              tension: 0.4,
            },
            {
              label: 'Jobs Saved',
              data: jobsSavedData,
              borderColor: '#4caf50',
              fill: true,
              tension: 0.4,
            },
            {
              label: 'People Hired',
              data: peopleHiredData,
              backgroundColor: 'rgba(239, 68, 68, 0.5)',
              borderColor: '#ff9800',
              fill: true,
              tension: 0.4,
            },
          ],
          maxValue, // Store the calculated max value for later use
        });
      } catch (error) {
        console.error('Failed to fetch employer stats:', error);
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
        Monthly Detailed Line Chart
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

export default EmployerStatsLineChart;
