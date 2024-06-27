import React, { useState, useEffect } from 'react';
import './App.css';
import Card from './Card';
import CardHeader from './CardHeader';
import CardContent from './CardContent';
import AIArtSection from './AIArtSection';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);
  const [footerVisible, setFooterVisible] = useState(false);

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

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="fixed top-0 left-0 h-1 bg-blue-500" style={{ width: `${scrollProgress}%` }} />
      
      <nav className="sticky top-0 bg-white dark:bg-gray-800 shadow-md z-10">
        <div className="container mx-auto px-6 py-3">
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
                  } else {
                    setActiveSection(item.toLowerCase());
                  }
                }}
              >
                {item === 'Home' ? 'Start' : item} {item === 'SREF Vault' && <span>↗</span>}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-16">
        {activeSection === 'projects' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Projects</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {['AI Art Generator', 'SREF Code Analyzer', 'Portfolio Website'].map((project, index) => (
                    <div key={index} className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg flex-grow">
                      <h3 className="font-semibold mb-2">{project}</h3>
                      <p className="text-sm">Brief description of the project and its impact.</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {activeSection === 'ai art' && <AIArtSection />}

        {activeSection !== 'projects' && activeSection !== 'ai art' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <h2 className="text-2xl font-semibold">About Me</h2>
              </CardHeader>
              <CardContent>
                <p>Innovative software developer with a passion for AI, web technologies, and pushing the boundaries of what's possible in tech. Always exploring new frontiers in code and creativity.</p>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Skills & Certifications</h2>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5">
                  <li>Python</li>
                  <li>Azure AI-102</li>
                  <li>Generative AI</li>
                  <li>React</li>
                  <li>Node.js</li>
                  <li>DevOps</li>
                  {/* Add more skills and certifications as needed */}
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 flex-grow">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Recent Projects</h2>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
                  {['AI Art Generator', 'SREF Code Analyzer', 'Portfolio Website'].map((project, index) => (
                    <div key={index} className="bg-gray-200 dark:bg-gray-700 p-4 rounded-lg flex-grow">
                      <h3 className="font-semibold mb-2">{project}</h3>
                      <p className="text-sm">Brief description of the project and its impact.</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 flex-grow">
              <CardHeader>
                <h2 className="text-2xl font-semibold">Get in Touch</h2>
              </CardHeader>
              <CardContent>
                <p>Feel free to reach out to us for any inquiries or collaborations.</p>
                <div className="flex flex-col space-y-2">
                  <a href="https://linkedin.com/in/alexei-korol/" target="_blank" rel="noopener noreferrer" className="custom-link flex items-center">
                    <FontAwesomeIcon icon={faLinkedin} className="mr-2" /> LinkedIn
                  </a>
                  <a href="https://github.com/alexkorol" target="_blank" rel="noopener noreferrer" className="custom-link flex items-center">
                    <FontAwesomeIcon icon={faGithub} className="mr-2" /> GitHub
                  </a>
                  <a href="mailto:korolalexei@gmail.com" target="_blank" rel="noopener noreferrer" className="custom-link flex items-center">
                    <FontAwesomeIcon icon={faEnvelope} className="mr-2" /> Email
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      <footer className="text-center p-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 mt-12">
        <p>&copy; 2024 Alex Korol.</p>
      </footer>
    </div>
  );
}

export default App;
