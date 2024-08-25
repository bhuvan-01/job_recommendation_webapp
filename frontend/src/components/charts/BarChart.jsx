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
import apiClient from '@/services/apiClient'; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const EmployerStatsBarChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/jobs/employer-stats/monthly');
        const data = response.data;

        const months = [
          "January", "February", "March", "April", "May", "June",
          "July", "August", "September", "October", "November", "December"
        ];

        const jobsPostedData = new Array(12).fill(0);
        const applicationsData = new Array(12).fill(0);
        const jobsSavedData = new Array(12).fill(0);
        const peopleHiredData = new Array(12).fill(0);

        data.monthlyJobsPosted.forEach((item) => {
          const monthIndex = item._id.month - 1;
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

        setChartData({
          labels: months,
          datasets: [
            {
              label: 'Jobs Posted',
              data: jobsPostedData,
              backgroundColor: '#3f51b5',
            },
            {
              label: 'Applications',
              data: applicationsData,
              backgroundColor: '#f50057',
            },
            {
              label: 'Jobs Saved',
              data: jobsSavedData,
              backgroundColor: '#4caf50',
            },
            {
              label: 'People Hired',
              data: peopleHiredData,
              backgroundColor: '#ff9800',
            },
          ],
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
        Monthly Stats Bar Chart
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

export default EmployerStatsBarChart;
