import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const FOCUSABLE_SELECTORS = [
  'a[href]',
  'button:not([disabled])',
  'textarea',
  'input',
  'select',
  '[tabindex]:not([tabindex="-1"])',
].join(', ');

const ProjectModal = ({ project, onClose }) => {
  const modalRef = useRef(null);
  const previouslyFocusedElement = useRef(null);

  useEffect(() => {
    previouslyFocusedElement.current = document.activeElement;

    const getFocusableElements = () => {
      if (!modalRef.current) {
        return [];
      }

      return Array.from(modalRef.current.querySelectorAll(FOCUSABLE_SELECTORS)).filter(
        (element) => !element.hasAttribute('disabled') && element.getAttribute('tabindex') !== '-1'
      );
    };

    const focusableElements = getFocusableElements();
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    } else if (modalRef.current) {
      modalRef.current.focus();
    }

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === 'Tab') {
        const focusable = getFocusableElements();
        if (focusable.length === 0) {
          event.preventDefault();
          return;
        }

        const currentIndex = focusable.indexOf(document.activeElement);
        if (event.shiftKey) {
          if (currentIndex <= 0) {
            event.preventDefault();
            focusable[focusable.length - 1].focus();
          }
        } else {
          if (currentIndex === focusable.length - 1) {
            event.preventDefault();
            focusable[0].focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      if (previouslyFocusedElement.current && previouslyFocusedElement.current.focus) {
        previouslyFocusedElement.current.focus();
      }
    };
  }, [onClose]);

  const handleOverlayMouseDown = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  const titleId = `project-modal-title-${project.id}`;

  return (
    <div className="project-modal-overlay" onMouseDown={handleOverlayMouseDown}>
      <div
        className="project-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        ref={modalRef}
        tabIndex={-1}
      >
        <button type="button" className="project-modal-close" onClick={onClose}>
          Close
        </button>
        <div className="project-modal-body">
          <h2 id={titleId}>{project.title}</h2>
          <p className="project-modal-summary">{project.description}</p>

          <section className="project-modal-section">
            <h3>Challenge</h3>
            <p>{project.challenge}</p>
          </section>

          <section className="project-modal-section">
            <h3>Approach</h3>
            <p>{project.approach}</p>
          </section>

          <section className="project-modal-section">
            <h3>Impact</h3>
            <p>{project.impact}</p>
          </section>

          {project.stack && project.stack.length > 0 && (
            <section className="project-modal-section">
              <h3>Stack</h3>
              <ul className="project-modal-stack">
                {project.stack.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          <div className="project-modal-links">
            {project.link && (
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                Visit project
              </a>
            )}
            {project.githubRepo && (
              <a href={project.githubRepo} target="_blank" rel="noopener noreferrer">
                View on GitHub
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

ProjectModal.propTypes = {
  project: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    image: PropTypes.string,
    link: PropTypes.string,
    githubRepo: PropTypes.string,
    challenge: PropTypes.string.isRequired,
    approach: PropTypes.string.isRequired,
    impact: PropTypes.string.isRequired,
    stack: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default ProjectModal;
