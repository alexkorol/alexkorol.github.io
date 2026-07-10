---
title: "Prosody Judge"
kicker: "LLM evaluation and guardrails"
summary: "An eight-rubric LLM-as-a-judge pipeline with async batching, multi-run self-consistency, structured outputs, uncertainty flags, checkpoints, and spend limits."
order: 3
status: "Open source · calibration stage"
repo: "https://github.com/alexkorol/prosody-judge"
architecture:
  - "Lyrics + process trace"
  - "8 independent rubrics"
  - "3 judge runs per dimension"
  - "Mean · stdev · consensus"
  - "JSON signal + review flags"
metrics:
  - value: "$0.067"
    label: "four-item calibration"
    note: "actual recorded API cost"
  - value: "24"
    label: "judge calls per full item"
    note: "8 rubrics × 3 self-consistency runs"
  - value: "2.0 → 8.7"
    label: "authenticity separation"
    note: "generic AI sample vs human sample in smoke calibration"
tags: ["LLM evals", "structured output", "async", "GRPO", "cost controls"]
evidenceUpdated: "2026-07-10"
---
## Problem

A single LLM score looks precise while hiding prompt sensitivity and judge variance. Prosody Judge evaluates generated lyrics and their attached process traces for a future training loop, but it must surface uncertainty instead of converting taste into fake ground truth.

## Hardest decision: pay for repeated judgments

One judge call per rubric was cheap and unstable. The current pipeline runs every dimension three times at temperature 0.7, then records the mean, standard deviation, raw runs, and a consensus flag. That triples judge spend, but gives downstream code a reason to route disagreement cases to humans.

```python
scores = await asyncio.gather(*[
    judge_dimension(item, rubric) for _ in range(3)
])
result = {
    "mean": statistics.mean(scores),
    "stdev": statistics.stdev(scores),
    "consensus": max(scores) - min(scores) <= 2,
}
```

## Measured results

The checked-in four-item calibration cost $0.067. In that smoke set, the judge assigned authenticity 8.7 to a human lyric and 2.0 to a deliberately generic AI sample. This proves the pipeline and a coarse sanity check; it does not prove human correlation. The repository says so directly and defines the next gate as at least 100 blinded pairwise human ratings.

## Failure recovery and observability

Async calls are concurrency-bounded. Batch evaluation records per-item failures without discarding successful results. The process-judging path appends JSONL checkpoints, skips completed record IDs on resume, and checks a caller-supplied USD budget between chunks. Each output records model, run count, timestamp, cost, and rubric-level reasoning.

## What I would change at scale

Before using scores for GRPO rewards or preference data, I would measure agreement against human raters, version every rubric and model identifier, and monitor score-distribution drift. The current result is an instrument under calibration, not an oracle.

