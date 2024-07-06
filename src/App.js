import React, { useState, useEffect } from 'react';
import './App.css';
import Card from './Card';
import AIArtSection from './AIArtSection';
import Projects from './Projects';
import HomeSection from './HomeSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [darkMode, setDarkMode] = useState(false);

  const navItems = ['Home', 'Projects', 'AI Art', 'SREF Vault'];

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  const renderSection = (section) => {
    switch (section) {
      case 'projects':
        return <Projects />;
      case 'ai art':
        return <AIArtSection />;
      default:
        return <HomeSection />;
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="navbar sticky top-0 z-10 w-full">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex space-x-4">
            {navItems.map((item) => (
              <button
                key={item}
                className={`navbar-button ${
                  activeSection === item.toLowerCase() ? 'active' : ''
                }`}
                onClick={() => {
                  if (item === 'SREF Vault') {
                    window.open('https://alexkorol.github.io/seedvault', '_blank');
                  } else {
                    setActiveSection(item.toLowerCase());
                  }
                }}
              >
                {item} {item === 'SREF Vault' && <span> ↗</span>}
              </button>
            ))}
          </div>
          <button
            className="navbar-button"
            onClick={() => setDarkMode(!darkMode)}
          >
            <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16">
        {renderSection(activeSection)}
      </main>
    </div>
  );
}

export default App;