import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import AIArtSection from './AIArtSection';
import Projects from './Projects';
import HomeSection from './HomeSection';
import GenAITimelinePage from './pages/GenAITimelinePage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faProjectDiagram, faPalette, faArchive, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', icon: faHome, path: '/' },
    { name: 'Projects', icon: faProjectDiagram, path: '/projects' },
    { name: 'AI Art', icon: faPalette, path: '/ai-art' },
    { name: 'SREF Vault', icon: faArchive, external: 'https://alexkorol.github.io/seedvault' }
  ];

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const isActive = (item) => {
    if (item.external) {
      return false;
    }

    if (item.path === '/') {
      return location.pathname === '/' || location.pathname === '';
    }

    return location.pathname.startsWith(item.path);
  };

  const handleNavClick = (item) => {
    if (item.external) {
      window.open(item.external, '_blank', 'noopener,noreferrer');
      return;
    }

    navigate(item.path);
  };

  return (
    <div className="min-h-screen">
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-items">
            <div className="main-nav-items">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  className={`navbar-button ${isActive(item) ? 'active' : ''}`}
                  onClick={() => handleNavClick(item)}
                  data-name={item.name}
                >
                  <FontAwesomeIcon icon={item.icon} className="mr-2" />
                  {item.name} {item.external && <span>↗</span>}
                </button>
              ))}
            </div>
            <div className="utility-nav-items">
              <button
                className="navbar-button"
                onClick={() => setDarkMode(!darkMode)}
              >
                <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16">
        <Routes>
          <Route path="/" element={<HomeSection />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/ai-art" element={<AIArtSection />} />
          <Route path="/ai-art/timeline" element={<GenAITimelinePage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
