import React, { useEffect, useState } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFlask,
  faHome,
  faMoon,
  faPalette,
  faProjectDiagram,
  faSun,
} from '@fortawesome/free-solid-svg-icons';
import './App.css';
import AIArtSection from './AIArtSection';
import Projects from './Projects';
import HomeSection from './HomeSection';
import GenAITimelinePage from './pages/GenAITimelinePage';
import LabNotesSection from './components/LabNotesSection';

const NAV_ITEMS = [
  { name: 'Home', icon: faHome, path: '/' },
  { name: 'Projects', icon: faProjectDiagram, path: '/projects' },
  { name: 'Visual Timeline', icon: faPalette, path: '/ai-art' },
  { name: 'Lab Notes', icon: faFlask, path: '/lab-notes' },
];

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return true;
    }

    try {
      const storedPreference = window.localStorage.getItem('darkMode');
      if (storedPreference !== null) {
        return storedPreference === 'true';
      }

      if (window.matchMedia) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
      }
    } catch (error) {
      return true;
    }

    return true;
  });

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.toggle('dark', darkMode);

    try {
      window.localStorage.setItem('darkMode', darkMode.toString());
    } catch (error) {
      // Local storage can fail in private modes.
    }
  }, [darkMode]);

  const isActive = (item) => {
    if (item.path === '/') {
      return location.pathname === '/' || location.pathname === '';
    }

    return location.pathname.startsWith(item.path);
  };

  return (
    <div className="app-shell">
      <nav className="navbar">
        <div className="navbar-container">
          <button type="button" className="brand-mark" onClick={() => navigate('/')}>
            <span>AK</span>
            <strong>Alexei Korol</strong>
          </button>

          <div className="navbar-items">
            <div className="main-nav-items">
              {NAV_ITEMS.map((item) => (
                <button
                  key={item.name}
                  type="button"
                  className={`navbar-button ${isActive(item) ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <FontAwesomeIcon icon={item.icon} />
                  {item.name}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="theme-toggle"
              onClick={() => setDarkMode((prev) => !prev)}
              aria-label={darkMode ? 'Activate light mode' : 'Activate dark mode'}
            >
              <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
            </button>
          </div>
        </div>
      </nav>

      <main className="site-main">
        <Routes>
          <Route path="/" element={<HomeSection />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/ai-art" element={<AIArtSection />} />
          <Route path="/lab-notes" element={<LabNotesSection />} />
          <Route path="/ai-art/timeline" element={<GenAITimelinePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
