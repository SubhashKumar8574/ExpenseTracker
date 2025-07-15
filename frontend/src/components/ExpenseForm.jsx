import React, { useState } from 'react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';

const ExpenseForm = ({ onAdd }) => {
  const { credentials } = useAuth();
  const { isDarkMode, colors } = useTheme();

  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(
        'http://localhost:8080/api/expenses',
        {
          method: 'POST',
          body: form
        },
        credentials
      );
      if (!res.ok) throw new Error('Failed to add expense');
      const newExpense = await res.json();
      setForm({ title: '', amount: '', category: 'Food', date: '' });
      toast.success('Expense added successfully!');
      if (onAdd) onAdd(newExpense);
    } catch (err) {
      toast.error('Failed to add expense: ' + err.message);
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="w-full px-2">
      <form
        className={`shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-md mx-auto mt-8 flex flex-col gap-4 transition duration-300 ${isDarkMode
          ? `${colors.card} text-yellow-100 border ${colors.border}`
          : 'bg-white'
          }`}
        onSubmit={handleSubmit}
      >
        <h2
          className={`text-2xl font-bold mb-2 text-center ${isDarkMode ? 'text-yellow-300' : 'text-purple-600'
            }`}
        >
          Add Expense
        </h2>

        <input
          className={`w-full p-3 rounded ${isDarkMode
            ? `${colors.input}  text-yellow-400 placeholder-yellow-200`
            : 'border border-purple-300'
            }`}
          placeholder="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          className={`w-full p-3 rounded ${isDarkMode
            ? `${colors.input}  text-yellow-400 placeholder-yellow-200`
            : 'border border-purple-300'
            }`}
          placeholder="Amount"
          type="number"
          name="amount"
          value={form.amount}
          onChange={handleChange}
          required
          min="0"
        />
        <select
          className={`w-full p-3 rounded ${isDarkMode
            ? `${colors.input}  text-yellow-400 placeholder-yellow-200`
            : 'border border-purple-300'
            }`}
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option>Food</option>
          <option>Transport</option>
          <option>Utilities</option>
          <option>Shopping</option>
          <option>Other</option>
        </select>

        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className={`w-full p-3 rounded cursor-pointer transition ${isDarkMode
            ? `${colors.input} text-yellow-400 placeholder-yellow-200`
            : 'border border-purple-300'}`}
          style={{
            colorScheme: isDarkMode ? 'dark' : 'light'
          }}
        />





        <div className="flex flex-col sm:flex-row justify-between items-center mt-2 gap-2">
          <button
            type="submit"
            className={`w-full sm:w-auto px-6 py-3 rounded font-semibold shadow transition ${isDarkMode
              ? 'bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30'
              : 'bg-purple-600 text-white hover:bg-purple-700'
              }`}
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
          <button
            type="button"
            className={`w-full sm:w-auto px-6 py-3 rounded font-semibold shadow transition ${isDarkMode
              ? 'bg-white/10 text-white hover:bg-white/20'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            onClick={() =>
              setForm({ title: '', amount: '', category: 'Food', date: '' })
            }
          >
            Cancel
          </button>
        </div>
        {error && (
          <div className="text-red-600 text-center font-semibold mt-2">{error}</div>
        )}
      </form>
    </div>
  );
};

export default ExpenseForm;
