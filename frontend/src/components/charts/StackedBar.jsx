import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Box, Typography } from '@mui/material';
import apiClient from '@/services/apiClient'; // Make sure this path is correct

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const StackedBarChart = () => {
  const [chartData, setChartData] = useState({
    labels: ['Job Statistics'], // Generic label for single dataset point
    datasets: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsPosted = apiClient.get('/jobs/employer-stats/jobs-posted');
        const applications = apiClient.get('/jobs/employer-stats/applications');
        const jobsSaved = apiClient.get('/jobs/employer-stats/jobs-saved');
        const hired = apiClient.get('/jobs/employer-stats/hired');

        const results = await Promise.all([jobsPosted, applications, jobsSaved, hired]);

        // Adjust this to match the API response structure
        setChartData({
          labels: ['Job Statistics'], // Maintaining a single label for simplicity
          datasets: [
            {
              label: 'Total Jobs Posted',
              data: [results[0].data.totalJobsPosted], // Corrected to match API response
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
            {
              label: 'Total Applications',
              data: [results[1].data.totalApplications], // Corrected to match API response
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
              label: 'Total Jobs Saved',
              data: [results[2].data.totalJobsSaved], // Corrected to match API response
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
            {
              label: 'Total People Hired',
              data: [results[3].data.totalHired], // Corrected to match API response
              backgroundColor: 'rgba(153, 102, 255, 0.6)',
            }
          ]
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    plugins: {
      title: {
        display: true,
        text: 'Job Stats Overview',
      },
      legend: {
        display: true,
        position: 'top',
      },
    },
    responsive: true,
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
      }
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h6" gutterBottom>
        Job Statistics
      </Typography>
      <Bar options={options} data={chartData} />
    </Box>
  );
};

export default StackedBarChart;
