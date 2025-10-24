---
title: "Rendering Sprints with Diffusion Maps"
date: "2024-05-28"
tags:
  - ai-art
  - tooling
excerpt: "Trialing a diffusion-map layout to batch critique iterative image generations."
---
### Workflow snapshot

Sculpted a lightweight CLI to snapshot every fourth latent during training. Streaming them onto a 2D diffusion map kept semantic neighbors tight while preserving interesting outliers.

### Findings

* Spatial drift correlated strongly with attention head entropy.
* A warm-started scheduler trimmed convergence time by 11% without quality loss.

### Next steps

Integrate the map view into the review dashboard and expose per-cluster prompts for rapid annotation.
