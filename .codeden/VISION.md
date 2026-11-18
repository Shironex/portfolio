# Vision

Describe what this project is for. The factory scores every piece of work against this file.

## Goals
- What should this project achieve in the next months?

## Target users
- Who uses it, and what do they need?

## Principles
- Small, well-tested changes
- Keep the public API stable

## Out of scope
- Things the factory must never propose

## Quality bar
- Every behaviour change comes with tests
- CI is green before merge

## Protected areas
Paths (globs in backticks) and topics that always need a human. The factory never merges
changes that touch them; they go to your inbox.
- `**/auth/**`
- `**/migrations/**`
- `.github/workflows/**`
- `LICENSE`
- payments
- licensing

## Agent defaults
- Model: Sonnet for docs, notes, plans, decision records, reviews of small diffs, mechanical edits and searches; Opus only for hard code (new modules, security, cross-package changes, debugging) and say why in the brief.
- Effort: `medium` by default, `low` for docs, notes and mechanical edits, `high` only for a hard design or debugging task, with the reason in the brief.
- At most 2 agents running at once for this project; queue the rest.
- One issue or PR per agent; end the session when its PR is open or its report is in, and start a fresh agent for the next task instead of reusing a long session.
