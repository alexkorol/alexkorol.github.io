import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Timeline.css';

gsap.registerPlugin(ScrollTrigger);

const AIArtSection = () => {
  const timelineRef = useRef(null);

  const timelineItems = [
    {
      year: '2024',
      title: 'Future AI',
      description: 'Exploring the potential of AI in 2024',
      images: [
        '/api/placeholder/1920/1080?text=Future AI 2024 1',
        '/api/placeholder/1920/1080?text=Future AI 2024 2',
        '/api/placeholder/1920/1080?text=Future AI 2024 3',
      ],
    },
    {
      year: '2023',
      title: 'AI Revolution',
      description: 'The year AI became mainstream',
      images: [
        '/api/placeholder/1920/1080?text=AI Revolution 2023 1',
        '/api/placeholder/1920/1080?text=AI Revolution 2023 2',
        '/api/placeholder/1920/1080?text=AI Revolution 2023 3',
      ],
    },
    {
      year: '2022',
      title: 'AI Breakthroughs',
      description: 'Major advancements in AI technology',
      images: [
        '/api/placeholder/1920/1080?text=AI Breakthroughs 2022 1',
        '/api/placeholder/1920/1080?text=AI Breakthroughs 2022 2',
        '/api/placeholder/1920/1080?text=AI Breakthroughs 2022 3',
      ],
    },
    {
      year: '2021',
      title: 'Early AI Art',
      description: 'The beginning of AI-generated art',
      images: [
        '/api/placeholder/1920/1080?text=Early AI Art 2021 1',
        '/api/placeholder/1920/1080?text=Early AI Art 2021 2',
        '/api/placeholder/1920/1080?text=Early AI Art 2021 3',
      ],
    },
  ];

  useEffect(() => {
    const timeline = timelineRef.current;
    const items = timeline.querySelectorAll('.timeline-item');

    gsap.set(items, { opacity: 0, y: 100 });

    items.forEach((item, index) => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: item,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        }
      });

      tl.to(item, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power3.out',
      });

      const carousel = item.querySelector('.carousel');
      const images = carousel.querySelectorAll('img');

      tl.to(images, {
        xPercent: -100 * (images.length - 1),
        ease: 'none',
        duration: 10,
        repeat: -1,
        yoyo: true,
      }, '-=0.5');
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
      <h1 className="text-4xl font-bold text-center mb-12 text-blue-600">AI Art Timeline</h1>
      <div className="timeline relative" ref={timelineRef}>
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-blue-500" />
        {timelineItems.map((item, index) => (
          <div className={`timeline-item flex justify-center items-center mb-32 ${index % 2 === 0 ? '' : 'flex-row-reverse'}`} key={index}>
            <div className={`timeline-content flex items-center w-4/5 ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className="carousel w-3/4 relative pb-[56.25%] rounded-lg overflow-hidden shadow-xl">
                {item.images.map((image, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={image}
                    alt={`${item.title} ${imgIndex + 1}`}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                    style={{ left: `${imgIndex * 100}%` }}
                  />
                ))}
              </div>
              <div className={`timeline-text w-1/4 bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-4 shadow-lg ${index % 2 === 0 ? '-ml-12 z-10' : '-mr-12 z-10'}`}>
                <div className="date text-lg font-bold text-blue-500 mb-2">{item.year}</div>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h2>
                <p className="text-sm text-gray-600">{item.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIArtSection;