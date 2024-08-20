import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Box, Typography, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import apiClient from '@/services/apiClient'; // Make sure this is correctly pointing to your API setup

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Define a Material-UI theme
const theme = createTheme({
  palette: {
    primary: { main: '#556cd6' },
    secondary: { main: '#19857b' },
    background: { default: '#fff' },
    text: {
      primary: '#333',
      secondary: '#555',
    },
  },
  typography: {
    fontFamily: 'Arial, sans-serif',
    h6: {
      fontWeight: 500,
    },
  },
});

const GroupedBarChart = () => {
  const [chartData, setChartData] = useState({
    labels: ['Stats'], // Placeholder labels
    datasets: []
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsPosted = apiClient.get('/jobs/employer-stats/jobs-posted');
        const applications = apiClient.get('/jobs/employer-stats/applications');
        const hired = apiClient.get('/jobs/employer-stats/hired');

        const results = await Promise.all([jobsPosted, applications, hired]);

        // Debugging the responses
        console.log("Jobs Posted Response:", results[0].data);
        console.log("Applications Response:", results[1].data);
        console.log("Hired Response:", results[2].data);

        setChartData({
          labels: ['Job Statistics'], // Simplified labels for clarity
          datasets: [
            {
              label: 'Jobs Posted',
              data: [results[0].data.totalJobsPosted],
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
            },
            {
              label: 'Applications',
              data: [results[1].data.totalApplications],
              backgroundColor: 'rgba(54, 162, 235, 0.6)',
            },
            {
              label: 'Hired',
              data: [results[2].data.totalHired],
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
            },
          ]
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Employer Stats Overview',
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        stacked: true,
        beginAtZero: true,
      }
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ height: 400, width: '100%', padding: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Employer Job Statistics
        </Typography>
        <Bar options={options} data={chartData} />
      </Box>
    </ThemeProvider>
  );
};

export default GroupedBarChart;
