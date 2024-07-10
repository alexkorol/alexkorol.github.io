import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AIArtSection = () => {
  const timelineRef = useRef(null);

  const timelineItems = [
    { year: '2024', title: 'Future AI', description: 'Exploring the potential of AI in 2024', imageSrc:
'/api/placeholder/1200/675?text=Future AI 2024' },
    { year: '2023', title: 'AI Revolution', description: 'The year AI became mainstream', imageSrc:
'/api/placeholder/1200/675?text=AI Revolution 2023' },
    { year: '2022', title: 'AI Breakthroughs', description: 'Major advancements in AI technology', imageSrc:
'/api/placeholder/1200/675?text=AI Breakthroughs 2022' },
    { year: '2021', title: 'Early AI Art', description: 'The beginning of AI-generated art', imageSrc:
'/api/placeholder/1200/675?text=Early AI Art 2021' },
  ];

  useEffect(() => {
    const timeline = timelineRef.current;
    const items = timeline.querySelectorAll('.timeline-item');

    gsap.set(items, { opacity: 0, y: 100 });

    items.forEach((item, index) => {
      gsap.from(item, {
        opacity: 0,
        y: 100,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        }
      });
    });

    gsap.to('.timeline::before', {
      height: '100%',
      ease: 'none',
      scrollTrigger: {
        trigger: '.timeline',
        start: 'top center',
        end: 'bottom center',
        scrub: true
      }
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);
  return (
    <div className="container mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold text-center mb-8">AI Art Timeline</h1>
      <div className="timeline" ref={timelineRef}>
        {timelineItems.map((item, index) => (
          <div className="timeline-item" key={index}>
            <div className="timeline-content">
              <div className="carousel">
                <div className="carousel-inner">
                  <div className="carousel-item">
                    <img src={item.imageSrc} alt={item.title} />
                  </div>
                </div>
              </div>
              <div className="timeline-text">
                <div className="date">{item.year}</div>
                <h2>{item.title}</h2>
                <p>{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );  
};

export default AIArtSection;
