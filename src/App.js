import React, { useState, useEffect, useMemo } from 'react';
import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import AIArtSection from './AIArtSection';
import Projects from './Projects';
import HomeSection from './HomeSection';
import GenAITimelinePage from './pages/GenAITimelinePage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faProjectDiagram,
  faPalette,
  faArchive,
  faFlask,
  faSun,
  faMoon,
} from '@fortawesome/free-solid-svg-icons';
import LabNotesSection from './components/LabNotesSection';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
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
      // If accessing localStorage fails, fall back to light mode.
    }

    return false;
  });

  const navItems = useMemo(
    () => [
      { name: 'Home', icon: faHome, id: 'home' },
      { name: 'Projects', icon: faProjectDiagram, id: 'projects' },
      { name: 'AI Art', icon: faPalette, id: 'ai-art' },
      { name: 'SREF Vault', icon: faArchive, link: 'https://alexkorol.github.io/seedvault' }
    ],
    []
  );
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', icon: faHome },
    { name: 'Projects', icon: faProjectDiagram },
    { name: 'AI Art', icon: faPalette },
    { name: 'Lab Notes', icon: faFlask },
    { name: 'SREF Vault', icon: faArchive, link: 'https://alexkorol.github.io/seedvault' }
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

    try {
      window.localStorage.setItem('darkMode', darkMode.toString());
    } catch (error) {
      // Ignore storage errors (e.g., privacy modes).
    }
  }, [darkMode]);

  useEffect(() => {
    const navSectionIds = navItems.filter((item) => item.id).map((item) => item.id);
    const sections = navSectionIds
      .map((id) => document.getElementById(id))
      .filter((section) => section !== null);

    if (!sections.length) {
      return undefined;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntry = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry?.target?.id) {
          setActiveSection(visibleEntry.target.id);
        }
      },
      {
        threshold: [0.25, 0.5, 0.75],
        rootMargin: '-30% 0px -45% 0px'
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, [navItems]);

  useEffect(() => {
    const navSectionIds = navItems.filter((item) => item.id).map((item) => item.id);

    const syncSectionFromHash = (hashValue) => {
      const normalizedHash = hashValue.replace('#', '') || 'home';

      if (navSectionIds.includes(normalizedHash)) {
        setActiveSection(normalizedHash);

        const section = document.getElementById(normalizedHash);
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    };

    syncSectionFromHash(window.location.hash);

    const handleHashChange = () => {
      syncSectionFromHash(window.location.hash);
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, [navItems]);

  const handleNavClick = (item) => {
    if (item.link) {
      window.open(item.link, '_blank');
      return;
    }

    if (!item.id) {
      return;
    }

    setActiveSection(item.id);

    const targetHash = `#${item.id}`;
    if (window.location.hash !== targetHash) {
      window.history.pushState(null, '', targetHash);
    }

    const section = document.getElementById(item.id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
  const renderSection = (section) => {
    switch (section) {
      case 'projects':
        return <Projects />;
      case 'ai art':
        return <AIArtSection />;
      case 'lab notes':
        return <LabNotesSection />;
      default:
        return <HomeSection />;
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
                  className={`navbar-button ${
                    item.id && activeSection === item.id ? 'active' : ''
                  }`}
                  className={`navbar-button ${isActive(item) ? 'active' : ''}`}
                  onClick={() => handleNavClick(item)}
                  data-name={item.name}
                >
                  <FontAwesomeIcon icon={item.icon} className="mr-2" />
                  {item.name} {item.link && <span>↗</span>}
                  {item.name} {item.external && <span>↗</span>}
                </button>
              ))}
            </div>
            <div className="utility-nav-items">
              <button
                className="navbar-button"
                onClick={() => setDarkMode((prev) => !prev)}
                onClick={() => setDarkMode(!darkMode)}
              >
                <FontAwesomeIcon icon={darkMode ? faSun : faMoon} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <HomeSection />
        <Projects />
        <AIArtSection />
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
