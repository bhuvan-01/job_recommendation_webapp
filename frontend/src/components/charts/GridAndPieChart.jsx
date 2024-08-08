import React, { useLayoutEffect, useRef } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';
import { useTable } from 'react-table';

am4core.useTheme(am4themes_animated);

const ApplicationHiredPieChart = () => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    let chart = am4core.create(chartRef.current, am4charts.PieChart);

    // Add data
    chart.data = [
      { category: 'Applied Jobs', value: 80 }, // Example data
      { category: 'Hired People', value: 20 }, // Example data
    ];

    // Create series
    let pieSeries = chart.series.push(new am4charts.PieSeries());
    pieSeries.dataFields.value = 'value';
    pieSeries.dataFields.category = 'category';
    pieSeries.slices.template.tooltipText = '{category}: {value}%';
    pieSeries.slices.template.stroke = am4core.color('#fff');
    pieSeries.slices.template.strokeWidth = 2;
    pieSeries.slices.template.strokeOpacity = 1;

    chartRef.current = chart;

    return () => {
      chart.dispose();
    };
  }, []);

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center">Applications vs. Hires</h2>
      <div ref={chartRef} style={{ width: '100%', height: '300px' }} />
    </div>
  );
};

const RecentJobsTable = ({ data }) => {
  const columns = React.useMemo(
    () => [
      {
        Header: 'Job Title',
        accessor: 'jobTitle',
      },
      {
        Header: 'Date Posted',
        accessor: 'datePosted',
      },
      {
        Header: 'Applications',
        accessor: 'applications',
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data });

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-center lg:text-left">Recent Job Postings</h2>
      <table {...getTableProps()} className="min-w-full bg-white text-left">
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  key={column.id} // Assign the key directly
                  {...column.getHeaderProps()}
                  className="py-2 px-4 border-b-2 border-gray-300"
                >
                  {column.render('Header')}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {rows.map((row) => {
            prepareRow(row);
            return (
              <tr key={row.id} {...row.getRowProps()}> {/* Assign the key directly */}
                {row.cells.map((cell) => (
                  <td
                    key={cell.column.id} // Assign the key directly
                    {...cell.getCellProps()}
                    className="py-2 px-4 border-b border-gray-200"
                  >
                    {cell.render('Cell')}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const GridAndPieChart = () => {
  const recentJobsData = [
    {
      jobTitle: 'Frontend Developer',
      datePosted: '2024-08-01',
      applications: 32,
    },
    {
      jobTitle: 'Backend Developer',
      datePosted: '2024-08-03',
      applications: 27,
    },
    {
      jobTitle: 'UI/UX Designer',
      datePosted: '2024-08-05',
      applications: 15,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <ApplicationHiredPieChart />
        <RecentJobsTable data={recentJobsData} />
      </div>
    </div>
  );
};

export default GridAndPieChart;
