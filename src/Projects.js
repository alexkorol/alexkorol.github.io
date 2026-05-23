import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUpRightFromSquare, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { faGithub } from '@fortawesome/free-brands-svg-icons';
import projects from './data/projects';
import ProjectModal from './components/ProjectModal';
import './Projects.css';

const Projects = ({ featuredOnly = false }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const visibleProjects = featuredOnly ? projects.slice(0, 4) : projects;

  return (
    <section id="projects" data-section="projects" className="projects-section">
      <div className="section-kicker">Selected work</div>
      <div className="section-header-row">
        <div>
          <h1 className="section-heading">Systems with fingerprints.</h1>
          <p className="section-subheading">
            Recent projects from GitHub and local work: RAG, repo tooling, game systems, visual QA, and creative data.
          </p>
        </div>
        {!featuredOnly && (
          <a className="quiet-link" href="https://github.com/alexkorol" target="_blank" rel="noopener noreferrer">
            GitHub profile <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </a>
        )}
      </div>

      <div className="project-grid">
        {visibleProjects.map((project) => (
          <article className="project-card" key={project.id}>
            <div className="project-visual">
              {project.image ? (
                <img src={project.image} alt="" loading="lazy" />
              ) : (
                <div className="project-visual-fallback" aria-hidden="true">
                  <span>{project.title.slice(0, 2)}</span>
                </div>
              )}
            </div>
            <div className="project-body">
              <div className="project-meta-row">
                <span>{project.kicker}</span>
                <span>{project.status}</span>
              </div>
              <h2>{project.title}</h2>
              <p>{project.description}</p>
              <ul className="project-metrics">
                {project.metrics?.slice(0, 3).map((metric) => (
                  <li key={metric}>{metric}</li>
                ))}
              </ul>
            </div>
            <div className="project-actions">
              <button
                type="button"
                className="project-case-study-button"
                onClick={() => setSelectedProject(project)}
                aria-haspopup="dialog"
                aria-expanded={selectedProject?.id === project.id}
              >
                <FontAwesomeIcon icon={faMagnifyingGlass} /> Case study
              </button>
              <div className="project-card-links">
                {project.link && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} link`}>
                    <FontAwesomeIcon icon={project.githubRepo ? faArrowUpRightFromSquare : faGithub} />
                  </a>
                )}
                {project.githubRepo && (
                  <a href={project.githubRepo} target="_blank" rel="noopener noreferrer" aria-label={`${project.title} source`}>
                    <FontAwesomeIcon icon={faGithub} />
                  </a>
                )}
              </div>
            </div>
          </article>
        ))}
      </div>

      {selectedProject && <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </section>
  );
};

export default Projects;
