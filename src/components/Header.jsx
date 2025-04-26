// src/components/Header.jsx
import React from 'react';
import { FaSun, FaMoon } from 'react-icons/fa';


function Header({ title, creator, theme, toggleTheme }) {
  return (
    <header className="bg-gradient-to-b from-slate-900/95 to-slate-900/80 dark:from-slate-900/95 dark:to-slate-900/90 backdrop-blur-lg text-slate-200 dark:text-slate-100 p-4 shadow-xl flex justify-between items-center fixed top-0 left-0 right-0 z-50 border-b border-slate-700/50">
      <div className='flex flex-col'>
        <h1 className="text-xl md:text-3xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-400 to-indigo-400">
          {title}
        </h1>
        <p className="text-xl md:text-xl text-slate-400 dark:text-slate-500 mt-1">
          Created by - {creator}
        </p>
      </div>
      <div className="flex items-center space-x-4">

        <button
          onClick={toggleTheme}
          className="p-2 rounded-full text-xl md:text-2xl text-yellow-400 hover:text-yellow-300 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-cyan-400 transition-all duration-300"
          aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {theme === 'dark' ? <FaSun /> : <FaMoon />}
        </button>
      </div>
    </header>
  );
}

export default React.memo(Header);

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos