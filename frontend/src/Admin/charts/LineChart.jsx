import React from 'react';
import { Line } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const LineChart = ({ stats }) => {
    const data = {
        labels: ['Total Users', 'Job Seekers', 'Employers', 'Jobs', 'Applications', 'Hired'],
        datasets: [
            {
                label: 'Company Statistics',
                data: [
                    stats.totalUsers,
                    stats.totalJobSeekers,
                    stats.totalEmployers,
                    stats.totalJobs,
                    stats.totalApplications,
                    stats.totalHired
                ],
                borderColor: 'rgb(59, 130, 246)', // Tailwind blue-500
                backgroundColor: 'rgba(59, 130, 246, 0.5)', // Semi-transparent blue
                fill: true,
                tension: 0.4,
                pointStyle: 'circle',
                pointRadius: 5,
                pointHoverRadius: 8
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                    color: 'rgb(31, 41, 55)', // Tailwind gray-800
                }
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(156, 163, 175, 0.3)', // Tailwind gray-400
                }
            },
            x: {
                grid: {
                    color: 'rgba(156, 163, 175, 0.3)', // Tailwind gray-400
                }
            }
        }
    };

    return (
        <div className="w-full h-64 md:h-96">
            <Line data={data} options={options} />
        </div>
    );
};

export default LineChart;
