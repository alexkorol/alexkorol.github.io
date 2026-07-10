---
title: "Repo2GPT"
kicker: "Agent context infrastructure"
summary: "An MCP, API, and CLI system that lets coding agents inspect a repository, budget context, and recover from oversized or noisy snapshots."
order: 1
status: "Open source · active"
repo: "https://github.com/alexkorol/repo2GPT"
architecture:
  - "Agent plans context request"
  - "MCP processRepo tool"
  - "Language-aware repo map"
  - "Token-bounded artifacts"
  - "Agent fetches only needed chunks"
metrics:
  - value: "3"
    label: "MCP tools"
    note: "processRepo, listRecentJobs, getArtifact"
  - value: "500 KB"
    label: "default file guard"
    note: "prevents generated/vendor files from flooding context"
  - value: "10"
    label: "GitHub stars"
    note: "verified through the GitHub API on 2026-07-10"
tags: ["MCP", "Python", "FastAPI", "SSE", "agent tooling"]
evidenceUpdated: "2026-07-10"
---
## Problem

Coding agents fail when repository context is selected by convenience instead of intent. Copying an entire tree pulls in build output, dependency locks, and generated files; copying a few files hides the call graph. The result is either a blown context window or a confident answer based on missing evidence.

## Hardest decision: artifacts instead of a bigger prompt

The tempting implementation was one `dump_repo()` call that returned everything. That made the demo easy and the operating behavior bad. Repo2GPT instead exposes a staged tool surface: create a snapshot job, inspect its language-aware map and token statistics, then fetch only the relevant artifact.

This adds orchestration work for the agent, but it creates a recovery path. An oversized request can be retried with ignore patterns or a smaller chunk ceiling; a stale job can be inspected rather than silently repeated; long work reports progress over SSE instead of holding a request open.

```json
{
  "source": {"type": "git", "url": "https://github.com/org/repo", "ref": "main"},
  "chunk_token_limit": 3500,
  "enable_token_counts": true,
  "options": {"ignore_patterns": ["*.ipynb"], "allow_non_code": false}
}
```

## Failure recovery

The MCP workflow is deliberately multi-step: `processRepo` produces durable job and artifact identifiers, `listRecentJobs` lets an agent recover state after interruption, and `getArtifact` retrieves one map or code chunk without recomputing the repository. Authentication, health checks, persisted jobs, and bounded file sizes make the tool usable beyond a happy-path wrapper.

## Measured evidence

The public repository includes pytest coverage for the end-to-end processing path, language summaries, ignore/include semantics, token counting, and the MCP server. The 500 KB default file guard is an explicit reliability constraint, not a benchmark claim. A repository-specific context-reduction benchmark is kept out of this page until it is reproduced in CI.

## What I would change at scale

The on-disk job store is appropriate for a single durable deployment. Multi-instance production would move artifacts to object storage, job state to a transactional store, and clone execution to a sandboxed queue worker with per-tenant quotas.

