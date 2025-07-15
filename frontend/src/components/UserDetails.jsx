// components/UserDetails.jsx
import React, { useEffect, useState } from 'react';
import { apiFetch } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const UserDetails = () => {
  const { credentials } = useAuth();
  const { isDarkMode } = useTheme();
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!credentials) {
      setUser({ username: '', email: '' });
      setError('');
      return;
    }

    const fetchUser = async () => {
      try {
        const endpoint = credentials.isEmail
          ? `http://localhost:8080/api/users/by-email/${credentials.username}`
          : `http://localhost:8080/api/users/by-username/${credentials.username}`;

        const res = await apiFetch(endpoint, {}, credentials);
        if (!res.ok) throw new Error('Failed to fetch user details');
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setUser({ username: '', email: '' });
        setError(err.message);
      }
    };

    fetchUser();
  }, [credentials]);

  return (
    <div className="flex flex-col items-center justify-center text-center gap-4 ">
      <svg
        className={`w-20 h-20 ${
          isDarkMode ? 'text-yellow-400' : 'text-purple-500'
        }`}
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="8" r="4" />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 20c0-2.21 3.582-4 8-4s8 1.79 8 4"
        />
      </svg>

      <div
        className={`text-lg font-bold break-words ${
          isDarkMode ? 'text-yellow-500' : 'text-purple-700'
        }`}
      >
        Username:{' '}
        <span className={isDarkMode ? 'text-purple-700' : 'text-black'}>
          {user?.username || ''}
        </span>
      </div>
      <div
        className={`text-lg font-bold break-words ${
          isDarkMode ? 'text-yellow-500' : 'text-purple-700'
        }`}
      >
        Email:{' '}
        <span className={isDarkMode ? 'text-purple-700' : 'text-black'}>
          {user?.email || ''}
        </span>
      </div>

      {error && (
        <div className="text-red-600 text-sm font-semibold mt-2">{error}</div>
      )}
    </div>
  );
};

export default UserDetails;
