---
title: "I built this portfolio RAG to fail usefully"
date: "2026-07-08"
summary: "The model call is optional; retrieval, citations, refusal checks, and a useful degraded answer continue when quota or configuration fails."
tags: ["RAG", "serverless", "reliability"]
readTime: "7 min"
---
The easy version of “ask my portfolio” is a browser calling a model with a large biography prompt. That leaks credentials if implemented carelessly, spends tokens on every page view, and turns a quota error into a dead box.

## The wrong turn

My first sketch put every source in the system prompt. The corpus is small, so it looked reasonable. It also made cost grow with the portfolio, removed retrieval as an independently testable stage, and gave out-of-scope questions too much room to improvise.

The shipped path chunks build-time Markdown by heading and paragraph, keeps 120 characters of overlap, and retrieves four chunks with a hybrid of BM25-style term scoring and a deterministic 384-dimension feature-hash embedding. The embedding is deliberately local and sparse: no cold-start model download and no separate embedding bill for this small, stable corpus.

```ts
const hits = retrieve(question, corpus, { limit: 4 });
if (hits[0]?.score < OUT_OF_SCOPE_THRESHOLD) return refusal();

try {
  return await callClaude(question, hits);
} catch (error) {
  return retrievalOnlyAnswer(hits, "model_unavailable");
}
```

## What failure looks like

The Cloudflare Worker owns the Anthropic secret and rate limit. It validates request size and origin, hashes the client address before selecting a Durable Object, and bounds model time. A quota response, timeout, or missing secret returns retrieved evidence with working citations and an explicit `retrieval-only` mode. It never pretends the fallback came from Claude.

## Cost envelope

The prompt sends at most four chunks of roughly 900 characters. The public cost page computes an estimate from the configured input/output token ceilings and states every pricing assumption. The offline eval harness checks expected-source retrieval, citation validity in degraded answers, and refusal correctness. Live-model scoring is a separate mode so a missing API key cannot turn CI red or encourage hidden credentials.

