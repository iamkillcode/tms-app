import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

const Dashboard = () => {
  const navigate = useNavigate();
  const chartRef = useRef(null);

  const handleGenerateTenderNumber = () => {
    // Logic to generate tender number
    alert('Tender number generated!');
  };

  useEffect(() => {
    // Check if a chart instance already exists and destroy it
    if (chartRef.current) {
      chartRef.current.destroy();
    }

    // Create a new chart instance
    const ctx = document.getElementById('myChart').getContext('2d');
    chartRef.current = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Tender 1', 'Tender 2', 'Tender 3'],
        datasets: [
          {
            label: 'Number of ISOs',
            data: [5, 10, 3],
            backgroundColor: 'rgba(75, 192, 192, 0.6)',
          },
        ],
      },
    });

    // Cleanup function to destroy the chart instance on component unmount
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, []); // Add dependencies if the chart needs to update on data change

  return (
    <div>
      <h1>Dashboard</h1>
      <canvas id="myChart" width="400" height="200"></canvas>
      <button onClick={handleGenerateTenderNumber}>Generate Tender Number</button>
      {/* Add more charts and analytics here */}
      <div>
        <h2>Your Tenders</h2>
        {/* List of tenders */}
      </div>
    </div>
  );
};

export default Dashboard; 