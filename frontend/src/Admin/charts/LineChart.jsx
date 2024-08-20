import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const DashboardLineChart = ({ stats }) => {
  // Assuming stats is an object with totalJobSeekers, totalEmployers, totalJobs, and totalHired
  // We'll convert this object into an array suitable for the LineChart
  const data = [
    { category: 'Total Job Seekers', count: stats.totalJobSeekers },
    { category: 'Total Employers', count: stats.totalEmployers },
    { category: 'Total Jobs', count: stats.totalJobs },
    { category: 'Total Hired', count: stats.totalHired }
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="category" />
        <YAxis />
        <Tooltip />
        <Legend />
        {/* We'll use index as a workaround to create separate lines for each stat */}
        <Line type="monotone" dataKey="count" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default DashboardLineChart;
