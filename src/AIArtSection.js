import React from 'react';
import GenAITimeline from './GenAITimeline';
import genAITimeline from './timelineData';

const AIArtSection = () => {
  return (
    <div id="ai-art" className="container mx-auto px-4 py-16">
      <GenAITimeline
        items={genAITimeline}
        heading="Generative AI Art Timeline"
        intro="A visual walk-through of the generative systems I've built, fine-tuned, and experimented with since 2021."
      />
    </div>
  );
};

export default AIArtSection;
