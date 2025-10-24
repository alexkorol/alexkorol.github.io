import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLinkedin, faGithub } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import GenAITimeline from './GenAITimeline';
import genAITimeline from './timelineData';
import ExperienceTimeline from './components/ExperienceTimeline';
import experienceData from './data/experience';

const HomeSection = () => {
  const azureAI102Id = process.env.REACT_APP_AZURE_AI102_ID || 'Pending update';
  const azureAI900Id = process.env.REACT_APP_AZURE_AI900_ID || 'Pending update';

  const cards = [
    {
      title: 'About Me',
      content:
        'Software engineer focused on shipping AI-first features and meaningful digital experiences that blend automation, analytics, and delightful design.'
    },
    {
      title: 'Skills Snapshot',
      content: (
        <ul className="list-disc list-inside space-y-1">
          <li>Generative AI systems design &amp; prompt engineering</li>
          <li>Python, TypeScript, React, Node.js</li>
          <li>Cloud-native ML workflows on Azure</li>
          <li>Data wrangling with Pandas, NumPy, Matplotlib</li>
          <li>API integration, automation, and Git-based delivery</li>
        </ul>
      )
    },
    {
      title: 'Recent Wins',
      content: (
        <ul className="list-disc list-inside space-y-1">
          <li>Built devops helpers that use GPT agents to accelerate code review and QA.</li>
          <li>Engineered dataset tooling to harvest Instagram imagery for ML fine-tunes.</li>
          <li>Shipped Homework Helper and Quiz Helper apps combining OCR + OpenAI APIs.</li>
        </ul>
      )
    },
    {
      title: 'Project Highlights',
      content: (
        <div className="space-y-3">
          <div className="project-pill">
            <h3>Repo2GPT</h3>
            <p>Summarizes local &amp; GitHub repos into context packs for LLM assisted development.</p>
          </div>
          <div className="project-pill">
            <h3>SREF Seed Vault</h3>
            <p>Midjourney v6 style reference catalog with curated image exemplars and tags.</p>
          </div>
        </div>
      )
    },
    {
      title: 'Certifications',
      content: (
        <ul className="list-disc list-inside space-y-1">
          <li>
            MS AI-102: Azure AI Engineer Associate — <span className="credential-id">Credential ID: {azureAI102Id}</span>
          </li>
          <li>
            MS AI-900: Azure AI Fundamentals — <span className="credential-id">Credential ID: {azureAI900Id}</span>
          </li>
          <li>Career Essentials in Generative AI by Microsoft &amp; LinkedIn</li>
        </ul>
      )
    },
    {
      title: 'Get in Touch',
      content: (
        <div className="flex flex-wrap gap-3">
          <a
            href="https://www.linkedin.com/in/alexei-korol/"
            target="_blank"
            rel="noopener noreferrer"
            className="get-in-touch-button"
          >
            <FontAwesomeIcon icon={faLinkedin} /> LinkedIn <FontAwesomeIcon icon={faExternalLinkAlt} className="external-link-icon" />
          </a>
          <a
            href="https://github.com/alexkorol"
            target="_blank"
            rel="noopener noreferrer"
            className="get-in-touch-button"
          >
            <FontAwesomeIcon icon={faGithub} /> GitHub <FontAwesomeIcon icon={faExternalLinkAlt} className="external-link-icon" />
          </a>
          <a href="mailto:korolalexei@gmail.com" className="get-in-touch-button">
            <FontAwesomeIcon icon={faEnvelope} /> Email
          </a>
        </div>
      )
    }
  ];

  return (
    <section className="home-section">
      <div className="hero">
        <span className="eyebrow">Alexei Korol • AI Engineer &amp; Builder</span>
        <h1 className="hero-title">Designing smarter products with Generative AI, code, and curiosity.</h1>
        <p className="hero-subtitle">
          I translate ambiguous ideas into working software, blending automation with thoughtful human experiences. Dive into my recent work, experiments, and AI art explorations below.
        </p>
      </div>

      <div className="card-container-home grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cards.map((card) => (
          <Card key={card.title} title={card.title} content={card.content} />
        ))}
      </div>

      <GenAITimeline
        items={genAITimeline}
        limit={3}
        heading="Visual Generative AI Timeline"
        intro="A quick preview of the systems and styles I have iterated on."
        cta={(
          <Link className="timeline-link" to="/ai-art/timeline">
            View the full AI art story
          </Link>
        )}
      />

      <ExperienceTimeline
        experiences={experienceData}
        heading="Experience & Impact"
        intro="Snapshots of the teams, products, and outcomes I've driven across high-growth environments."
      />
    </section>
  );
};

export default HomeSection;
