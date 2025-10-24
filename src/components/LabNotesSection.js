import React, { useEffect, useMemo, useState } from 'react';
import matter from 'gray-matter';
import { marked } from 'marked';
import '../LabNotes.css';

const formatDate = (input) => {
  if (!input) return '';
  try {
    return new Intl.DateTimeFormat('en', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(new Date(input));
  } catch (error) {
    return input;
  }
};

const deriveExcerpt = (excerpt, content) => {
  if (excerpt) {
    return excerpt;
  }

  if (!content) {
    return '';
  }

  const plain = content
    .replace(/[>#*_`-]/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  return plain.length > 160 ? `${plain.slice(0, 157)}...` : plain;
};

const createNotesLoader = () => {
  try {
    return require.context('../../content/lab-notes', false, /\.md$/);
  } catch (error) {
    console.error('Unable to load lab notes context', error);
    return null;
  }
};

const LabNotesSection = () => {
  const [notes, setNotes] = useState([]);
  const [expandedNote, setExpandedNote] = useState(null);
  const [status, setStatus] = useState('loading');
  const notesContext = useMemo(createNotesLoader, []);

  useEffect(() => {
    const fetchNotes = async () => {
      if (!notesContext) {
        setStatus('error');
        return;
      }

      try {
        const keys = notesContext.keys();

        const loadedNotes = await Promise.all(
          keys.map(async (key) => {
            const resource = notesContext(key);
            const response = await fetch(resource);

            if (!response.ok) {
              throw new Error(`Failed to fetch ${key}`);
            }

            const raw = await response.text();
            const { data, content } = matter(raw);

            return {
              slug: key.replace('./', '').replace(/\.md$/, ''),
              title: data.title || 'Untitled note',
              date: data.date || '',
              formattedDate: formatDate(data.date),
              tags: Array.isArray(data.tags) ? data.tags : [],
              excerpt: deriveExcerpt(data.excerpt, content),
              content: marked.parse(content ?? ''),
            };
          })
        );

        loadedNotes.sort((a, b) => {
          const aDate = new Date(a.date || a.slug);
          const bDate = new Date(b.date || b.slug);
          return bDate - aDate;
        });

        setNotes(loadedNotes);
        setStatus('ready');
      } catch (error) {
        console.error('Failed to load lab notes', error);
        setStatus('error');
      }
    };

    fetchNotes();
  }, [notesContext]);

  const toggleNote = (slug) => {
    setExpandedNote((current) => (current === slug ? null : slug));
  };

  return (
    <section className="lab-notes-section">
      <header className="lab-notes-header">
        <h2 className="lab-notes-title">Lab Notes</h2>
        <p className="lab-notes-subtitle">
          Snapshots from ongoing experiments, toolsmithing sprints, and the occasional
          late-night breakthrough.
        </p>
      </header>

      {status === 'loading' && (
        <div className="lab-notes-status">Loading lab notes…</div>
      )}

      {status === 'error' && (
        <div className="lab-notes-status error">
          Unable to load lab notes right now. Please try refreshing the page.
        </div>
      )}

      {status === 'ready' && (
        notes.length > 0 ? (
          <div className="lab-notes-grid">
            {notes.map((note) => {
              const isExpanded = expandedNote === note.slug;

              return (
                <article
                  key={note.slug}
                  className={`lab-note-card ${isExpanded ? 'expanded' : ''}`}
                >
                  <div className="lab-note-meta">
                    {note.formattedDate && (
                      <span className="lab-note-date">{note.formattedDate}</span>
                    )}
                    {note.tags.length > 0 && (
                      <ul className="lab-note-tags">
                        {note.tags.map((tag) => (
                          <li key={tag} className="lab-note-tag">
                            #{tag}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <h3 className="lab-note-heading">{note.title}</h3>
                  <p className="lab-note-excerpt">{note.excerpt}</p>
                  <button
                    type="button"
                    className="lab-note-toggle"
                    onClick={() => toggleNote(note.slug)}
                  >
                    {isExpanded ? 'Close' : 'Read more'}
                  </button>
                  {isExpanded && (
                    <div
                      className="lab-note-content"
                      dangerouslySetInnerHTML={{ __html: note.content }}
                    />
                  )}
                </article>
              );
            })}
          </div>
        ) : (
          <div className="lab-notes-status">No lab notes to share just yet.</div>
        )
      )}
    </section>
  );
};

export default LabNotesSection;
