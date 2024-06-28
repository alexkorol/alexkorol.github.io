import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';

const AIArtSection = () => {
  const years = ['2024', '2023', '2022', '2021'];
  const galleryRef = useRef(null);

  useEffect(() => {
    const items = galleryRef.current.querySelectorAll('.gallery-item');
    gsap.set(items, { opacity: 0, y: 50 });

    const onScroll = () => {
      items.forEach(item => {
        if (isInViewport(item)) {
          gsap.to(item, { opacity: 1, y: 0, duration: 1, ease: 'power3.out' });
        }
      });
    };

    const isInViewport = (el) => {
      const rect = el.getBoundingClientRect();
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    };

    window.addEventListener('scroll', onScroll);
    onScroll(); // Initial check
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div ref={galleryRef} className="gallery">
      {years.map(year => (
        <div key={year} className="gallery-item">
          <h2>{year}</h2>
          <div className="art-container">
            <img src={`/path/to/art/${year}.jpg`} alt={`AI Art ${year}`} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default AIArtSection;
