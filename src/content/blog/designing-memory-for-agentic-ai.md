---
title: "Designing memory for autonomous agents"
date: "2026-04-05"
description: "A first-principles walkthrough of building a memory subsystem for an LLM-driven agent. It covers why a single store cannot satisfy latency, durability, and recall simultaneously, and how a dual-layer design resolves the trade-off."
tags: ["agentic-ai", "memory", "systems", "design-notes"]
draft: false
---

An agent without memory cannot learn from its own history. An agent with too much memory, or memory in the wrong place, cannot think fast enough to act. These two statements look obvious in isolation, but almost every memory subsystem I have sketched from scratch has collapsed under one or the other. What survives is a design that takes the failure modes seriously from the start, and that design invariably ends up looking layered rather than monolithic. The rest of this post is an attempt to walk through why.

## What an agent needs from memory

Before choosing a store, it helps to enumerate what the agent asks memory for during a single step of reasoning. It needs recent context of the current task, including the user's last message, the tool calls it has already emitted, and any intermediate scratchpad state. It needs cross-session episodic recall, the sort of "last week this same user asked me to do X and we settled on approach Y" that makes the agent feel coherent rather than amnesiac. It needs semi-permanent preferences and facts, such as settings, corrected mistakes, and named entities introduced earlier in the relationship. And it needs task-scoped working memory, the intermediate results produced during a reasoning chain that will be discarded the moment the task completes.

These are four distinct request patterns. The first and fourth are hot-path and latency-sensitive; they happen tens or hundreds of times per turn. The second and third are cold-path but must survive process restarts. Any design that treats them uniformly will be wrong on at least one of those axes.

## Three tempting monolithic designs

Three single-store designs come to mind first, and each is instructive in its failure mode.

The first is to keep everything in process memory, whether that is a large in-process dictionary or a local key-value cache. Reads and writes are sub-millisecond and the agent flies. But the store is ephemeral, and a crash or a routine deployment wipes every durable entry. Acceptable for a demo, fatal for anything users actually rely on.

The second is to put everything in a database. Durability is solved; every entry survives a restart. But every hot-path read now pays at minimum a disk seek and at most a network round trip. For a reasoning chain that issues dozens of reads per step, the accumulated latency becomes the dominant cost of a turn. The agent thinks at the speed of the disk.

The third is to serialize everything into the prompt and let the language model's context window do the work. This is durable between turns by virtue of being re-sent, and it is conceptually simple. But context length scales linearly with memory size, and attention to any specific memory degrades as the context fills. Old memories are effectively forgotten long before they are deleted.

Each design wins one axis and loses another. That is a strong signal the single-store framing is the wrong one.

## The axes are independent, so the store should be too

The trade-off has two axes, latency and durability, and they are independent. Making an entry durable does not have to make it slow, and making an entry fast to access does not have to make it ephemeral. But you cannot get both properties from a single store without paying for the worst case on every request. The clean fix is to let the author of the write pick a point on each axis independently, which suggests two layers rather than one.

## Splitting by lifetime

The cleanest way I have found to draw the boundary is not "hot versus cold," which would require predicting access patterns you do not have at write time, but **ephemeral versus durable**. An entry is ephemeral if it exists to support the current task and has no value after the task completes. An entry is durable otherwise. The classification happens at the moment of writing, from the caller's own knowledge of why the memory exists. A scratchpad calculation the agent uses to reconcile two tool outputs is ephemeral. A user saying "always use metric units" is durable.

This distinction has one enormous advantage over heuristic tiering: it does not produce long-tail edge cases. There is no "what if an entry becomes important later?" argument, because that is the caller's problem to decide at write time. If the decision later turns out to be wrong, a future durable write can correct it; the store does not have to guess.

## The persistent layer

For the durable side, the right default is the most boring embedded store that fits the throughput profile, which for most single-process agents means SQLite. A single table suffices, with columns for a namespace identifier like user ID or conversation ID, a key, an opaque value blob, a set of tags, and created and updated timestamps. Two indexes cover the access patterns that matter: one on namespace and key for exact lookups, and one on namespace and updated timestamp descending for recency queries.

The namespace column is the most important design choice. Without it, every cross-user leak becomes a possibility that code review has to prove against. With it, isolation is a property of the schema, and the worst a logic bug can do is fail to enforce the right namespace, not accidentally cross them.

Retrieval from this layer is a two-stage process. Deterministic facts like preferences are fetched by exact-key lookup. Episodic memories, the "what did we discuss about topic X" kind, are fetched through a tag-scoped similarity search, which is where a separate vector index becomes useful. I keep the vector index outside SQLite and join back by ID at query time, which keeps the storage and retrieval concerns cleanly separated.

## The transient layer

The transient layer is smaller and simpler. A plain dictionary keyed by session identifier, with each session holding its own sub-dictionary of working memory, suffices for most single-process agents. Two invariants matter. Every session must have a well-defined end, so the layer can drop that session's data. And no entry should ever live longer than its session. A session that never ends, or a session whose entries survive its end, is both a memory leak and a correctness bug.

## The boundary between the layers

The subtle work happens at the boundary. When a session ends, some working memory is worth preserving and most is noise; when a conversation resumes, some durable memory is worth pre-loading into the transient layer and the rest should stay on disk until a specific query asks for it. I call the first a compaction pass and the second a hydration pass.

Compaction is the more interesting of the two. The naive version copies everything, which defeats the point of having two layers. The sophisticated version asks the agent itself to summarize the session into a small number of durable entries, possibly one per topic. A reasonable middle ground writes a single summary entry keyed by session and topic, plus any explicitly flagged durable facts the agent discovered during the turn. That second step is what rescues compaction from being pure summarization. A user stating a preference is a fact with global scope and should be stored as such, not buried inside a session summary.

Hydration is the easier side, and the thing to avoid is over-hydration. Pulling the top handful of persistent entries tagged with the current topic, bounded by a small fixed count, is almost always enough. The rest of the persistent store stays on disk until a retrieval query goes looking for it.

## A session, from start to finish

Putting the layers together, a single session flows like this. On start, the persistent layer is queried for entries tagged with the incoming topic or user; the top few are loaded into the transient layer for fast access during the turn. During reasoning, reads go first to the transient layer and fall back to the persistent store on miss, which keeps steady-state latency in RAM territory. Writes default to transient; writes explicitly flagged durable go to both layers, with the persistent write happening as a background commit at the turn boundary. On session end, the compaction pass produces the small set of durable entries worth keeping, and the transient layer's session bucket is dropped.

The whole thing feels, from the agent's perspective, like a single store with the right latency and the right durability for each entry. From the implementer's perspective, it is two stores with a disciplined contract at the boundary.

## What stays open

A few problems are not cleanly solved by this sketch. Concurrent sessions for the same user need a conflict resolution policy, and last-write-wins is simple but usually wrong. The persistent store grows monotonically, and some form of archival policy is eventually necessary, but "what is safe to archive" is another prediction problem. Cross-agent sharing, where multiple agents read from the same user's memory, needs a broker layer that the namespace schema cannot by itself provide.

None of these is fatal, and all of them are specific enough that the shape of a solution is visible even if the solution itself is not.

> If you are sketching a memory subsystem, start from the four request patterns this post opens with. Make sure the design can answer each of them without violating the one it was not designed for. That is the test I keep coming back to, and it has yet to let me down.
