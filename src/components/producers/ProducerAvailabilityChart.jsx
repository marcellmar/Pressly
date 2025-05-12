import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { addDays, format } from 'date-fns';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

/**
 * Component to visualize producer availability data using Chart.js
 */
const ProducerAvailabilityChart = ({ producer }) => {
  // Generate next 7 days
  const generateNextDays = (count = 7) => {
    return Array.from({ length: count }, (_, i) => {
      const date = addDays(new Date(), i);
      return format(date, 'MMM d');
    });
  };

  // Generate random availability data for demo purposes
  // In a real app, this would come from the API
  const generateAvailabilityData = (count = 7) => {
    return Array.from({ length: count }, () => {
      const availability = Math.floor(Math.random() * 60) + 40; // 40-100%
      return availability;
    });
  };

  const labels = generateNextDays();
  const availabilityData = generateAvailabilityData();

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Availability (%)',
        data: availabilityData,
        backgroundColor: availabilityData.map(value => 
          value > 70 ? 'rgba(34, 197, 94, 0.7)' : // green for high availability
          value > 50 ? 'rgba(59, 130, 246, 0.7)' : // blue for medium
          'rgba(234, 179, 8, 0.7)' // yellow for low
        ),
        borderColor: availabilityData.map(value => 
          value > 70 ? 'rgb(34, 197, 94)' : 
          value > 50 ? 'rgb(59, 130, 246)' : 
          'rgb(234, 179, 8)'
        ),
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text: 'Production Capacity By Day',
        font: {
          size: 14,
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Availability: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        },
        title: {
          display: true,
          text: 'Available Capacity',
        }
      },
      x: {
        title: {
          display: true,
          text: 'Date',
        }
      }
    },
    maintainAspectRatio: false,
  };

  return (
    <div className="bg-white rounded-lg p-4 shadow-sm">
      <div style={{ height: '250px' }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
      <div className="text-xs text-gray-500 text-center mt-2">
        Production capacity shown is based on current schedule and is subject to change
      </div>
    </div>
  );
};

export default ProducerAvailabilityChart;
