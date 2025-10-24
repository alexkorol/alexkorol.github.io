import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import GenAITimeline from '../GenAITimeline';
import genAITimeline from '../timelineData';
import styles from './TimelinePage.module.css';

const GenAITimelinePage = () => {
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedMediums, setSelectedMediums] = useState([]);
  const [selectedTools, setSelectedTools] = useState([]);
  const [lightbox, setLightbox] = useState(null);

  const timelineItems = useMemo(() => genAITimeline, []);

  const allTags = useMemo(
    () => Array.from(new Set(timelineItems.flatMap((item) => item.tags ?? []))).sort(),
    [timelineItems]
  );
  const allMediums = useMemo(
    () => Array.from(new Set(timelineItems.map((item) => item.medium).filter(Boolean))).sort(),
    [timelineItems]
  );
  const allTools = useMemo(
    () => Array.from(new Set(timelineItems.flatMap((item) => item.tools ?? []))).sort(),
    [timelineItems]
  );

  const toggleValue = (value, setValue) => {
    setValue((prev) => (prev.includes(value) ? prev.filter((entry) => entry !== value) : [...prev, value]));
  };

  const handleTagToggle = (tag) => toggleValue(tag, setSelectedTags);
  const handleMediumToggle = (medium) => toggleValue(medium, setSelectedMediums);
  const handleToolToggle = (tool) => toggleValue(tool, setSelectedTools);

  const clearFilters = () => {
    setSelectedTags([]);
    setSelectedMediums([]);
    setSelectedTools([]);
  };

  const filteredItems = useMemo(() => {
    return timelineItems.filter((item) => {
      const matchesTags =
        selectedTags.length === 0 || selectedTags.every((tag) => (item.tags ?? []).includes(tag));
      const matchesMediums =
        selectedMediums.length === 0 || selectedMediums.includes(item.medium);
      const matchesTools =
        selectedTools.length === 0 || selectedTools.every((tool) => (item.tools ?? []).includes(tool));

      return matchesTags && matchesMediums && matchesTools;
    });
  }, [timelineItems, selectedTags, selectedMediums, selectedTools]);

  const openLightbox = useCallback((item, imageIndex) => {
    setLightbox({ item, imageIndex });
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const showNextImage = useCallback(() => {
    setLightbox((current) => {
      if (!current) {
        return current;
      }

      const nextIndex = (current.imageIndex + 1) % current.item.images.length;
      return { ...current, imageIndex: nextIndex };
    });
  }, []);

  const showPrevImage = useCallback(() => {
    setLightbox((current) => {
      if (!current) {
        return current;
      }

      const prevIndex = (current.imageIndex - 1 + current.item.images.length) % current.item.images.length;
      return { ...current, imageIndex: prevIndex };
    });
  }, []);

  useEffect(() => {
    if (!lightbox) {
      return undefined;
    }

    const handleKeydown = (event) => {
      if (event.key === 'Escape') {
        closeLightbox();
      }

      if (event.key === 'ArrowRight') {
        showNextImage();
      }

      if (event.key === 'ArrowLeft') {
        showPrevImage();
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [lightbox, closeLightbox, showNextImage, showPrevImage]);

  const hasFilters = selectedTags.length > 0 || selectedMediums.length > 0 || selectedTools.length > 0;

  const filterSummary = useMemo(() => {
    const summaryParts = [];

    if (selectedMediums.length > 0) {
      summaryParts.push(`mediums: ${selectedMediums.join(', ')}`);
    }

    if (selectedTools.length > 0) {
      summaryParts.push(`tools: ${selectedTools.join(', ')}`);
    }

    if (selectedTags.length > 0) {
      summaryParts.push(`tags: ${selectedTags.join(', ')}`);
    }

    return summaryParts.join(' · ');
  }, [selectedMediums, selectedTools, selectedTags]);

  const filteredCount = filteredItems.length;
  const introMessage = hasFilters
    ? `Showing ${filteredCount} ${filteredCount === 1 ? 'story' : 'stories'} filtered by ${filterSummary}.`
    : 'Explore the complete journey behind each generative AI experiment, with artifacts, tools, and techniques highlighted along the way.';

  const activeFilters = useMemo(
    () => ({ tags: selectedTags, tools: selectedTools, mediums: selectedMediums }),
    [selectedTags, selectedTools, selectedMediums]
  );

  return (
    <div className={styles.timelinePage}>
      <header className={styles.header}>
        <p className={styles.eyebrow}>Generative AI Showcase</p>
        <h1 className={styles.title}>Full AI Art Story Timeline</h1>
        <p className={styles.subtitle}>{introMessage}</p>
      </header>

      <section className={styles.filters} aria-label="Timeline filters">
        <div className={styles.filterGroup}>
          <h2 className={styles.filterTitle}>Medium</h2>
          <div className={styles.filterPills}>
            {allMediums.map((medium) => (
              <button
                key={medium}
                type="button"
                className={`${styles.filterButton} ${selectedMediums.includes(medium) ? styles.filterButtonActive : ''}`}
                onClick={() => handleMediumToggle(medium)}
              >
                {medium}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <h2 className={styles.filterTitle}>Tools</h2>
          <div className={styles.filterPills}>
            {allTools.map((tool) => (
              <button
                key={tool}
                type="button"
                className={`${styles.filterButton} ${selectedTools.includes(tool) ? styles.filterButtonActive : ''}`}
                onClick={() => handleToolToggle(tool)}
              >
                {tool}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.filterGroup}>
          <h2 className={styles.filterTitle}>Tags</h2>
          <div className={styles.filterPills}>
            {allTags.map((tag) => (
              <button
                key={tag}
                type="button"
                className={`${styles.filterButton} ${selectedTags.includes(tag) ? styles.filterButtonActive : ''}`}
                onClick={() => handleTagToggle(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {hasFilters && (
          <div className={styles.filterActions}>
            <button type="button" className={styles.clearButton} onClick={clearFilters}>
              Clear filters
            </button>
          </div>
        )}
      </section>

      {filteredItems.length > 0 ? (
        <GenAITimeline
          items={filteredItems}
          heading=""
          intro=""
          activeFilters={activeFilters}
          onImageClick={openLightbox}
        />
      ) : (
        <div className={styles.emptyState}>
          <p>No timeline entries match the current filters. Try broadening your selection.</p>
          <button type="button" className={styles.clearButton} onClick={clearFilters}>
            Reset filters
          </button>
        </div>
      )}

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className={styles.lightboxOverlay}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeLightbox}
          >
            <motion.div
              className={styles.lightboxContent}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 260, damping: 25 }}
              onClick={(event) => event.stopPropagation()}
            >
              <button type="button" className={styles.lightboxClose} onClick={closeLightbox} aria-label="Close lightbox">
                ×
              </button>
              <div className={styles.lightboxImageWrapper}>
                <img
                  src={`/images/aiart/${lightbox.item.images[lightbox.imageIndex]}`}
                  alt={`${lightbox.item.title} detail ${lightbox.imageIndex + 1}`}
                  className={styles.lightboxImage}
                />
              </div>
              <div className={styles.lightboxMeta}>
                <h3>{lightbox.item.title}</h3>
                <p>{lightbox.item.description}</p>
                <div className={styles.lightboxChips}>
                  <span className={styles.lightboxChip}>{lightbox.item.medium}</span>
                  {lightbox.item.tools.map((tool) => (
                    <span key={tool} className={styles.lightboxChip}>
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <div className={styles.lightboxControls}>
                <button type="button" onClick={showPrevImage} className={styles.lightboxNav} aria-label="View previous image">
                  ‹
                </button>
                <button type="button" onClick={showNextImage} className={styles.lightboxNav} aria-label="View next image">
                  ›
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default GenAITimelinePage;
