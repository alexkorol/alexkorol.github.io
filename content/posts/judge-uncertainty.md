---
title: "I stopped treating one LLM score as a measurement"
date: "2026-07-09"
summary: "A single judge call hid variance. Three runs per rubric cost more, but exposed disagreement and created a concrete human-review gate."
tags: ["LLM evals", "observability", "cost"]
readTime: "5 min"
---
My first lyric evaluator returned one number per rubric. It was easy to chart and impossible to trust. Small wording changes and sampling variance could move a score, while the JSON still looked authoritative.

## The wrong turn

I initially lowered temperature and accepted one result. That reduced visible variance by suppressing it, not by measuring it. For subjective dimensions such as authenticity and emotional resonance, a deterministic-looking answer was the wrong product behavior.

The current Prosody Judge runs each of eight rubrics three times:

```python
runs = await gather_bounded(
    *(judge(item, rubric, temperature=0.7) for _ in range(3)),
    concurrency=5,
)
spread = max(runs) - min(runs)
consensus = spread <= 2
```

A full item can require 24 judge calls. That is intentionally expensive compared with the first version.

## What it bought

Each dimension now has a mean, standard deviation, raw score vector, and consensus flag. Disagreement becomes routable state instead of an anecdote in a log. The four-item calibration cost $0.067 and separated a generic AI sample at 2.0 authenticity from a human sample at 8.7.

That calibration is a smoke test, not validation. Four items cannot establish agreement with human taste. The next gate is a blinded benchmark with at least 100 pairwise human ratings, prompt/model version provenance, and disagreement analysis.

## Cost controls are part of evaluation quality

Batch jobs checkpoint JSONL, resume by record ID, bound concurrency, and stop between chunks when the requested USD budget is reached. An eval that cannot survive a timeout or state its cost will not stay in the development loop long enough to catch regressions.

