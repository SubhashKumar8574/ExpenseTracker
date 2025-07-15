import React, { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const ExpenseList = ({ onEdit, refreshTrigger, onDataUpdate }) => {
  const { credentials, user, handleLogout } = useAuth();
  const { isDarkMode, colors } = useTheme();
  const userId = user?.id;

  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!credentials || !userId) {
      setError('You are not logged in or user ID is missing.');
      setLoading(false);
      return;
    }

    const fetchExpenses = async () => {
      setLoading(true);
      try {
        const response = await apiFetch(`http://localhost:8080/api/expenses`, {}, credentials);
        if (!response.ok) throw new Error('Failed to fetch expenses');
        const data = await response.json();
        setExpenses(data);
        if (typeof onDataUpdate === 'function') onDataUpdate(data);
      } catch (err) {
        setError(err.message);
        handleLogout();
        toast.error('Backend Server Problem! Please Wait for a while.', {
          toastId: 'backend-error-toast',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [credentials, userId, refreshTrigger]);

  if (loading) {
    return <div className="text-center mt-6 text-purple-600 font-semibold">Loading expenses...</div>;
  }

  if (error || !credentials || !userId) {
    return (
      <div className="flex justify-center items-center mt-10">
        <div
          className={`border rounded-xl p-6 max-w-md w-full text-center shadow-sm ${isDarkMode
            ? 'bg-red-900/10 border-red-400 text-red-300'
            : 'bg-red-50 border-red-200 text-red-600'
            }`}
        >
          <div className="text-3xl mb-2">🚫</div>
          <div className="text-lg font-semibold">
            You are not logged in or user ID is missing.
          </div>
          <p className="text-sm mt-1">Please login to view or manage your expenses.</p>
        </div>
      </div>
    );
  }

  if (expenses.length === 0) {
    return (
      <div className="flex justify-center items-center mt-10">
        <div
          className={`border rounded-xl p-6 max-w-md w-full text-center shadow-sm ${isDarkMode
            ? 'bg-purple-900/10 border-purple-300 text-purple-200'
            : 'bg-purple-50 border-purple-200 text-purple-600'
            }`}
        >
          <div className="text-3xl mb-2">📭</div>
          <div className="text-lg font-semibold">Your expense list is empty.</div>
          <p className="text-sm mt-1">Start adding expenses to track your spending!</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`shadow-xl rounded-2xl w-full max-w-4xl mx-auto mt-8 p-3 transition-shadow duration-300 hover:shadow-[0_0_48px_12px_rgba(162,89,255,0.5)] ${isDarkMode ? colors.card : 'bg-white'
        }`}
    >
      <h2
        className={`text-2xl sm:text-3xl font-extrabold text-center tracking-wide drop-shadow mb-4 ${isDarkMode ? 'text-yellow-400' : 'text-purple-700'
          }`}
      >
        Expense List
      </h2>

      <div className="overflow-x-auto">
<div className="max-h-[360px] overflow-y-auto rounded-lg border border-purple-300 dark:border-white/10 custom-scrollbar">
          <table className="w-full table-auto">
            <thead className="sticky top-0 z-10">
              <tr
                className={`text-white ${isDarkMode
                  ? 'bg-gradient-to-r from-purple-900 to-gray-900'
                  : 'bg-gradient-to-r from-purple-500 to-purple-700'
                  }`}
              >
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Amount</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {[...expenses]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((exp) => (
                  <tr
                    key={exp.id}
                    className={`border-b transition ${isDarkMode
                      ? 'hover:bg-white/10 border-white/10 text-yellow-300'
                      : 'hover:bg-purple-50'
                      }`}
                  >
                    <td className="p-3 max-w-[120px] truncate">{exp.title}</td>
                    <td className="p-3">₹{exp.amount}</td>
                    <td className="p-3">{exp.category}</td>
                    <td className="p-3">{exp.date}</td>
                    <td className="p-3">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          className={`px-3 py-1 rounded font-semibold shadow transition ${isDarkMode
                            ? 'bg-purple-800 text-purple-300 hover:bg-purple-600'
                            : 'bg-gradient-to-r from-purple-400 to-purple-600 text-white hover:from-purple-500 hover:to-purple-700'
                            }`}
                          onClick={() => onEdit(exp)}
                        >
                          Edit
                        </button>
                        <button
                          className={`px-3 py-1 rounded font-semibold shadow transition ${isDarkMode
                            ? 'bg-red-800 text-red-300 hover:bg-red-600'
                            : 'bg-gradient-to-r from-red-400 to-red-600 text-white hover:from-red-500 hover:to-red-700'
                            }`}
                          onClick={async () => {
                            if (!window.confirm('Delete this expense?')) return;
                            try {
                              const response = await apiFetch(
                                `http://localhost:8080/api/expenses/${exp.id}`,
                                { method: 'DELETE' },
                                credentials
                              );
                              if (!response.ok) throw new Error('Delete failed');
                              const updated = expenses.filter((e) => e.id !== exp.id);
                              setExpenses(updated);
                              toast.success('Expense deleted successfully!');
                              if (typeof onDataUpdate === 'function') onDataUpdate(updated);
                            } catch (err) {
                              setError(err.message);
                              toast.error('Failed to delete expense: ' + err.message);
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExpenseList;
