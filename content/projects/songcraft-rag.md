---
title: "SongCraft RAG"
kicker: "Evaluated retrieval system"
summary: "Hybrid retrieval over a 45-document songwriting corpus, with local embeddings, cross-encoder reranking, cited answers, and a committed 83-question golden set."
order: 2
status: "Open source · evaluated"
repo: "https://github.com/alexkorol/songcraft-rag"
architecture:
  - "45 public PDFs"
  - "1,000-char chunks · 200 overlap"
  - "BM25 + BGE-small embeddings"
  - "RRF + cross-encoder rerank"
  - "Cited answer + traces"
metrics:
  - value: "0.952"
    label: "document recall@10"
    note: "hybrid + rerank, 83-question golden set"
  - value: "0.711"
    label: "exact chunk recall@5"
    note: "+26% relative to the dense baseline"
  - value: "7,370"
    label: "unique chunks"
    note: "2,376 pages across 45 documents"
tags: ["RAG", "FastEmbed", "ChromaDB", "reranking", "LangSmith"]
evidenceUpdated: "2026-07-10"
---
## Problem

Generic music models can produce plausible advice without exposing where it came from. SongCraft RAG needed to answer craft questions and critique draft lyrics from a bounded reference corpus, while making retrieval quality testable independently from generation quality.

## Hardest decision: widen retrieval, then spend precision on reranking

Dense retrieval was the clean baseline. Adding BM25 with reciprocal-rank fusion increased document recall@10 from 0.904 to 0.940, but it made the top of the ranking worse: document recall@1 fell from 0.663 to 0.554. Treating “hybrid” as automatically better would have shipped a regression.

The fix was a two-stage design. Hybrid search fetches a wider 20-candidate pool; a local `ms-marco-MiniLM-L-6-v2` cross-encoder reranks that pool down to five passages. The extra local inference recovered top-rank precision and raised exact-chunk recall@5 from 0.566 to 0.711.

```python
candidates = reciprocal_rank_fusion(dense_hits, bm25_hits, k=60)
ranked = cross_encoder.predict([(question, hit.text) for hit in candidates[:20]])
context = take_top(candidates, ranked, k=5)
```

## Measured results

All retrieval numbers come from the committed 83-question golden set and the checked-in 2026-07-10 result file. Hybrid + rerank reached 0.699 document recall@1, 0.952 document recall@10, 0.711 exact-chunk recall@5, and 0.782 MRR@10. A 25-answer dense-mode sample received 5.0/5 faithfulness and relevance from the configured judge; that small judged sample is reported as a smoke test, not a general quality guarantee.

## Observability and regression control

`GET /stats` exposes actual OpenRouter spend, token use, and mean latency. LangSmith tracing can be enabled without code changes. The test suite covers chunking, SHA-256 deduplication, rank fusion, reranking, and citation formatting; CI runs tests, Ruff, and mypy.

## What I would change at scale

ChromaDB and local ONNX models keep this project cheap and reproducible. A multi-instance service would move vectors to a managed store, version corpus and embedding migrations, and split retrieval latency by stage in an OpenTelemetry trace.

