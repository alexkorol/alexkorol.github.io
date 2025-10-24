import React from 'react';
import { Link } from 'react-router-dom';
import GenAITimeline from './GenAITimeline';
import genAITimeline from './timelineData';

const AIArtSection = () => {
  return (
    <div id="ai-art" className="container mx-auto px-4 py-16">
      <GenAITimeline
        items={genAITimeline}
        heading="Generative AI Art Timeline"
        intro="A visual walk-through of the generative systems I've built, fine-tuned, and experimented with since 2021."
        cta={(
          <Link className="timeline-link" to="/ai-art/timeline">
            View the full AI art story
          </Link>
        )}
      />
    </div>
  );
};

export default AIArtSection;
