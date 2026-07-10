import { describe, expect, it } from 'vitest';
import { posts, projects } from '../generated/content';
import { corpus } from '../generated/corpus';
import { buildRetrievalOnlyAnswer, retrieve, shouldRefuse } from '../../shared/retrieval';

describe('portfolio corpus', () => {
  it('ships exactly three deep project case studies and three seeded posts', () => {
    expect(projects).toHaveLength(3);
    expect(posts).toHaveLength(3);
    expect(projects.every((project) => project.metrics.length >= 3 && project.architecture.length >= 5)).toBe(true);
  });

  it('retrieves agent evidence from Repo2GPT', () => {
    const hits = retrieve('Has Alex built agentic systems with MCP tools?', corpus, { limit: 3 });
    expect(hits.some((hit) => hit.sourceSlug === 'repo2gpt')).toBe(true);
  });

  it('refuses an unrelated cooking question', () => {
    expect(shouldRefuse(retrieve('How do I keep sourdough starter alive?', corpus))).toBe(true);
  });

  it('uses only retrieved IDs in degraded answers', () => {
    const hits = retrieve('How does Alex evaluate RAG retrieval?', corpus);
    const answer = buildRetrievalOnlyAnswer(hits, 'test');
    const citations = [...answer.matchAll(/\[([a-z0-9-]+)]/g)].map((match) => match[1]);
    expect(citations.length).toBeGreaterThan(0);
    expect(citations.every((id) => hits.some((hit) => hit.id === id))).toBe(true);
  });
});
