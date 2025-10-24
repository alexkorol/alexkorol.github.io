import React, { useRef, useEffect, useState, useMemo } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Timeline.css';

gsap.registerPlugin(ScrollTrigger);

const GenAITimeline = ({
  items,
  limit,
  heading,
  intro,
  cta,
  activeFilters,
  onImageClick
}) => {
  const timelineRef = useRef(null);
  const timelineItems = useMemo(() => (limit ? items.slice(0, limit) : items), [items, limit]);
  const [currentSlides, setCurrentSlides] = useState(
    timelineItems.reduce((acc, _, index) => {
      acc[index] = 0;
      return acc;
    }, {})
  );

  useEffect(() => {
    setCurrentSlides(
      timelineItems.reduce((acc, _, index) => {
        acc[index] = 0;
        return acc;
      }, {})
    );
  }, [timelineItems]);

  const handlePrevSlide = (index) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [index]: (prev[index] - 1 + timelineItems[index].images.length) % timelineItems[index].images.length,
    }));
  };

  const handleNextSlide = (index) => {
    setCurrentSlides((prev) => ({
      ...prev,
      [index]: (prev[index] + 1) % timelineItems[index].images.length,
    }));
  };

  useEffect(() => {
    if (!timelineRef.current) return;

    const timeline = timelineRef.current;
    const items = timeline.querySelectorAll('.timeline-item');

    gsap.set(items, { opacity: 0, y: 80 });

    const animations = Array.from(items).map((item) =>
      gsap.to(item, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 85%',
          toggleActions: 'play none none reverse',
        },
      })
    );

    const axis = timeline.querySelector('.timeline-axis');
    const axisAnimation = axis
      ? gsap.to(axis, {
          height: '100%',
          ease: 'none',
          scrollTrigger: {
            trigger: timeline,
            start: 'top 80%',
            end: 'bottom center',
            scrub: true,
          },
        })
      : null;

    return () => {
      animations.forEach((animation) => {
        animation?.scrollTrigger?.kill();
        animation?.kill?.();
      });

      if (axisAnimation) {
        axisAnimation.scrollTrigger?.kill();
        axisAnimation.kill?.();
      }
    };
  }, [timelineItems]);

  const activeTags = activeFilters?.tags ?? [];
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
      <div className="timeline" ref={timelineRef}>
        <div className="timeline-axis" aria-hidden="true" />
        {timelineItems.map((item, index) => (
          <div
            className={`timeline-item flex flex-col md:flex-row justify-center items-center mb-16 md:mb-32 ${
              index % 2 === 0 ? '' : 'md:flex-row-reverse'
            }`}
            key={`${item.title}-${item.date}`}
          >
            <div
              className={`timeline-content flex flex-col md:flex-row items-center w-full ${
                index % 2 === 0 ? 'md:items-end' : 'md:items-start'
              }`}
            >
              <div
                className={`carousel w-full md:w-3/4 relative rounded-xl overflow-hidden shadow-xl mb-4 md:mb-0 ${
                  index % 2 === 0 ? 'md:order-1' : 'md:order-2'
                }`}
                style={{ minHeight: '300px' }}
              >
                {item.images.map((image, imgIndex) => {
                  const isActive = imgIndex === currentSlides[index];
                  const interactive = typeof onImageClick === 'function';
                  const slideClassNames = ['carousel-slide'];

                  if (isActive) {
                    slideClassNames.push('active');
                  }

                  if (interactive) {
                    slideClassNames.push('interactive');
                  }

                  return (
                    <div
                      key={imgIndex}
                      role={interactive ? 'button' : undefined}
                      tabIndex={interactive ? 0 : undefined}
                      className={slideClassNames.join(' ')}
                      onClick={interactive ? () => handleImageSelect(item, imgIndex) : undefined}
                      onKeyDown={
                        interactive
                          ? (event) => {
                              if (event.key === 'Enter' || event.key === ' ') {
                                event.preventDefault();
                                handleImageSelect(item, imgIndex);
                              }
                            }
                          : undefined
                      }
                      style={{
                        transform: `translateX(${(imgIndex - currentSlides[index]) * 100}%)`,
                        transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
                      }}
                    >
                      <img
                        src={`/images/aiart/${image}`}
                        alt={`${item.title} frame ${imgIndex + 1}`}
                        className="w-full h-full object-contain"
                        aria-hidden={onImageClick ? 'true' : undefined}
                      />
                    </div>
                  );
                })}
                {item.images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => handlePrevSlide(index)}
                      className="carousel-control left"
                      aria-label={`View previous ${item.title} image`}
                    >
                      ‹
                    </button>
                    <button
                      type="button"
                      onClick={() => handleNextSlide(index)}
                      className="carousel-control right"
                      aria-label={`View next ${item.title} image`}
                    >
                      ›
                    </button>
                  </>
                )}
              </div>
              <div
                className={`timeline-text w-full md:w-1/4 backdrop-blur-md rounded-lg p-6 shadow-lg ${
                  index % 2 === 0 ? 'md:order-2 md:-ml-8' : 'md:order-1 md:-mr-8'
                } z-10`}
              >
                <div className="date">{item.date}</div>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {(item.medium || item.tags?.length > 0 || item.tools?.length > 0) && (
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
                    {item.tags?.length > 0 && (
                      <div className="timeline-meta">
                        <span className="meta-label">Tags</span>
                        <div className="timeline-tags">
                          {item.tags.map((tag) => (
                            <span
                              key={tag}
                              className={`timeline-tag ${activeTags.includes(tag) ? 'active' : ''}`}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {cta && (
        <div className="timeline-cta text-center">
          {cta}
        </div>
      )}
    </section>
  );
};

export default GenAITimeline;
