import React, { useState, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';
import { useTheme } from '../context/ThemeContext';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const categories = ['Food', 'Transport', 'Utilities', 'Shopping', 'Other'];

const Chart = ({ expenses = [] }) => {
  const { isDarkMode } = useTheme();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('full');
  const doughnutRef = useRef(null);
  const barRef = useRef(null);

  const dataPerCategory = categories.map(cat => {
    const sum = expenses
      .filter(exp => exp.category === cat)
      .reduce((sum, exp) => sum + Number(exp.amount), 0);
    return isNaN(sum) ? 0 : sum;
  });

  const doughnutData = {
    labels: categories,
    datasets: [
      {
        label: 'Expenses',
        data: dataPerCategory,
        backgroundColor: [
          'rgba(162,89,255,0.85)',
          'rgba(106,17,203,0.85)',
          'rgba(247,151,30,0.85)',
          'rgba(67,206,162,0.85)',
          'rgba(255,88,88,0.85)',
        ],
        borderColor: ['#a259ff', '#6a11cb', '#f7971e', '#43cea2', '#ff5858'],
        borderWidth: 2,
        hoverOffset: 16,
      },
    ],
  };

  const barData = {
    labels: categories,
    datasets: [
      {
        label: 'Expenses',
        data: dataPerCategory,
        backgroundColor: [
          'rgba(162,89,255,0.7)',
          'rgba(106,17,203,0.7)',
          'rgba(247,151,30,0.7)',
          'rgba(67,206,162,0.7)',
          'rgba(255,88,88,0.7)',
        ],
        borderRadius: 12,
        borderSkipped: false,
        maxBarThickness: 48,
      },
    ],
  };

  const chartBgClass = isDarkMode
    ? 'bg-gradient-to-br from-gray-800 via-gray-900 to-black'
    : 'bg-gradient-to-br from-purple-100 via-purple-50 to-white';
  const labelColor = isDarkMode ? '#facc15' : '#6a11cb';
  const headingClass = `text-2xl sm:text-3xl font-extrabold text-center tracking-wide drop-shadow mb-6 ${
    isDarkMode ? 'text-yellow-400' : 'text-purple-700'
  }`;

  const gridColor = isDarkMode ? '#27272a' : '#f3e8ff';

  const Modal = ({ children, onClose, fullChart }) => (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 ${
        fullChart ? 'overflow-y-auto pt-8 pb-20' : ''
      }`}
      onClick={onClose}
    >
      <div
        className={`rounded-2xl shadow-2xl p-2 sm:p-4 md:p-8 w-[98vw] h-[90vh] max-w-none md:w-[90vw] md:h-[80vh] lg:w-[75vw] lg:h-[75vh] relative overflow-y-auto ${chartBgClass}`}
        style={{
          boxShadow: '0 0 64px 16px rgba(162,89,255,0.6), 0 2px 24px rgba(0,0,0,0.18)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className={`absolute top-2 right-2 text-3xl font-bold z-50 ${
            isDarkMode
              ? 'text-yellow-400 hover:text-yellow-200'
              : 'text-purple-600 hover:text-purple-800'
          }`}
          onClick={onClose}
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );

  const handleChartSectionClick = (e) => {
    if (
      doughnutRef.current?.contains(e.target) ||
      barRef.current?.contains(e.target)
    ) {
      return;
    }
    setModalType('full');
    setModalOpen(true);
  };

  const chartOptions = (isDoughnut = false) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'bottom',
        labels: {
          color: labelColor,
          font: { size: 18, weight: 'bold' },
          padding: 20,
          boxWidth: 20,
        },
      },
      tooltip: {
        backgroundColor: '#a259ff',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    ...(isDoughnut && { cutout: '60%' }),
  });

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#a259ff',
        titleColor: '#fff',
        bodyColor: '#fff',
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: labelColor, font: { weight: 'bold' } },
      },
      y: {
        beginAtZero: true,
        grid: { color: gridColor },
        ticks: { color: labelColor, font: { weight: 'bold' } },
      },
    },
  };

  return (
    <>
      <div
        className={`w-full mx-auto mt-8 rounded-2xl  shadow-2xl p-4 sm:p-6 md:p-10 transition-shadow duration-300 hover:shadow-[0_0_48px_12px_rgba(162,89,255,0.5)] ${
          isDarkMode ? "bg-black/40 backdrop-blur-lg border border-yellow-400 text-yellow-200" : 'bg-white'
        }`}
        onClick={handleChartSectionClick}
        style={{ cursor: 'pointer' }}
      >
        <h2 className={headingClass}>Expense Overview</h2>
        <div className="flex flex-col md:flex-row gap-10 md:gap-16 justify-center items-center w-full px-4">
          {/* Doughnut */}
          <div className="w-full flex justify-center">
            <div
              ref={doughnutRef}
              className={`relative w-full max-w-md h-[360px] rounded-xl shadow-lg p-4 sm:p-6 flex flex-col items-center justify-between transition-shadow duration-300 cursor-pointer hover:shadow-[0_0_32px_8px_rgba(162,89,255,0.4)] ${chartBgClass}`}
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(true);
                setModalType('doughnut');
              }}
              title="Click to enlarge"
            >
              <span
                className="absolute left-1/2 -translate-x-1/2 top-4 text-xl font-bold pointer-events-none"
                style={{ zIndex: 10, color: labelColor }}
              >
                Total
              </span>
              <div className="flex-1 w-full flex items-center justify-center pt-8">
                <Doughnut data={doughnutData} options={chartOptions(true)} />
              </div>
            </div>
          </div>

          {/* Bar */}
          <div className="w-full flex justify-center">
            <div
              ref={barRef}
              className={`relative w-full max-w-md h-[360px] rounded-xl shadow-lg p-4 sm:p-6 transition-shadow duration-300 cursor-pointer hover:shadow-[0_0_32px_8px_rgba(162,89,255,0.4)] ${chartBgClass}`}
              onClick={(e) => {
                e.stopPropagation();
                setModalOpen(true);
                setModalType('bar');
              }}
              title="Click to enlarge"
            >
              <Bar data={barData} options={barOptions} />
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && (
        <Modal onClose={() => setModalOpen(false)} fullChart={modalType === 'full'}>
          {modalType === 'doughnut' && (
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <h2 className={headingClass}>Doughnut Chart</h2>
              <div className={`relative w-full max-w-[920px] h-[600px] rounded-xl shadow-lg p-6 flex flex-col items-center justify-center ${chartBgClass}`}>
                <span
                  className="absolute left-1/2 -translate-x-1/2 top-4 text-xl font-bold"
                  style={{ color: labelColor }}
                >
                  Total
                </span>
                <div className="flex-1 w-full flex items-center justify-center pt-8">
                  <Doughnut data={doughnutData} options={chartOptions(true)} />
                </div>
              </div>
            </div>
          )}

          {modalType === 'bar' && (
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <h2 className={headingClass}>Bar Chart</h2>
              <div className={`relative w-full max-w-[920px] h-[600px] rounded-xl shadow-lg p-6 flex items-center justify-center ${chartBgClass}`}>
                <Bar data={barData} options={barOptions} />
              </div>
            </div>
          )}

          {modalType === 'full' && (
            <div className="w-full flex flex-col items-center justify-center gap-4">
              <h2 className={headingClass}>Expense Overview</h2>
              <div className="w-full h-full flex flex-col lg:flex-row justify-center items-center gap-6 lg:gap-12">
                <div className={`relative w-full max-w-[620px] h-[560px] rounded-xl shadow-lg p-6 flex flex-col items-center justify-center ${chartBgClass}`}>
                  <span className="absolute left-1/2 -translate-x-1/2 top-4 text-xl font-bold" style={{ color: labelColor }}>Total</span>
                  <div className="flex-1 w-full flex items-center justify-center pt-8">
                    <Doughnut data={doughnutData} options={chartOptions(true)} />
                  </div>
                </div>
                <div className={`relative w-full max-w-[620px] h-[560px] rounded-xl shadow-lg p-6 flex items-center justify-center ${chartBgClass}`}>
                  <Bar data={barData} options={barOptions} />
                </div>
              </div>
            </div>
          )}
        </Modal>
      )}
    </>
  );
};

export default Chart;
