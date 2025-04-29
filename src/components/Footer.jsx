// src/components/Footer.jsx
import React from 'react';
import { FaLinkedin, FaGithub } from 'react-icons/fa';

function Footer() {

  return (
    <footer className="bg-gradient-to-t from-slate-900/95 to-slate-900/80 dark:from-slate-900/95 dark:to-slate-900/90 backdrop-blur-lg text-slate-400 dark:text-slate-400 p-4 text-center fixed bottom-0 left-0 right-0 z-50 border-t border-slate-700/50 flex flex-col items-center space-y-2">

      <div className="flex justify-center items-center space-x-6">
        <a
          href="https://www.linkedin.com/in/ram-bapat-barrsum-diamos"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn Profile"
          title="LinkedIn Profile"
          className="text-slate-400 hover:text-cyan-300 transition-all duration-300 transform hover:scale-110"
        >
          <FaLinkedin size={22} />
        </a>
        <a
          href="https://github.com/Barrsum/Constilition-Map.git"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub Source"
          title="GitHub Source"
          className="text-slate-400 hover:text-purple-400 transition-all duration-300 transform hover:scale-110"
        >
          <FaGithub size={22} />
        </a>
      </div>

      <p className="text-xs md:text-sm font-light text-slate-400">
         Connect via LinkedIn / View Source on GitHub
      </p>

      <p className="text-xs md:text-sm text-slate-500">Constellation Map</p>

      <p className="text-xs md:text-sm font-light text-slate-500">
        Created By Ram Bapat
      </p>

    </footer>
  );
}

export default React.memo(Footer);

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos
