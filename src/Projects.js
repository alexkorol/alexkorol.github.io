import React from 'react';
import Card from './Card';

const Projects = () => {
  const projects = [
    {
      title: 'AI Art Generator',
      description: 'A web application that generates AI-driven art based on user inputs.',
    },
    {
      title: 'SREF Code Analyzer',
      description: 'A tool that analyzes code quality and suggests improvements for SREF projects.',
    },
    {
      title: 'Portfolio Website',
      description: 'A personal portfolio website showcasing projects and skills.',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-8 mb-12 card-container">
      {projects.map((project, index) => (
        <Card key={index} className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300">
          <h2 className="text-2xl font-semibold">{project.title}</h2>
          <p>{project.description}</p>
        </Card>
      ))}
    </div>
  );
};

export default Projects;
