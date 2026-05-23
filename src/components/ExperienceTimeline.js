import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './ExperienceTimeline.css';

gsap.registerPlugin(ScrollTrigger);

const ExperienceTimeline = ({ experiences, heading, intro }) => {
  const timelineRef = useRef(null);

  useEffect(() => {
    if (!timelineRef.current) return;

    const ctx = gsap.context(() => {
      const items = gsap.utils.toArray('.experience-timeline-item');
      gsap.set(items, { opacity: 0, y: 60 });

      items.forEach((item) => {
        gsap.to(item, {
          opacity: 1,
          y: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          }
        });
      });

      const axes = gsap.utils.toArray('.experience-timeline-axis');
      axes.forEach((axis) => {
        gsap.fromTo(
          axis,
          { height: '0%' },
          {
            height: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: timelineRef.current,
              start: 'top 70%',
              end: 'bottom 40%',
              scrub: true
            }
          }
        );
      });
    }, timelineRef);

    return () => ctx.revert();
  }, [experiences]);

  return (
    <section className="experience-timeline-wrapper">
      {heading && <h2 className="section-heading text-center">{heading}</h2>}
      {intro && <p className="section-subheading text-center">{intro}</p>}
      <div className="experience-timeline" ref={timelineRef}>
        <div className="experience-timeline-axis" aria-hidden="true" />
        {experiences.map((experience, index) => (
          <article
            className={`experience-timeline-item ${index % 2 !== 0 ? 'is-reversed' : ''}`}
            key={`${experience.role}-${experience.organization}`}
          >
            <span className="experience-node" aria-hidden="true" />
            <div className="experience-card">
              <header className="experience-card-header">
                <span className="experience-dates">{experience.dates}</span>
                <h3 className="experience-role">{experience.role}</h3>
                <p className="experience-organization">{experience.organization}</p>
              </header>
              <ul className="experience-highlights">
                {experience.highlights.map((highlight, highlightIndex) => (
                  <li key={highlightIndex}>{highlight}</li>
                ))}
              </ul>
              {experience.metrics && (
                <dl className="experience-metrics">
                  {Object.entries(experience.metrics).map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

ExperienceTimeline.propTypes = {
  experiences: PropTypes.arrayOf(
    PropTypes.shape({
      role: PropTypes.string.isRequired,
      organization: PropTypes.string.isRequired,
      dates: PropTypes.string.isRequired,
      highlights: PropTypes.arrayOf(PropTypes.string).isRequired,
      metrics: PropTypes.shape({
        scope: PropTypes.string,
        proof: PropTypes.string,
        stack: PropTypes.string
      })
    })
  ).isRequired,
  heading: PropTypes.string,
  intro: PropTypes.string
};

ExperienceTimeline.defaultProps = {
  heading: '',
  intro: ''
};

export default ExperienceTimeline;
