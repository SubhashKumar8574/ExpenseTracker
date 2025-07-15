import { createContext, useContext, useState, useEffect } from 'react';
import { apiFetch } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [credentials, setCredentials] = useState(() => {
    const stored = localStorage.getItem('credentials');
    return stored ? JSON.parse(stored) : null;
  });

  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  // Login handler
  const handleLogin = async (creds) => {
    // const isEmail = creds.username.includes('@');
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(creds.username);
    const updatedCreds = { ...creds, isEmail };
    setCredentials(updatedCreds);
    localStorage.setItem('credentials', JSON.stringify(updatedCreds));

    const endpoint = isEmail
      ? `http://localhost:8080/api/users/by-email/${creds.username}`
      : `http://localhost:8080/api/users/by-username/${creds.username}`;

    const res = await apiFetch(endpoint, {}, updatedCreds);
    if (!res.ok) throw new Error('User not found');
    const userData = await res.json();
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout handler
  const handleLogout = () => {
    setCredentials(null);
    setUser(null);
    localStorage.removeItem('credentials');
    localStorage.removeItem('user');
  };


  return (
    <AuthContext.Provider
      value={{ credentials, setCredentials, user, setUser, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
