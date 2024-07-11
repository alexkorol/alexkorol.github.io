import React, { useState, useEffect } from 'react';
import './App.css';
import AIArtSection from './AIArtSection';
import Projects from './Projects';
import HomeSection from './HomeSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faProjectDiagram, faPalette, faArchive, faSun, faMoon } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [darkMode, setDarkMode] = useState(false);

  const navItems = [
    { name: 'Home', icon: faHome },
    { name: 'Projects', icon: faProjectDiagram },
    { name: 'AI Art', icon: faPalette },
    { name: 'SREF Vault', icon: faArchive, link: 'https://alexkorol.github.io/seedvault' }
  ];

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
<nav className="navbar">
  <div className="navbar-container">
    <div className="navbar-items">
      <div className="main-nav-items">
        {navItems.map((item) => (
          <button
            key={item.name}
            className={`navbar-button ${
              activeSection === item.name.toLowerCase() ? 'active' : ''
            }`}
            onClick={() => {
              if (item.link) {
                window.open(item.link, '_blank');
              } else {
                setActiveSection(item.name.toLowerCase());
              }
            }}
            data-name={item.name}
          >
            <FontAwesomeIcon icon={item.icon} className="mr-2" />
            {item.name} {item.link && <span>↗</span>}
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
        {renderSection(activeSection)}
      </main>
    </div>
  );
}

export default App;
