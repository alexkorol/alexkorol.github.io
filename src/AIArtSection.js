import React, { useRef, useEffect, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Timeline.css';

gsap.registerPlugin(ScrollTrigger);

const AIArtSection = () => {
  const timelineRef = useRef(null);
  const timelineItems = [
    { date: 'Sept 2023', title: 'DALL-E 3', images: ['dalle3_1.jpg', 'dalle3_2.jpg'] },
    { date: 'Jul 2022', title: 'Pixel Art Diffusion', images: ['pixelart_diffusion_ 1.png', 'pixelart_diffusion_ 2.png', 'pixelart_diffusion_ 3.png'] },
    { date: 'Jun 2022', title: 'txt2image_v5', images: ['txt2image_v5_ 1.png', 'txt2image_v5_ 2.png', 'txt2image_v5_ 3.png', 'txt2image_v5_ 4.png', 'txt2image_v5_ 5.png'] },
    { date: 'Feb 2022', title: 'Fungoid Diffusion', images: ['fungoid_ 1.png', 'fungoid_ 2.png', 'fungoid_ 3.png', 'fungoid_ 4.png', 'fungoid_ 5.png', 'fungoid_ 6.png'] },
    { date: 'Dec 2021', title: '360 Diffusion', images: ['360_ 1.jpg', '360_ 2.jpg', '360_ 3.jpg', '360_ 4.jpg'] },
    { date: 'Aug 2021', title: 'Artflow', images: ['artflow_1.png', 'artflow_2.png', 'artflow_3.png'] },
  ];

  const [currentSlides, setCurrentSlides] = useState(timelineItems.reduce((acc, _, index) => {
    acc[index] = 0;
    return acc;
  }, {}));

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
    const timeline = timelineRef.current;
    const items = timeline.querySelectorAll('.timeline-item');

    gsap.set(items, { opacity: 0, y: 100 });

    items.forEach((item, index) => {
      gsap.to(item, {
        opacity: 1,
        y: 0,
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
    <div className="container mx-auto px-4 py-16">
      <h1 className="text-4xl font-bold text-center mb-12 text-blue-600">AI Art Timeline</h1>
      <div className="timeline relative" ref={timelineRef}>
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-blue-500 hidden md:block" />
        {timelineItems.map((item, index) => (
          <div className={`timeline-item flex flex-col md:flex-row justify-center items-center mb-16 md:mb-32 ${index % 2 === 0 ? '' : 'md:flex-row-reverse'}`} key={index}>
            <div className={`timeline-content flex flex-col md:flex-row items-center w-full ${index % 2 === 0 ? 'md:items-end' : 'md:items-start'}`}>
              <div className={`carousel w-full md:w-3/4 relative rounded-lg overflow-hidden shadow-xl mb-4 md:mb-0 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`} style={{ minHeight: '300px' }}>
                {item.images.map((image, imgIndex) => (
                  <img
                    key={imgIndex}
                    src={`/images/aiart/${image}`}
                    alt={`${item.title} ${imgIndex + 1}`}
                    className={`w-full h-full object-contain absolute top-0 left-0 transition-opacity duration-500 ${imgIndex === currentSlides[index] ? 'opacity-100 active' : 'opacity-0'}`}
                    style={{
                      transform: `translateX(${(imgIndex - currentSlides[index]) * 100}%)`,
                      transition: 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out',
                    }}
                  />
                ))}
                <button onClick={() => handlePrevSlide(index)} className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-20 hover:bg-opacity-75">{'<'}</button>
                <button onClick={() => handleNextSlide(index)} className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full z-20 hover:bg-opacity-75">{'>'}</button>
              </div>
              <div className={`timeline-text w-full md:w-1/4 bg-white bg-opacity-80 backdrop-blur-md rounded-lg p-4 shadow-lg ${index % 2 === 0 ? 'md:order-2 md:-ml-8' : 'md:order-1 md:-mr-8'} z-10`}>
                <div className="date text-lg font-bold text-blue-500 mb-2">{item.date}</div>
                <h2 className="text-xl font-semibold mb-2 text-gray-800">{item.title}</h2>
                <p className="text-sm text-gray-600">Description of {item.title} images.</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIArtSection;
