import { posts, projects } from '../generated/content';

const SITE_URL = 'https://alexkorol.github.io';
const DEFAULT_DESCRIPTION = 'Alexei Korol builds and evaluates LLM-powered systems: agents, RAG, evals, and production AI tooling.';

export interface RouteMeta {
  title: string;
  description: string;
  canonical: string;
  image: string;
  type: 'website' | 'article';
}

export function getRouteMeta(pathname: string): RouteMeta {
  const normalized = pathname.replace(/\/+$/, '') || '/';
  let title = 'Alexei Korol · AI systems engineer';
  let description = DEFAULT_DESCRIPTION;
  let image = '/og.png';
  let type: RouteMeta['type'] = 'website';

  if (normalized === '/projects') {
    title = 'AI engineering case studies · Alexei Korol';
    description = 'Three evidence-based case studies covering agent context tooling, evaluated RAG, and LLM-as-a-judge systems.';
  } else if (normalized.startsWith('/projects/')) {
    const project = projects.find((entry) => entry.slug === normalized.split('/')[2]);
    if (project) {
      title = `${project.title} case study · Alexei Korol`;
      description = project.summary;
      type = 'article';
    }
  } else if (normalized === '/lab-notes') {
    title = 'AI engineering lab notes · Alexei Korol';
    description = 'Measured build notes on retrieval, LLM evaluation, reliability, and the wrong turns behind production AI systems.';
  } else if (normalized.startsWith('/lab-notes/')) {
    const post = posts.find((entry) => entry.slug === normalized.split('/')[2]);
    if (post) {
      title = `${post.title} · Alexei Korol`;
      description = post.summary;
      image = post.ogImage;
      type = 'article';
    }
  } else if (normalized === '/how-it-works') {
    title = 'How Ask my portfolio works · Alexei Korol';
    description = 'Architecture, retrieval and chunking strategy, prompt contract, cost math, failure modes, and eval results for the portfolio RAG system.';
  } else if (normalized === '/generative-ai-experiments') {
    title = 'Generative AI experiments · Alexei Korol';
    description = 'Technical image-generation experiments framed by model, control technique, and the failure being investigated.';
  }

  return {
    title,
    description,
    canonical: `${SITE_URL}${normalized === '/' ? '/' : `${normalized}/`}`,
    image: `${SITE_URL}${image}`,
    type,
  };
}

export function metaToHtml(meta: RouteMeta): string {
  const escape = (value: string) => value.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return [
    `<title>${escape(meta.title)}</title>`,
    `<meta name="description" content="${escape(meta.description)}" />`,
    `<link rel="canonical" href="${escape(meta.canonical)}" />`,
    `<meta property="og:title" content="${escape(meta.title)}" />`,
    `<meta property="og:description" content="${escape(meta.description)}" />`,
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:url" content="${escape(meta.canonical)}" />`,
    `<meta property="og:image" content="${escape(meta.image)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escape(meta.title)}" />`,
    `<meta name="twitter:description" content="${escape(meta.description)}" />`,
    `<meta name="twitter:image" content="${escape(meta.image)}" />`,
  ].join('\n    ');
}
