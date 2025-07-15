// components/NavBar.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';
import { Sun, Moon } from 'lucide-react';

const NavBar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, handleLogout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    handleLogout();
    toast.success('Logout successfully!');
    setMenuOpen(false);
    navigate('/');
  };

  return (
    <nav
      className={`sticky top-0 left-0 w-full shadow-md z-50 ${
        isDarkMode
          ? 'bg-black border-b border-yellow-500/20'
          : 'bg-gradient-to-r from-purple-700 via-purple-500 to-purple-400'
      }`}
    >
      <div className="flex justify-between items-center px-4 md:px-8 py-4">
        <div className="font-bold text-2xl">
          <Link
            to="/"
            className={`no-underline transition duration-300 ease-in-out active:scale-95 ${
              isDarkMode
                ? 'text-yellow-500 hover:text-yellow-300'
                : 'text-white hover:text-purple-300 hover:scale-110 hover:drop-shadow-[0_2px_8px_rgba(162,89,255,0.5)]'
            }`}
            style={{ letterSpacing: '2px' }}
            onClick={() => setMenuOpen(false)}
          >
            ExpenseTrack
          </Link>
        </div>

        {/* Hamburger for mobile */}
        <button
          className={`md:hidden focus:outline-none ${
            isDarkMode ? 'text-yellow-400' : 'text-white'
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 8h16M4 16h16" />
            )}
          </svg>
        </button>

        {/* Desktop menu */}
        <div className="hidden md:flex items-center gap-4">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition duration-300 ${
              isDarkMode ? 'text-yellow-500 hover:bg-yellow-700/30' : 'text-white hover:bg-white/30'
            }`}
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <Link to="/dashboard">
            <button
              className={`font-semibold px-4 py-2 rounded shadow transition duration-300 ease-in-out ${
                isDarkMode
                  ? 'bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30'
                  : 'bg-white text-purple-600 hover:bg-purple-100'
              }`}
            >
              Dashboard
            </button>
          </Link>

          {user ? (
            <button
              onClick={handleLogoutClick}
              className={`font-semibold px-4 py-2 rounded shadow transition duration-300 ease-in-out ${
                isDarkMode
                  ? 'bg-red-700 text-red-200 hover:bg-red-600'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login">
                <button
                  className={`font-semibold px-4 py-2 rounded shadow transition duration-300 ease-in-out ${
                    isDarkMode
                      ? 'bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30'
                      : 'bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800'
                  }`}
                >
                  Login
                </button>
              </Link>
              <Link to="/signup">
                <button
                  className={`font-semibold px-4 py-2 rounded shadow transition duration-300 ease-in-out ${
                    isDarkMode
                      ? 'bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30'
                      : 'bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800'
                  }`}
                >
                  Signup
                </button>
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="flex flex-col md:hidden gap-2 px-4 pb-4 animate-fade-in-down">
          {/* Theme toggle for mobile */}
          <button
            onClick={() => {
              toggleTheme();
              setMenuOpen(false);
            }}
            className={`p-2 rounded-full w-fit transition duration-300 ${
              isDarkMode ? 'text-yellow-500 hover:bg-yellow-700/30' : 'text-white hover:bg-white/30'
            }`}
            title="Toggle Theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <Link to="/dashboard" onClick={() => setMenuOpen(false)}>
            <button
              className={`w-full font-semibold px-4 py-2 rounded shadow transition duration-300 ease-in-out mb-2 ${
                isDarkMode
                  ? 'bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30'
                  : 'bg-white text-purple-600 hover:bg-purple-100'
              }`}
            >
              DashBoard
            </button>
          </Link>

          {user ? (
            <button
              onClick={handleLogoutClick}
              className={`w-full font-semibold px-4 py-2 rounded shadow transition duration-300 ease-in-out ${
                isDarkMode
                  ? 'bg-red-700 text-red-200 hover:bg-red-600'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)}>
                <button
                  className={`w-full font-semibold px-4 py-2 rounded shadow transition duration-300 ease-in-out mb-2 ${
                    isDarkMode
                      ? 'bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30'
                      : 'bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800'
                  }`}
                >
                  Login
                </button>
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)}>
                <button
                  className={`w-full font-semibold px-4 py-2 rounded shadow transition duration-300 ease-in-out ${
                    isDarkMode
                      ? 'bg-yellow-500/20 text-yellow-200 hover:bg-yellow-500/30'
                      : 'bg-gradient-to-r from-purple-500 to-purple-700 text-white hover:from-purple-600 hover:to-purple-800'
                  }`}
                >
                  Signup
                </button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default NavBar;
