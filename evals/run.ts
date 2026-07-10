import fs from 'node:fs/promises';
import path from 'node:path';
import casesJson from './cases.json';
import { corpus } from '../src/generated/content';
import { buildRetrievalOnlyAnswer, retrieve, shouldRefuse } from '../shared/retrieval';
import type { ChatResponse, EvalResults } from '../src/types';

interface EvalCase { id: string; question: string; scope: 'in' | 'out'; expectedSource?: string }
const cases = casesJson as EvalCase[];
const live = process.argv.includes('--live');

async function main(): Promise<void> {
  const inScope = cases.filter((entry) => entry.scope === 'in');
  const outOfScope = cases.filter((entry) => entry.scope === 'out');
  let expectedHits = 0;
  let grounded = 0;
  let correctRefusals = 0;
  const failures: string[] = [];

  for (const testCase of cases) {
    const hits = retrieve(testCase.question, corpus, { limit: 4 });
    if (testCase.scope === 'in') {
      const topThree = hits.slice(0, 3);
      const foundExpected = topThree.some((hit) => hit.sourceSlug === testCase.expectedSource);
      if (foundExpected) expectedHits += 1;
      else failures.push(`${testCase.id}: expected ${testCase.expectedSource}, got ${topThree.map((hit) => hit.sourceSlug).join(', ') || 'nothing'}`);

      if (live) {
        const endpoint = process.env.PORTFOLIO_API_URL;
        if (!endpoint) throw new Error('PORTFOLIO_API_URL is required for --live');
        const response = await fetch(`${endpoint.replace(/\/$/, '')}/ask`, { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ question: testCase.question }) });
        const payload = await response.json() as ChatResponse;
        const allowed = new Set(hits.map((hit) => hit.id));
        if (payload.citations.length > 0 && payload.citations.every((citation) => allowed.has(citation.id))) grounded += 1;
      } else {
        const answer = buildRetrievalOnlyAnswer(hits, 'eval');
        const cited = [...answer.matchAll(/\[([a-z0-9-]+)]/gi)].map((match) => match[1]);
        const allowed = new Set(hits.map((hit) => hit.id));
        if (cited.length > 0 && cited.every((id) => allowed.has(id))) grounded += 1;
        else failures.push(`${testCase.id}: degraded answer emitted missing or invalid citations`);
      }
    } else {
      if (shouldRefuse(hits)) correctRefusals += 1;
      else failures.push(`${testCase.id}: should refuse, top hit ${hits[0]?.id} at ${hits[0]?.score.toFixed(3)}`);
    }
  }

  const results: EvalResults = {
    generatedAt: new Date().toISOString(),
    mode: live ? 'live-worker' : 'offline-retrieval',
    totals: { inScope: inScope.length, outOfScope: outOfScope.length },
    metrics: {
      expectedSourceRecallAt3: expectedHits / inScope.length,
      groundedAnswerRate: grounded / inScope.length,
      refusalCorrectness: correctRefusals / outOfScope.length,
    },
  };
  console.log(JSON.stringify({ ...results, failures }, null, 2));
  if (!live) await fs.writeFile(path.join(process.cwd(), 'evals', 'results.json'), `${JSON.stringify(results, null, 2)}\n`);
  if (failures.length > 0) process.exitCode = 1;
}

await main();
