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
  const [scrollProgress, setScrollProgress] = useState(0);
  const [footerVisible, setFooterVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const navItems = ['Home', 'Projects', 'AI Art', 'SREF Vault'];

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.pageYOffset;
      setScrollProgress((currentScroll / totalScroll) * 100);

      if (currentScroll + window.innerHeight >= document.documentElement.scrollHeight) {
        setFooterVisible(true);
      } else {
        setFooterVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="fixed top-0 left-0 h-1 bg-blue-500" style={{ width: `${scrollProgress}%` }} />
      
      <nav className="sticky top-0 bg-white dark:bg-gray-800 shadow-md z-10">
        <div className="container mx-auto px-6 py-3 flex justify-between items-center">
          <div className="flex justify-center space-x-6">
            {navItems.map((item) => (
              <button
                key={item}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                  activeSection === item.toLowerCase()
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'text-navbar-button dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
                onClick={() => {
                  if (item === 'SREF Vault') {
                    window.open('https://alexkorol.github.io/seedvault', '_blank');
                  } else if (item === 'Get in Touch') {
                    // Handle the 'Get in Touch' button click
                  } else {
                    setActiveSection(item.toLowerCase());
                  }
                }}
              >
                {item === 'Home' ? 'Home' : item} {item === 'SREF Vault' && <span>↗</span>}
              </button>
            ))}
          </div>
          <button
            className="text-gray-600 dark:text-gray-300 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? <FontAwesomeIcon icon={faSun} /> : <FontAwesomeIcon icon={faMoon} />}
          </button>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16">
        {activeSection === 'get in touch' ? (
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">Get in Touch</h1>
            <p>
              <a href="https://www.linkedin.com/in/alexei-korol/" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faLinkedin} className="mr-2" />
              </a>
              <a href="https://github.com/alexkorol" target="_blank" rel="noopener noreferrer">
                <FontAwesomeIcon icon={faGithub} className="mr-2" />
              </a>
              <a href="mailto:korolalexei@gmail.com">
                <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
              </a>
            </p>
          </div>
        ) : (
          renderSection(activeSection)
        )}
      </main>

    </div>
  );
}

export default App;
