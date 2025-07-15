// components/Footer.jsx
import React from 'react';
import { useTheme } from '../context/ThemeContext';

const Footer = () => {
  const { isDarkMode } = useTheme();

  return (
    <footer
      className={`w-full fixed left-0 bottom-0 flex flex-col sm:flex-row justify-center sm:justify-between items-center px-4 sm:px-8 py-5 shadow-md text-sm sm:text-base z-50 ${
        isDarkMode
          ? 'bg-black text-yellow-100 border-t border-yellow-500/30'
          : 'bg-gradient-to-r from-purple-700 via-purple-500 to-purple-400 text-white'
      }`}
    >
      <span>© {new Date().getFullYear()} ExpenseTrack. All rights reserved.</span>
      <span className="mt-1 sm:mt-0">
        Made with ❤️ by{' '}
        <span className={isDarkMode ? 'text-yellow-300' : 'font-semibold text-purple-900'}>
          Subhash Kumar
        </span>
      </span>
    </footer>
  );
};

export default Footer;
