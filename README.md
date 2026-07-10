# Alexei Korol — AI engineering portfolio

[![CI and deploy](https://github.com/alexkorol/alexkorol.github.io/actions/workflows/ci.yml/badge.svg)](https://github.com/alexkorol/alexkorol.github.io/actions/workflows/ci.yml)

This repository is the code sample behind [alexkorol.github.io](https://alexkorol.github.io). Its primary feature is a cited “Ask my portfolio” RAG system over three project case studies, three engineering notes, and the resume. The model is behind a rate-limited Cloudflare Worker; the static site contains no provider credential and continues in retrieval-only mode when the model is unavailable.

## What this proves

- Retrieval is a tested subsystem: stable build-time chunks, deterministic 384-d feature-hash embeddings, BM25-style scoring, source-diverse top-k selection, an out-of-scope gate, and a committed eval set.
- Generation is bounded: Claude receives at most four retrieved chunks and a prompt contract that requires allow-listed source IDs for every claim.
- Failure is a product state: quota, overload, timeout, missing configuration, invalid citations, and network errors return an explicit retrieval-only answer with working sources.
- The site is a code sample: TypeScript, Vite, React, static prerendering, route metadata, unit tests, RSS, per-post OG images, a sitemap, Lighthouse budgets, and verified GitHub Pages deployment.

## Architecture

```text
content/**/*.md ──> build-time parser ──> typed content + RSS + sitemap + OG PNGs
       │                                      │
       └──> heading/sentence chunker ──> corpus.json ──> Cloudflare Worker
                                                            │
browser ──POST /ask──> origin/input checks ──> Durable Object rate limit
                                                            │
                              hybrid retrieval ──> out-of-scope gate
                                                            │
                                               Claude Messages API
                                                            │
                                    citation allow-list validation
                                                            │
                            live answer OR retrieval-only degraded answer
```

Trust boundaries:

- `VITE_PORTFOLIO_API_URL` is public configuration. It is safe in the browser bundle.
- `ANTHROPIC_API_KEY` is a Worker secret. It is never prefixed with `VITE_`, serialized into content, or returned by `/health`.
- Client IPs are SHA-256 hashed before choosing a per-client Durable Object. The Worker stores only a fixed-window counter.

## Key decisions

### Vite plus explicit static prerendering

The previous Create React App build produced one client-rendered document. Vite now builds the client bundle, then `scripts/prerender.tsx` renders every project and post route with `StaticRouter`. Each route receives its own title, description, canonical URL, Open Graph data, and body HTML. GitHub Pages can serve nested `index.html` files directly, so case studies remain crawlable without a Node server.

The prerendered document is not hydrated as one large React application. Navigation is standard multi-page HTML and a 3.3 KB gzipped progressive-enhancement client owns only the chat form. The 17 KB gzipped retrieval corpus is lazy-loaded only when local degraded mode is actually used. This removed 2.6 seconds of throttled total blocking time caught by CI Lighthouse while keeping the interactive feature intact.

### Small-corpus retrieval without a hosted vector database

The corpus is fewer than 50 bounded chunks and changes only at deploy time. A committed, deterministic feature-hash embedding avoids an embedding API, model cold start, vector service, and migration drift while still adding bigram and character-trigram similarity to lexical rank. BM25-style score carries 68%; embedding cosine carries 32%. Source-diverse selection prevents several resume chunks from crowding out the project evidence they summarize.

This is not presented as a universal RAG architecture. If the corpus becomes larger or semantically ambiguous, the upgrade path is versioned neural embeddings, an ANN index, and a migration/eval gate that compares both retrievers.

### Citation validation outside the model

Claude cites stable chunk IDs. The Worker extracts every bracketed ID and checks it against the exact retrieved set. Missing or unknown IDs cause a retrieval-only fallback. The model cannot invent a link that the client will render as a source.

### Durable rate limiting

A Cloudflare Durable Object owns each hashed client window and permits 10 questions per minute. This avoids pretending instance-local memory is a distributed rate limiter.

## Run locally

Requirements: Node 22 and npm.

```bash
npm ci
npm run dev
```

The site works without credentials; chat answers identify themselves as retrieval-only. To exercise the Worker locally:

```bash
npx wrangler secret put ANTHROPIC_API_KEY --config worker/wrangler.toml
npm run worker:dev
```

Then set `VITE_PORTFOLIO_API_URL` in `.env.local` to the local Worker URL and restart the site.

## Verification

```bash
npm run lint       # ESLint, including TypeScript rules
npm run typecheck  # site + Worker
npm run test       # retrieval and route behavior
npm run eval       # deterministic 18-case retrieval/refusal gate
npm run build      # content artifacts + Vite + static prerender
```

`npm run eval:live` uses `PORTFOLIO_API_URL` to test the deployed contract. It intentionally does not accept or require an Anthropic key; the endpoint owns credentials.

The workflow enforces Lighthouse scores of at least 95 for performance, accessibility, and SEO on the homepage, architecture page, and one case study. The badge above is the current CI result and links to the full logs and Lighthouse artifacts; it is used instead of a stale screenshot that could continue to show “passing” after the build regresses.

## Content pipeline

- `content/projects/*.md`: the only three featured case studies.
- `content/posts/*.md`: engineering notes with code, measurements, and a wrong-turn narrative.
- `content/resume.md`: the source for the generated resume PDF and resume RAG chunks.
- `scripts/generate-content.ts`: parses front matter, renders Markdown, chunks the corpus, generates typed modules, RSS, sitemap, resume PDF, and per-post 1200×630 PNG cards.
- `evals/cases.json`: in-scope and out-of-scope questions with expected sources.
- `evals/results.json`: last committed offline result used by `/how-it-works/`.

## Deployment

Pushes to `main` run lint, typecheck, tests, evals, a static build, and Lighthouse before GitHub Pages deployment. The Worker deploy step runs only when repository secrets `CLOUDFLARE_API_TOKEN` and `ANTHROPIC_API_KEY` exist. Set the Actions variable `PORTFOLIO_API_URL` to the deployed Worker origin so the static build uses the live model path.

The current public domain is the HTTPS GitHub user domain, `alexkorol.github.io`. No separate custom-domain ownership is asserted in this repository; adding one requires a verified DNS name and a `CNAME` file.

## Evidence policy

Project metrics come from public repositories and checked-in result artifacts. Small-sample LLM judge results are labeled as calibration or smoke tests. The portfolio does not claim human correlation, production traffic, or live-model eval results that have not been measured.
