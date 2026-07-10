import { useEffect } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { ExperimentsPage, HomePage, HowItWorksPage, NotesPage, PostPage, ProjectPage, ProjectsPage } from './pages';
import { getRouteMeta } from './lib/meta';

function RouteMetadata(): null {
  const { pathname } = useLocation();
  useEffect(() => {
    const meta = getRouteMeta(pathname);
    document.title = meta.title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = meta.description;
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (canonical) canonical.href = meta.canonical;
  }, [pathname]);
  return null;
}

function Layout(): JSX.Element {
  return (
    <div className="site-shell">
      <RouteMetadata />
      <header className="site-header">
        <Link className="brand" to="/"><span>AK</span><strong>Alexei Korol</strong></Link>
        <nav aria-label="Primary navigation">
          <NavLink to="/projects/">Case studies</NavLink>
          <NavLink to="/lab-notes/">Lab notes</NavLink>
          <NavLink to="/how-it-works/">How it works</NavLink>
          <a href="/alexei-korol-resume.pdf">Resume</a>
        </nav>
      </header>
      <main id="main-content"><Routes><Route path="/" element={<HomePage />} /><Route path="/projects/" element={<ProjectsPage />} /><Route path="/projects/:slug/" element={<ProjectPage />} /><Route path="/lab-notes/" element={<NotesPage />} /><Route path="/lab-notes/:slug/" element={<PostPage />} /><Route path="/how-it-works/" element={<HowItWorksPage />} /><Route path="/generative-ai-experiments/" element={<ExperimentsPage />} /><Route path="*" element={<HomePage />} /></Routes></main>
      <footer className="site-footer"><div><strong>Alexei Korol</strong><span>AI systems engineer · Greater Seattle Area</span></div><nav aria-label="Footer navigation"><a href="mailto:korolalexei@gmail.com">Email</a><a href="https://www.linkedin.com/in/alexei-korol/" target="_blank" rel="noreferrer">LinkedIn</a><a href="https://github.com/alexkorol" target="_blank" rel="noreferrer">GitHub</a><a href="/rss.xml">RSS</a></nav></footer>
    </div>
  );
}

export function App(): JSX.Element { return <Layout />; }
