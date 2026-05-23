import React, { useMemo } from 'react';
import './Timeline.css';

const GenAITimeline = ({
  items,
  limit,
  heading,
  intro,
  cta,
  activeFilters,
  onImageClick
}) => {
  const timelineItems = useMemo(() => (limit ? items.slice(0, limit) : items), [items, limit]);
  const activeTools = activeFilters?.tools ?? [];
  const activeMediums = activeFilters?.mediums ?? [];

  const handleImageSelect = (item, imgIndex) => {
    if (typeof onImageClick === 'function') {
      onImageClick(item, imgIndex);
    }
  };

  return (
    <section className="timeline-showcase">
      {heading && <h2 className="section-heading text-center">{heading}</h2>}
      {intro && <p className="section-subheading text-center">{intro}</p>}

      <div className="timeline-grid">
        {timelineItems.map((item) => (
          <article className="timeline-card" key={`${item.title}-${item.date}`}>
            <div className="timeline-image-grid">
              {item.images.slice(0, 4).map((image, imgIndex) => {
                const interactive = typeof onImageClick === 'function';

                return (
                  <button
                    type="button"
                    key={image}
                    className="timeline-image-button"
                    onClick={interactive ? () => handleImageSelect(item, imgIndex) : undefined}
                    disabled={!interactive}
                    aria-label={`Open ${item.title} image ${imgIndex + 1}`}
                  >
                    <img src={`/images/aiart/${image}`} alt={`${item.title} frame ${imgIndex + 1}`} loading="lazy" />
                  </button>
                );
              })}
            </div>

            <div className="timeline-card-body">
              <div className="timeline-card-date">{item.date}</div>
              <h3>{item.title}</h3>
              <p>{item.description}</p>

              {(item.medium || item.tools?.length > 0) && (
                <div className="timeline-details">
                  {item.medium && (
                    <div className={`timeline-meta ${activeMediums.includes(item.medium) ? 'active' : ''}`}>
                      <span className="meta-label">Medium</span>
                      <span className="meta-value">{item.medium}</span>
                    </div>
                  )}
                  {item.tools?.length > 0 && (
                    <div className="timeline-meta">
                      <span className="meta-label">Tools</span>
                      <div className="meta-value">
                        {item.tools.map((tool) => (
                          <span
                            key={tool}
                            className={`timeline-badge ${activeTools.includes(tool) ? 'active' : ''}`}
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>

      {cta && <div className="timeline-cta text-center">{cta}</div>}
    </section>
  );
};

export default GenAITimeline;
