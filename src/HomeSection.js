import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import {
  faArrowRight,
  faArrowUpRightFromSquare,
  faBolt,
  faBrain,
  faCodeBranch,
  faLayerGroup,
  faMicrochip,
} from '@fortawesome/free-solid-svg-icons';
import Projects from './Projects';
import GenAITimeline from './GenAITimeline';
import genAITimeline from './timelineData';
import ExperienceTimeline from './components/ExperienceTimeline';
import experienceData from './data/experience';

const focusAreas = [
  {
    icon: faBrain,
    title: 'Evaluation-minded agent tooling',
    copy: 'Rubrics, traces, context packaging, and tools that make model behavior easier to inspect and improve.'
  },
  {
    icon: faMicrochip,
    title: 'Local model discipline',
    copy: 'Apple Silicon inference, MLX, llama.cpp, embeddings, and workflows that stay useful off the cloud.'
  },
  {
    icon: faCodeBranch,
    title: 'Agent-ready code context',
    copy: 'Repo maps, token planning, MCP surfaces, and artifacts that make coding agents less blind.'
  },
  {
    icon: faLayerGroup,
    title: 'Generative systems with taste',
    copy: 'Image, music, game, and interface experiments that keep visual judgment in the loop.'
  },
];

const HomeSection = () => {
  return (
    <section id="home" data-section="home" className="home-section">
      <header className="hero-shell">
        <div
          className="hero-background"
          aria-hidden="true"
          style={{
            backgroundImage: `linear-gradient(90deg, rgba(0, 0, 0, 0.76), rgba(0, 0, 0, 0.36) 54%, rgba(0, 0, 0, 0.74)), linear-gradient(180deg, rgba(0, 0, 0, 0.05), rgba(0, 0, 0, 0.72)), url(${process.env.PUBLIC_URL}/images/aiart/dalle3_1.jpg)`
          }}
        />
        <div className="hero-content">
          <p className="hero-kicker">Alexei Korol / AI systems engineer / Snohomish County, WA</p>
          <h1>Alexei Korol</h1>
          <p className="hero-statement">AI evaluation, creative tools, and local model experiments.</p>
          <p className="hero-subtitle">
            Current thread: clearer model judgment, less sloppy agents, and generated work you can actually inspect.
          </p>
          <div className="hero-actions">
            <Link className="primary-action" to="/projects">
              See the work <FontAwesomeIcon icon={faArrowRight} />
            </Link>
            <a className="secondary-action" href="https://github.com/alexkorol" target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon={faGithub} /> GitHub
            </a>
          </div>
        </div>
        <aside className="hero-panel" aria-label="Current signal">
          <span className="panel-label">Current signal</span>
          <strong>Repo2GPT + agent context</strong>
          <p>Repo maps, token-aware bundles, API jobs, and MCP surfaces for coding agents that need better working memory.</p>
          <a href="https://github.com/alexkorol/repo2GPT" target="_blank" rel="noopener noreferrer">
            Repository <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
          </a>
        </aside>
      </header>

      <section className="focus-grid" aria-label="Focus areas">
        {focusAreas.map((area) => (
          <article key={area.title} className="focus-card">
            <FontAwesomeIcon icon={area.icon} />
            <h2>{area.title}</h2>
            <p>{area.copy}</p>
          </article>
        ))}
      </section>

      <section className="manifesto-band">
        <div>
          <span className="section-kicker">Working thesis</span>
          <h2>AI work gets real when it survives contact with messy inputs, visual judgment, and repeatable process.</h2>
        </div>
        <p>
          The projects here are deliberately uneven in surface polish because they are workbenches, not pitch decks. The through-line is building systems that reveal their assumptions: code tools with token budgets, agent workflows with observable state, game prototypes with documented constraints, and creative tools that do not trust success until the output is seen.
        </p>
      </section>

      <Projects featuredOnly />

      <GenAITimeline
        items={genAITimeline}
        limit={3}
        heading="Generative image experiments"
        intro="A smaller, non-carousel view of the visual systems and model eras that shaped my taste."
        cta={(
          <Link className="timeline-link" to="/ai-art/timeline">
            Open the full visual timeline <FontAwesomeIcon icon={faArrowRight} />
          </Link>
        )}
      />

      <ExperienceTimeline
        experiences={experienceData}
        heading="Experience and operating range"
        intro="Independent AI engineering, field systems discipline, and long-running applied ML study."
      />

      <section className="contact-band">
        <div>
          <FontAwesomeIcon icon={faBolt} />
          <h2>Useful conversations beat generic networking.</h2>
          <p>Evaluation harnesses, local LLM workflows, creative tooling, browser games, and agent-assisted engineering are the fastest way in.</p>
        </div>
        <div className="contact-actions">
          <a href="mailto:korolalexei@gmail.com">Email</a>
          <a href="https://www.linkedin.com/in/alexei-korol/" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faLinkedin} /> LinkedIn
          </a>
          <a href="https://github.com/alexkorol" target="_blank" rel="noopener noreferrer">
            <FontAwesomeIcon icon={faGithub} /> GitHub
          </a>
        </div>
      </section>
    </section>
  );
};

export default HomeSection;
