import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Box, Typography } from '@mui/material';
import apiClient from '@/services/apiClient'; // Make sure this path is correct

function SimplePieChart() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobsPostedPromise = apiClient.get('/jobs/employer-stats/jobs-posted');
        const applicationsPromise = apiClient.get('/jobs/employer-stats/applications');
        const jobsSavedPromise = apiClient.get('/jobs/employer-stats/jobs-saved');
        const hiredPromise = apiClient.get('/jobs/employer-stats/hired');

        const results = await Promise.all([
          jobsPostedPromise,
          applicationsPromise,
          jobsSavedPromise,
          hiredPromise
        ]);

        const formattedData = [
          { name: 'Total Jobs', value: results[0].data.totalJobsPosted || 0 },
          { name: 'Applied Jobs', value: results[1].data.totalApplications || 0 }, // Adjust property names based on actual API response
          { name: 'Saved Jobs', value: results[2].data.totalJobsSaved || 0 },
          { name: 'Hired Jobs', value: results[3].data.totalPeopleHired || 0 }
        ];

        setData(formattedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper', p: 3 }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1, textAlign: 'center' }}>
        Job Stats Overview
      </Typography>
      <PieChart width={400} height={400}>
        <Pie
          data={data}
          cx={200}
          cy={200}
          labelLine={false}
          outerRadius={120}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend align="center" verticalAlign="bottom" height={36}/>
      </PieChart>
    </Box>
  );
}

export default SimplePieChart;
