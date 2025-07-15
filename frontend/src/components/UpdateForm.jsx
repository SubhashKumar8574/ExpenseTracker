// components/UpdateForm.jsx
import React, { useState, useEffect } from 'react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const UpdateForm = ({ expense, onUpdate, onCancel }) => {
  const { credentials } = useAuth();
  const { isDarkMode } = useTheme();

  const [form, setForm] = useState({
    title: '',
    amount: '',
    category: 'Food',
    date: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (expense) {
      setForm({
        title: expense.title || '',
        amount: expense.amount || '',
        category: expense.category || 'Food',
        date: expense.date || ''
      });
    }
  }, [expense]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await apiFetch(
        `http://localhost:8080/api/expenses/${expense.id}`,
        {
          method: 'PUT',
          body: form
        },
        credentials
      );
      if (!res.ok) throw new Error('Failed to update expense');

      const updatedExpense = await res.json();
      if (onUpdate) onUpdate(updatedExpense);
      toast.success('Expense updated successfully!');
      if (onCancel) onCancel();
    } catch (err) {
      setError(err.message);
      toast.error('Failed to update expense: ' + err.message);
    }
    setLoading(false);
  };

  if (!expense) return null;

  return (
    <div className="w-full px-2">
      <form
        className={`shadow-xl rounded-2xl p-6 sm:p-8 w-full max-w-md mx-auto mt-8 flex flex-col gap-4 ${
          isDarkMode
            ? 'bg-black/40 backdrop-blur-lg text-yellow-200 border border-yellow-500/20'
            : 'bg-white'
        }`}
        onSubmit={handleSubmit}
      >
        <h2
          className={`text-2xl font-bold text-center ${
            isDarkMode ? 'text-yellow-300' : 'text-purple-600'
          }`}
        >
          Update Expense
        </h2>

        <input
          className={`w-full p-3 rounded border ${
            isDarkMode
              ? 'bg-black border-yellow-500/30 text-yellow-400 placeholder-yellow-200'
              : 'border-purple-300'
          }`}
          placeholder="Title"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          className={`w-full p-3 rounded border ${
            isDarkMode
              ? 'bg-black border-yellow-500/30 text-yellow-400 placeholder-yellow-200'
              : 'border-purple-300'
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
          className={`w-full p-3 rounded border ${
            isDarkMode
              ? 'bg-black border-yellow-500/30 text-yellow-400 placeholder-yellow-200'
              : 'border-purple-300'
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
          className={`w-full p-3 rounded border ${
            isDarkMode
              ? 'bg-black border-yellow-500/30 text-yellow-400 placeholder-yellow-200 dark:[color-scheme:dark]'
              : 'border-purple-300'
          }`}
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />

        <div className="flex flex-col sm:flex-row justify-between items-center mt-2 gap-2">
          <button
            type="submit"
            className={`w-full sm:w-auto px-6 py-3 rounded font-semibold shadow transition ${
              isDarkMode
                ? 'bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30'
                : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update'}
          </button>
          <button
            type="button"
            className={`w-full sm:w-auto px-6 py-3 rounded font-semibold shadow transition ${
              isDarkMode
                ? 'bg-white/10 text-white hover:bg-white/20'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>

        {error && (
          <div className="text-red-600 text-center font-semibold mt-2">
            {error}
          </div>
        )}
      </form>
    </div>
  );
};

export default UpdateForm;
