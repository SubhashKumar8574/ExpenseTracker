// pages/DashBoard.jsx
import React, { useState } from 'react';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import UpdateForm from '../components/UpdateForm';
import Chart from '../components/Chart';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const DashBoard = () => {
  const { credentials, user } = useAuth();
  const { isDarkMode, colors } = useTheme();

  const [editingExpense, setEditingExpense] = useState(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [chartData, setChartData] = useState([]);

  const handleEdit = (expense) => setEditingExpense(expense);
  const handleUpdate = () => {
    setEditingExpense(null);
    setRefreshTrigger((prev) => prev + 1);
  };
  const handleCancel = () => {
    setEditingExpense(null);
    setRefreshTrigger((prev) => prev + 1);
  };
  const handleAddNewExpense = () => setRefreshTrigger((prev) => prev + 1);

  const normalizedUserId =
    typeof user?.userId === 'object' && user.userId !== null
      ? user.userId.$oid || user.userId.toString()
      : user?.userId;

  return (
    <div
      className={`min-h-screen flex flex-col transition duration-300 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-700 via-black to-gray-600'
          : 'bg-gradient-to-br from-purple-100 via-purple-50 to-white text-black'
      }`}
    >
      <NavBar />
      <main className="flex-1 flex flex-col items-center px-2 py-6 md:px-8 gap-8 max-w-7xl mx-auto w-full pb-24">
        <div className="w-full flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2 flex flex-col gap-8">
            <ExpenseForm
              credentials={credentials}
              userId={normalizedUserId}
              onAdd={handleAddNewExpense}
            />
          </div>
          <div className="w-full md:w-1/2 flex flex-col gap-8">
            <ExpenseList
              onEdit={handleEdit}
              refreshTrigger={refreshTrigger}
              onDataUpdate={setChartData}
            />
            {editingExpense && (
              <UpdateForm
                expense={editingExpense}
                onUpdate={handleUpdate}
                onCancel={handleCancel}
                credentials={credentials}
                userId={normalizedUserId}
              />
            )}
          </div>
        </div>
        <div className="w-full">
          <Chart expenses={chartData} />
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashBoard;
