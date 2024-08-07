import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import Card from './Card';


const Projects = () => {
  const projects = [
    {
      title: 'Repo2GPT',
      description: 'Python script to summarize local and GitHub projects into a doc form usable for LLM-assisted programming and code review. This tool streamlines the process of converting repository contents into a format that can be easily processed by language models, enhancing the efficiency of AI-assisted development and code analysis.',
      image: '/images/projects/repo2gpt.png',
      link: 'https://github.com/alexkorol/repo2GPT',
    },
    {
      title: 'SREF Seed Vault',
      description: 'Midjourney v6 Style Reference Seed # Catalog with image examples and tags. This project provides a comprehensive collection of style references for Midjourney v6, allowing users to explore various artistic styles and their corresponding seed numbers. It serves as a valuable resource for AI art enthusiasts and creators.',
      image: '/images/projects/seedvault.png',
      link: 'https://alexkorol.github.io/seedvault',
      githubRepo: 'https://github.com/alexkorol/seedvault',
    },
  ];

  return (
      <div>
        <h1 className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          My Projects
        </h1>
        <div className="card-container-projects grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project, index) => (
            <Card key={index} title={project.title} content={
              <div className="flex flex-col h-full">
                <img src={project.image} alt={project.title} className="w-full h-auto max-h-48 object-cover mb-4 rounded-t-lg" />
                <p className="mb-4 flex-grow">{project.description}</p>
                {project.githubRepo ? (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="get-in-touch-button" style={{ marginRight: '1rem' }}>
                    View Project <FontAwesomeIcon icon={faExternalLinkAlt} className="external-link-icon" />
                  </a>
                ) : (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="get-in-touch-button">
                    GitHub <FontAwesomeIcon icon={faExternalLinkAlt} className="external-link-icon" />
                  </a>
                )}
                {project.githubRepo && (
                  <a href={project.githubRepo} target="_blank" rel="noopener noreferrer" className="get-in-touch-button">
                    <FontAwesomeIcon icon={faGithub} /> GitHub
                  </a>
                )}
              </div>
            } className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full" />
          ))}
        </div>
      </div>
    );
  };
  
  export default Projects;
