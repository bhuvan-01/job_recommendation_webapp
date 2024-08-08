import React, { useLayoutEffect, useRef } from 'react';
import * as am4core from '@amcharts/amcharts4/core';
import * as am4charts from '@amcharts/amcharts4/charts';
import am4themes_animated from '@amcharts/amcharts4/themes/animated';

am4core.useTheme(am4themes_animated);

const DashboardLineChart = () => {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    // Create the chart instance
    let chart = am4core.create(chartRef.current, am4charts.XYChart);

    // Add data
    chart.data = [
      { month: 'January', jobsPosted: 10, appliedJobs: 25, hiredPeople: 5 },
      { month: 'February', jobsPosted: 15, appliedJobs: 40, hiredPeople: 8 },
      { month: 'March', jobsPosted: 12, appliedJobs: 30, hiredPeople: 7 },
      { month: 'April', jobsPosted: 20, appliedJobs: 50, hiredPeople: 10 },
      { month: 'May', jobsPosted: 22, appliedJobs: 55, hiredPeople: 12 },
      { month: 'June', jobsPosted: 18, appliedJobs: 45, hiredPeople: 9 },
    ];

    // Create axes
    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = 'month';
    categoryAxis.title.text = 'Month';
    categoryAxis.renderer.grid.template.location = 0;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = 'Count';

    // Create series for "Total Jobs Posted"
    let series1 = chart.series.push(new am4charts.LineSeries());
    series1.dataFields.valueY = 'jobsPosted';
    series1.dataFields.categoryX = 'month';
    series1.name = 'Total Jobs Posted';
    series1.strokeWidth = 2;
    series1.tensionX = 0.8;
    series1.bullets.push(new am4charts.CircleBullet());
    series1.tooltipText = '{name} in {categoryX}: {valueY}';
    
    // Create series for "Applied Jobs"
    let series2 = chart.series.push(new am4charts.LineSeries());
    series2.dataFields.valueY = 'appliedJobs';
    series2.dataFields.categoryX = 'month';
    series2.name = 'Applied Jobs';
    series2.strokeWidth = 2;
    series2.tensionX = 0.8;
    series2.bullets.push(new am4charts.CircleBullet());
    series2.tooltipText = '{name} in {categoryX}: {valueY}';

    // Create series for "Hired People"
    let series3 = chart.series.push(new am4charts.LineSeries());
    series3.dataFields.valueY = 'hiredPeople';
    series3.dataFields.categoryX = 'month';
    series3.name = 'Hired People';
    series3.strokeWidth = 2;
    series3.tensionX = 0.8;
    series3.bullets.push(new am4charts.CircleBullet());
    series3.tooltipText = '{name} in {categoryX}: {valueY}';

    // Add a legend
    chart.legend = new am4charts.Legend();

    // Add cursor for interaction
    chart.cursor = new am4charts.XYCursor();
    chart.cursor.behavior = 'zoomX';

    // Responsive behavior
    chart.responsive.enabled = true;

    // Assign chart to the reference
    chartRef.current = chart;

    // Cleanup on component unmount
    return () => {
      chart.dispose();
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto mt-8 bg-white p-6 rounded-lg ">
      <div ref={chartRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

export default DashboardLineChart;
