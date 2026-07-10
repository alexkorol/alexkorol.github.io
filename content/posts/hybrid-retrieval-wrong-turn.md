---
title: "Hybrid retrieval made my top result worse"
date: "2026-07-10"
summary: "I added BM25 to a dense RAG retriever, watched recall@1 regress, and used a cross-encoder to turn a wider candidate pool into a measurable win."
tags: ["RAG", "evals", "reranking"]
readTime: "6 min"
---
I expected hybrid retrieval to be an automatic upgrade. The intuition was sound: embeddings catch semantic matches; BM25 catches exact music terms and names. The first result still failed the metric that matters when only a few chunks reach the prompt.

## The wrong turn

On SongCraft RAG's 83-question golden set, dense retrieval put the correct document first 66.3% of the time. BM25 plus dense retrieval increased document recall@10 from 90.4% to 94.0%, but recall@1 dropped to 55.4%.

I had widened the net and made the top of the list noisier.

```python
def rrf(rankings, k=60):
    scores = defaultdict(float)
    for hits in rankings:
        for rank, hit in enumerate(hits, start=1):
            scores[hit.id] += 1 / (k + rank)
    return sorted(scores, key=scores.get, reverse=True)
```

RRF was doing what I asked. The error was treating candidate generation as final ranking.

## What fixed it

I fetched 20 hybrid candidates and reranked question/passage pairs with a local `ms-marco-MiniLM-L-6-v2` cross-encoder. That moved document recall@1 to 69.9%, exact-chunk recall@5 from the dense baseline's 56.6% to 71.1%, and MRR@10 from 0.750 to 0.782.

The cross-encoder costs extra local latency, so I kept both stages observable. A future latency budget can decide whether the 26% relative gain in exact-chunk recall@5 earns its place on every route.

## What I measure now

I keep document recall and exact-chunk recall separate. A system can find the right PDF while missing the passage that supports an answer. I also report every retrieval mode in the same results file, with the golden-set version, so a “better” architecture cannot quietly redefine success.

