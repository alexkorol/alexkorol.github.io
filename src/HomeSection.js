import React from 'react';
import Card from './Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

const HomeSection = () => {
  const cards = [
    { title: 'About Me', content: 'Software engineer passionate about AI and blockchain.' },
    {
      title: 'Skills',
      content: (
        <ul>
          <li>React</li>
          <li>Node.js</li>
          <li>Python</li>
          <li>Machine Learning</li>
          <li>Data Analysis with Pandas, Numpy, Matplotlib</li>
          <li>API Integration</li>
          <li>Git</li>
          <li>Jupyter Notebooks</li>
        </ul>
      )
    },
    {
      title: 'Experience',
      content: (
        <ul>
          <li>5+ years in full-stack development and AI research</li>
          <li>Developed a devops python script for automating code review with LLMs</li>
          <li>Creating Python script to scrape Instagram for images to create datasets for machine learning</li>
          <li>Homework Helper app with multiple inputs and OpenAI API</li>
          <li>Quiz Helper app with OCR and OpenAI APIs</li>
        </ul>
      )
    },
    {
      title: 'Projects',
      content: (
        <ul>
          <li>Repo2GPT: Python script to summarize local and GitHub projects into a doc form usable for LLM-assisted programming and code review</li>
          <li>SREF Seed Vault: Midjourney v6 Style Reference Seed # Catalog with image examples and tags</li>
        </ul>
      )
    },
    {
      title: 'Certifications',
      content: (
        <ul>
          <li>MS AI-102: Azure AI Engineer Associate Certified</li>
          <li>MS AI-900: AI Fundamentals Certified</li>
          <li>Certified in Career Essentials in Generative AI by Microsoft and LinkedIn</li>
        </ul>
      )
    },
    { 
      title: 'Get in Touch', 
      content: (
        <div>
          <a href="https://www.linkedin.com/in/your-linkedin-profile" target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-300 hover:underline">
            <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
          </a>
          <a href="https://github.com/your-github-profile" target="_blank" rel="noopener noreferrer" className="text-blue-500 dark:text-blue-300 hover:underline">
            <FontAwesomeIcon icon={faGithub} /> GitHub
          </a>
          <a href="mailto:your-email@example.com" className="text-blue-500 dark:text-blue-300 hover:underline">
            <FontAwesomeIcon icon={faEnvelope} /> Email
          </a>
        </div>
      )
    },
  ];

  return (
    <div className="home-section">
      <h1 className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
        Welcome to My Portfolio
      </h1>
      <div className="card-container">
        {cards.map((card, index) => (
          <Card key={index} title={card.title} content={card.content} />
        ))}
      </div>
    </div>
  );
};

export default HomeSection;
