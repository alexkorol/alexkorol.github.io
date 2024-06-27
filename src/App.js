import React, { useState, useEffect } from 'react';
import './App.css';
import Card from './Card';
import CardHeader from './CardHeader';
import CardContent from './CardContent';
import Alert from './Alert';
import AlertDescription from './AlertDescription';

function App() {
  const [activeSection, setActiveSection] = useState('home');
  const [scrollProgress, setScrollProgress] = useState(0);

  const navItems = ['Home', 'Projects', 'AI Art', 'SREF Vault'];

  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      const currentScroll = window.pageYOffset;
      setScrollProgress((currentScroll / totalScroll) * 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const skillData = [
    { name: 'React', value: 90 },
    { name: 'Node.js', value: 85 },
    { name: 'Python', value: 80 },
    { name: 'AI/ML', value: 75 },
    { name: 'DevOps', value: 70 },
  ];

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
                  if (item === 'Projects') {
                    window.location.href = 'https://alexkorol.github.io/projects';
                  } else if (item === 'AI Art') {
                    window.location.href = 'https://alexkorol.github.io/aiart';
                  } else {
                    setActiveSection(item.toLowerCase());
                  }
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-6 py-12">
        <h1 className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          Alex Korol
        </h1>
        
        <Alert className="mb-12 border-blue-500 bg-blue-500 bg-opacity-10">
          <AlertDescription className="text-lg">
            Thank you for visiting my site I'm a software developer pushing the boundaries of technology and creativity.
          </AlertDescription>
        </Alert>

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
          <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 flex-grow md:col-span-2">
            <CardHeader>
              <h2 className="text-2xl font-semibold">Recent Projects</h2>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
              <h2 className="text-2xl font-semibold">Additional Info</h2>
            </CardHeader>
            <CardContent>
              <p>This is some additional information to fill the gap.</p>
            </CardContent>
          </Card>

        </div>


        <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 mb-16">
          <CardHeader>
            <h2 className="text-2xl font-semibold">Get in Touch</h2>
          </CardHeader>
          <CardContent>
            <p className="mb-2">Email: alexkorol@gmail.com</p>
            <p className="mb-2">GitHub: @alexkorol</p>
            <p>LinkedIn: in/alexkorol</p>
          </CardContent>
        </Card>
      </main>

      <footer className="text-center p-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400">
        <p>&copy; 2024 Alex Korol. </p>
      </footer>
    </div>
  );
}

export default App;
