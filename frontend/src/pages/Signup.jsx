import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const Signup = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { isDarkMode, colors } = useTheme();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);
    try {
      const res = await fetch('http://localhost:8080/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Signup failed');
      setSuccess(true);
      toast.success('Signup successful!');
      setForm({ username: '', email: '', password: '' });
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      toast.error('Signup failed: ' + err.message);
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-2 ${isDarkMode
          ? 'bg-gradient-to-br from-gray-800 via-black to-gray-700'
          : 'bg-gradient-to-br from-purple-800 via-purple-300 to-purple-700'
        }`}
    >
      <form
        className={`w-full max-w-sm p-8 rounded-2xl shadow-xl flex flex-col gap-4 backdrop-blur-md transition duration-300 ${isDarkMode
            ? `${colors.card} text-yellow-100 border ${colors.border}`
            : 'bg-white/60 text-black'
          }`}
        onSubmit={handleSubmit}
      >
        <h2
          className={`text-2xl font-bold text-center mb-2 ${isDarkMode ? 'text-yellow-500' : 'text-purple-600'
            }`}
        >
          Signup
        </h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          required
          value={form.username}
          onChange={handleChange}
          className={`p-3 rounded w-full ${isDarkMode
              ? `${colors.input} text-yellow-400 placeholder-yellow-200`
              : 'border border-purple-300'
            }`}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={handleChange}
          className={`p-3 rounded w-full ${isDarkMode
              ? `${colors.input} text-yellow-400 placeholder-yellow-200`
              : 'border border-purple-300'
            }`}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          value={form.password}
          onChange={handleChange}
          className={`p-3 rounded w-full ${isDarkMode
              ? `${colors.input} text-yellow-400 placeholder-yellow-200`
              : 'border border-purple-300'
            }`}
        />

        <button
          type="submit"
          className={`w-full px-6 py-3 rounded font-semibold shadow transition ${isDarkMode
              ? 'bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30'
              : 'bg-purple-600 text-white hover:bg-purple-700'
            }`}
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Signup'}
        </button>

        {success && (
          <div className="text-green-400 text-center font-semibold mt-2">
            Signup successful! Redirecting...
          </div>
        )}
        {error && (
          <div className="text-red-500 text-center font-semibold mt-2">{error}</div>
        )}

        <div className="text-center mt-2">
          <span>Already have an account? </span>
          <Link to="/login" className={`font-semibold hover:underline ${isDarkMode ? 'text-yellow-500' : 'text-purple-700'
            }`}>
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
