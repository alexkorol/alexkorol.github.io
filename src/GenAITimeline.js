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
  cta
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
        if (animation.scrollTrigger) {
          animation.scrollTrigger.kill();
        }
        animation.kill();
      });

      if (axisAnimation) {
        if (axisAnimation.scrollTrigger) {
          axisAnimation.scrollTrigger.kill();
        }
        axisAnimation.kill();
      }
    };
  }, [timelineItems]);

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
                {item.images.map((image, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={`/images/aiart/${image}`}
                    alt={`${item.title} frame ${imgIndex + 1}`}
                    className={`w-full h-full object-contain absolute top-0 left-0 transition-opacity duration-500 ${
                      imgIndex === currentSlides[index] ? 'opacity-100 active' : 'opacity-0'
                    }`}
                    style={{
                      transform: `translateX(${(imgIndex - currentSlides[index]) * 100}%)`,
                      transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
                    }}
                  />
                ))}
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
