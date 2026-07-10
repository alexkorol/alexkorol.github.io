export interface RetrievalChunk {
  id: string;
  title: string;
  url: string;
  heading: string;
  text: string;
  embedding: number[];
  sourceType?: string;
  sourceSlug?: string;
}

export interface RetrievalHit extends RetrievalChunk {
  score: number;
  lexicalScore: number;
  embeddingScore: number;
}

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'are', 'as', 'at', 'be', 'been', 'but', 'by', 'can', 'did',
  'do', 'does', 'for', 'from', 'has', 'have', 'he', 'how', 'i', 'in', 'is', 'it',
  'my', 'of', 'on', 'or', 'that', 'the', 'this', 'to', 'was', 'were', 'what',
  'when', 'where', 'which', 'who', 'why', 'with', 'you', 'your',
]);

export function tokenize(input: string): string[] {
  const aliases: Record<string, string> = {
    agentic: 'agent', agents: 'agent', tools: 'tool', systems: 'system',
    evals: 'evaluation', evaluate: 'evaluation', evaluated: 'evaluation',
    embeddings: 'embedding', citations: 'citation', projects: 'project',
  };
  return (input.toLowerCase().match(/[a-z0-9][a-z0-9+#.-]*/g) ?? [])
    .map((token) => token.replace(/^[-.]+|[-.]+$/g, ''))
    .map((token) => aliases[token] ?? token)
    .filter((token) => token.length > 1 && !STOP_WORDS.has(token));
}

function fnv1a(value: string): number {
  let hash = 0x811c9dc5;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return hash >>> 0;
}

export function hashedEmbedding(input: string, dimensions = 384): number[] {
  const tokens = tokenize(input);
  const features: string[] = [...tokens];
  for (let index = 0; index < tokens.length - 1; index += 1) {
    features.push(`${tokens[index]}_${tokens[index + 1]}`);
  }
  for (const token of tokens) {
    const padded = `^${token}$`;
    for (let index = 0; index <= padded.length - 3; index += 1) {
      features.push(padded.slice(index, index + 3));
    }
  }

  const vector = Array<number>(dimensions).fill(0);
  for (const feature of features) {
    const hash = fnv1a(feature);
    const bucket = hash % dimensions;
    vector[bucket] += (hash & 0x80000000) === 0 ? 1 : -1;
  }
  const norm = Math.sqrt(vector.reduce((total, value) => total + value * value, 0));
  return norm === 0 ? vector : vector.map((value) => Number((value / norm).toFixed(6)));
}

function cosineSimilarity(left: number[], right: number[]): number {
  if (left.length === 0 || left.length !== right.length) return 0;
  let dot = 0;
  let leftNorm = 0;
  let rightNorm = 0;
  for (let index = 0; index < left.length; index += 1) {
    dot += left[index] * right[index];
    leftNorm += left[index] ** 2;
    rightNorm += right[index] ** 2;
  }
  if (leftNorm === 0 || rightNorm === 0) return 0;
  return Math.max(0, dot / Math.sqrt(leftNorm * rightNorm));
}

export function retrieve(
  query: string,
  corpus: RetrievalChunk[],
  options: { limit?: number } = {},
): RetrievalHit[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) return [];

  const documentTokens = corpus.map((chunk) => tokenize(`${chunk.title} ${chunk.heading} ${chunk.text}`));
  const documentFrequency = new Map<string, number>();
  for (const tokens of documentTokens) {
    for (const token of new Set(tokens)) {
      documentFrequency.set(token, (documentFrequency.get(token) ?? 0) + 1);
    }
  }

  const queryEmbedding = hashedEmbedding(query, corpus[0]?.embedding.length || 384);
  const scores = corpus.map((chunk, index) => {
    const tokens = documentTokens[index];
    const counts = new Map<string, number>();
    for (const token of tokens) counts.set(token, (counts.get(token) ?? 0) + 1);

    let weightedMatches = 0;
    let possibleWeight = 0;
    for (const token of queryTokens) {
      const idf = Math.log(1 + (corpus.length + 1) / ((documentFrequency.get(token) ?? 0) + 1));
      possibleWeight += idf;
      const frequency = counts.get(token) ?? 0;
      if (frequency > 0) weightedMatches += idf * (frequency / (frequency + 0.8));
    }
    const lexicalScore = possibleWeight === 0 ? 0 : weightedMatches / possibleWeight;
    const embeddingScore = cosineSimilarity(queryEmbedding, chunk.embedding);
    const titleBoost = queryTokens.some((token) => chunk.title.toLowerCase().includes(token)) ? 0.08 : 0;
    const score = Math.min(1, lexicalScore * 0.68 + embeddingScore * 0.32 + titleBoost);
    return { ...chunk, score, lexicalScore, embeddingScore };
  });

  const ranked = scores
    .filter((hit) => hit.score > 0.02)
    .sort((left, right) => right.score - left.score);
  const limit = options.limit ?? 4;
  const diverse: RetrievalHit[] = [];
  const seenSources = new Set<string>();
  for (const hit of ranked) {
    const source = hit.sourceSlug ?? hit.id;
    if (!seenSources.has(source)) {
      diverse.push(hit);
      seenSources.add(source);
    }
    if (diverse.length === limit) return diverse;
  }
  for (const hit of ranked) {
    if (!diverse.some((entry) => entry.id === hit.id)) diverse.push(hit);
    if (diverse.length === limit) break;
  }
  return diverse;
}

export const OUT_OF_SCOPE_THRESHOLD = 0.13;

export function shouldRefuse(hits: RetrievalHit[]): boolean {
  return hits.length === 0 || hits[0].score < OUT_OF_SCOPE_THRESHOLD;
}

export function buildRetrievalOnlyAnswer(hits: RetrievalHit[], reason = 'model_unavailable'): string {
  if (shouldRefuse(hits)) {
    return "I don't have portfolio evidence for that question. Try asking about Alex's RAG systems, agent tooling, evaluation work, or engineering experience.";
  }

  const evidence = hits.slice(0, 2).map((hit) => {
    const clean = hit.text.replace(/\s+/g, ' ').trim();
    const excerpt = clean.length > 260 ? `${clean.slice(0, 257).trimEnd()}…` : clean;
    return `${excerpt} [${hit.id}]`;
  });
  const prefix = reason === 'local_demo'
    ? 'Retrieval-only demo: the deployed model endpoint is not configured in this build.'
    : 'The model endpoint is temporarily unavailable, so here is the retrieved evidence instead.';
  return `${prefix}\n\n${evidence.join('\n\n')}`;
}
