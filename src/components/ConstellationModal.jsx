// src/components/ConstellationModal.jsx
import React from 'react';
import { FaTimes } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion'; // Import for animations

function ConstellationModal({ isOpen, onClose, data }) {

  // Safely access properties, provide defaults if missing
  const properties = data?.properties || {};
  const geometry = data?.geometry || {};
  const coordinates = Array.isArray(geometry.coordinates) ? geometry.coordinates : [null, null];

  const name = properties.name || 'Unknown Constellation';
  const desig = properties.desig || '';
  const englishName = properties.en || '';
  const rank = properties.rank || 'N/A';
  const info = properties.info || properties.la || 'No description available.';
  const ra = coordinates[0] !== null ? coordinates[0].toFixed(2) : 'N/A';
  const dec = coordinates[1] !== null ? coordinates[1].toFixed(2) : 'N/A';

  // Animation variants for Framer Motion
   const backdropVariants = {
     hidden: { opacity: 0 },
     visible: { opacity: 1, transition: { duration: 0.3 } },
     exit: { opacity: 0, transition: { duration: 0.2 } }
   };

   const modalVariants = {
      hidden: { y: 50, opacity: 0 },
      visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100, damping: 15, duration: 0.5 } },
      exit: { y: 50, opacity: 0, transition: { duration: 0.3, ease: "easeIn" } }
   };


  return (
    <AnimatePresence> {/* Enables exit animations */}
      {isOpen && (
        // Overlay using Framer Motion
        <motion.div
          className="fixed inset-0 bg-black/80 backdrop-blur-lg flex items-center justify-center z-[100] p-4"
          onClick={onClose}
          variants={backdropVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          {/* Modal Content using Framer Motion */}
          <motion.div
            className="bg-gradient-to-br from-slate-800 via-slate-900 to-black dark:from-slate-800 dark:via-slate-900 dark:to-black rounded-xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto p-6 md:p-8 relative border border-slate-700/80"
            onClick={(e) => e.stopPropagation()}
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-red-500 hover:bg-slate-700/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-red-500 transition-all duration-300 transform hover:rotate-90"
              aria-label="Close modal"
            >
              <FaTimes size={20} />
            </button>

            {/* Modal Header */}
            <div className="mb-6">
              <h2 className="text-3xl md:text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-400 to-indigo-400 tracking-tight">
                 {name} {desig && `(${desig})`}
              </h2>
              {englishName && (
                  <p className="text-lg text-slate-400 italic">
                      {englishName}
                  </p>
              )}
            </div>

            {/* Modal Body */}
            <div className="space-y-4 text-slate-300 text-base leading-relaxed"> {/* Increased line spacing */}
              {info && <p>{info}</p>}
              <p><span className="font-semibold text-slate-400">Rank:</span> {rank}</p>

              {/* Coordinates Section */}
              <div className="mt-6 pt-4 border-t border-slate-700/70 text-center">
                  <p className="text-sm text-slate-500">Approx. Center Coordinates</p>
                  <p className="text-lg font-mono text-cyan-300">
                      RA: {ra}°   /   Dec: {dec}°
                  </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ConstellationModal;

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos