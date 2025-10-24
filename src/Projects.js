import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import Card from './Card';
import projects from './data/projects';
import ProjectModal from './components/ProjectModal';
import './Projects.css';


const Projects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const handleOpenModal = (project) => {
    setSelectedProject(project);
  };

  const handleCloseModal = () => {
    setSelectedProject(null);
  };

  return (
      <div>
        <h1 className="text-5xl font-bold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">
          My Projects
        </h1>
        <div className="card-container-projects grid grid-cols-1 md:grid-cols-2 gap-6">
          {projects.map((project) => (
            <Card key={project.id} title={project.title} content={
              <div className="flex flex-col h-full">
                <img src={project.image} alt={project.title} className="w-full h-auto max-h-48 object-cover mb-4 rounded-t-lg" />
                <p className="mb-4 flex-grow">{project.description}</p>
                <div className="project-card-actions mt-auto">
                  <button
                    type="button"
                    className="project-case-study-button"
                    onClick={() => handleOpenModal(project)}
                    aria-haspopup="dialog"
                    aria-expanded={selectedProject?.id === project.id}
                  >
                    View case study
                  </button>
                  <div className="project-card-links">
                    {project.link && (
                      <a
                        href={project.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="get-in-touch-button"
                      >
                        {project.githubRepo ? 'View Project' : 'GitHub'}{' '}
                        <FontAwesomeIcon icon={faExternalLinkAlt} className="external-link-icon" />
                      </a>
                    )}
                    {project.githubRepo && (
                      <a
                        href={project.githubRepo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="get-in-touch-button"
                      >
                        <FontAwesomeIcon icon={faGithub} /> GitHub
                      </a>
                    )}
                  </div>
                </div>
              </div>
            } className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col h-full" />
          ))}
        </div>
        {selectedProject && (
          <ProjectModal project={selectedProject} onClose={handleCloseModal} />
        )}
      </div>
    );
  };

  export default Projects;
