// src/App.jsx
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import Scene from './components/Scene';
import ConstellationModal from './components/ConstellationModal';

function App() {
  // Theme Management
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return savedTheme || (prefersDark ? 'dark' : 'light');
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    } else {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  }, []);

  // Modal and Selection Management
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [selectedConstellationId, setSelectedConstellationId] = useState(null); // State lives here

  // Called by Scene when a constellation is clicked
  const handleConstellationClick = useCallback((constellationFeature) => {
    setModalData(constellationFeature);
    // setSelectedConstellationId(constellationFeature.id); // This is now set directly in SceneContent via prop
    setIsModalOpen(true);
  }, []);

  // Called by Modal or Scene background click (via setSelectedConstellationId prop)
  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedConstellationId(null); // Deselect when modal closes
    setTimeout(() => setModalData(null), 300); // Delay clearing data for animation
  }, []);

  // Handler specifically for setting the selected ID (passed to Scene)
   const handleSetSelectedId = useCallback((id) => {
        setSelectedConstellationId(id);
    }, []);

  return (
    <div className="relative min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900">
      <Header
        title="Constellation Map"
        creator="Ram Bapat"
        theme={theme}
        toggleTheme={toggleTheme}
      />

      <main className="flex-grow relative">
         {/* Pass selected state and setter down to Scene */}
         <Scene
            onConstellationClick={handleConstellationClick}
            selectedConstellationId={selectedConstellationId}
            setSelectedConstellationId={handleSetSelectedId} // Pass the setter function
         />
      </main>

      <ConstellationModal
        isOpen={isModalOpen}
        onClose={closeModal}
        data={modalData}
      />

      <Footer />
    </div>
  );
}

export default App;

// Created by Ram Bapat, www.linkedin.com/in/ram-bapat-barrsum-diamos
