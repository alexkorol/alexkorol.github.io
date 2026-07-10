export interface Metric {
  value: string;
  label: string;
  note: string;
}

export interface Project {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  order: number;
  status: string;
  repo: string;
  demo?: string;
  architecture: string[];
  metrics: Metric[];
  tags: string[];
  evidenceUpdated: string;
  html: string;
  plainText: string;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  readTime: string;
  ogImage: string;
  html: string;
  plainText: string;
}

export interface CorpusChunk {
  id: string;
  sourceType: 'project' | 'post' | 'resume';
  sourceSlug: string;
  title: string;
  url: string;
  heading: string;
  text: string;
  embedding: number[];
}

export interface EvalResults {
  generatedAt: string;
  mode: string;
  totals: { inScope: number; outOfScope: number };
  metrics: {
    expectedSourceRecallAt3: number;
    groundedAnswerRate: number;
    refusalCorrectness: number;
  };
}

export interface Citation {
  id: string;
  title: string;
  url: string;
  excerpt: string;
}

export interface ChatResponse {
  answer: string;
  citations: Citation[];
  mode: 'live' | 'retrieval-only' | 'refusal';
  requestId?: string;
  reason?: string;
}
