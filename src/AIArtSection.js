import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const AIArtSection = () => {
  const timelineRef = useRef(null);

  const timelineItems = [
    { year: '2024', title: 'Future AI', description: 'Exploring the potential of AI in 2024', imageSrc: '/path/to/art/2024.jpg' },
    { year: '2023', title: 'AI Revolution', description: 'The year AI became mainstream', imageSrc: '/path/to/art/2023.jpg' },
    { year: '2022', title: 'AI Breakthroughs', description: 'Major advancements in AI technology', imageSrc: '/path/to/art/2022.jpg' },
    { year: '2021', title: 'Early AI Art', description: 'The beginning of AI-generated art', imageSrc: '/path/to/art/2021.jpg' },
  ];

  useEffect(() => {
    const timeline = timelineRef.current;
    const items = timeline.querySelectorAll('.timeline-item');

    gsap.set(items, { opacity: 0, y: 100 });

    ScrollTrigger.batch(items, {
      onEnter: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
      onLeave: batch => gsap.set(batch, { opacity: 0, y: -100, overwrite: true }),
      onEnterBack: batch => gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
      onLeaveBack: batch => gsap.set(batch, { opacity: 0, y: 100, overwrite: true }),
      start: "top 80%",
      end: "bottom 20%",
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
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400">AI Art Timeline</h1>
      <div ref={timelineRef} className="timeline relative">
        {timelineItems.map((item, index) => (
          <div key={item.year} className="timeline-item flex mb-20">
            <div className="timeline-content w-full md:w-10/12 mx-auto bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex flex-col md:flex-row items-center">
                <div className="carousel relative w-full md:w-1/2 pb-9/16 mb-6 md:mb-0 md:mr-8 overflow-hidden rounded-lg">
                  <img src={item.imageSrc} alt={item.title} className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
                </div>
                <div className="timeline-text md:w-1/2">
                  <div className="date text-blue-500 font-bold mb-3 text-lg">{item.year}</div>
                  <h2 className="text-2xl font-semibold mb-3 text-gray-800 dark:text-gray-200">{item.title}</h2>
                  <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">{item.description}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIArtSection;
