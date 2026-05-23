import React from 'react';
import { Link } from 'react-router-dom';
import GenAITimeline from './GenAITimeline';
import genAITimeline from './timelineData';

const AIArtSection = () => {
  return (
    <section id="ai-art" data-section="ai-art" className="ai-art-route">
      <GenAITimeline
        items={genAITimeline}
        heading="Visual timeline"
        intro="A cleaned-up archive of generative image experiments. No carousel, no theatrics, just the progression."
        cta={(
          <Link className="timeline-link" to="/ai-art/timeline">
            Open full-screen archive
          </Link>
        )}
      />
    </section>
  );
};

export default AIArtSection;
