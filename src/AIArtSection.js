import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';

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

  useEffect(() => {
    document.body.classList.add('hide-scrollbar');
    const images = galleryRef.current.querySelectorAll('img');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });

    images.forEach((img) => {
      observer.observe(img);
    });

    return () => {
      document.body.classList.remove('hide-scrollbar');
      observer.disconnect();
    };
  }, []);

  return (
    <div className="ai-art-section">
      <h2>AI Art Section</h2>
      <div className="scrollable-gallery" ref={galleryRef}>
        {years.map((year) => (
          <div key={year} className="gallery-item">
            <h3>{year}</h3>
            <div className="placeholder">Placeholder for {year} AI Art</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIArtSection;
