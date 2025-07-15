import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const Login = () => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { handleLogin, user } = useAuth();
  const { isDarkMode, colors } = useTheme();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await handleLogin(form);
      toast.success('Login successfully!');
    } catch (err) {
      toast.error('Login failed: ' + err.message);
      setError('Login failed: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center px-2 ${
        isDarkMode
          ? 'bg-gradient-to-br from-gray-800 via-black to-gray-700'
          : 'bg-gradient-to-br from-purple-800 via-purple-300 to-purple-700'
      }`}
    >
      <form
        className={`w-full max-w-sm p-8 rounded-2xl shadow-xl flex flex-col gap-4 backdrop-blur-md transition duration-300 ${
          isDarkMode
            ? `${colors.card} text-yellow-100 border ${colors.border}`
            : 'bg-white/60 text-black'
        }`}
        onSubmit={handleSubmit}
      >
        <h2
          className={`text-2xl font-bold text-center mb-2 ${
            isDarkMode ? 'text-yellow-500' : 'text-purple-600'
          }`}
        >
          Login
        </h2>

        <input
          type="text"
          name="username"
          placeholder="Username or Email"
          required
          value={form.username}
          onChange={handleChange}
          className={`p-3 rounded w-full ${
            isDarkMode
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
          className={`p-3 rounded w-full ${
            isDarkMode
              ? `${colors.input} text-yellow-400 placeholder-yellow-200`
              : 'border border-purple-300'
          }`}
        />

        <button
          type="submit"
          className={`w-full px-6 py-3 rounded font-semibold shadow transition ${
            isDarkMode
              ? 'bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          }`}
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>

        {error && <div className="text-red-600 text-center font-semibold mt-2">{error}</div>}

        <div className="text-center mt-2">
          <span>Not registered? </span>
          <Link to="/signup" className="text-purple-700 font-semibold hover:underline">
            Signup
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
