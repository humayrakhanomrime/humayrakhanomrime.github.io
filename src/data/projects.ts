import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "graphbit",
    title: "GraphBit",
    subtitle: "Open Source · 530+ Stars",
    category: "work",
    description:
      "An agentic AI framework featuring a dual-layer memory architecture for context-aware autonomous agents. Combines SQLite-backed persistent memory with an in-memory transient layer for fast, session-scoped working memory.",
    contributions: [
      "Designed and implemented the memory mechanism as core developer",
      "Architected a dual-layer memory system for context-aware agent behaviour",
      "Built a persistent memory layer backed by SQLite for long-term knowledge retention and retrieval across agent sessions",
      "Developed an in-memory storage layer for transient, session-scoped context, enabling low-latency access to short-lived working memory during agent reasoning",
      "Enabled agents to maintain coherent state across sessions while keeping real-time reasoning latency low",
    ],
    links: {
      code: "https://github.com/InfinitiBit/graphbit",
    },
    stars: 530,
    isOpenSource: true,
  },
  {
    id: "dual-gat",
    title: "Dual-GAT Fault Diagnosis",
    subtitle: "Scientific Reports (Nature), 2025",
    category: "research",
    description:
      "Developed a dual graph attention network (Dual-GAT) for automated fault detection and classification in photovoltaic inverter systems. The model leverages both spatial and spectral graph convolutions to capture complex inter-feature relationships, enabling robust diagnosis under noisy and imbalanced operating conditions.",
    contributions: [
      "Proposed a Dual-GAT architecture combining spatial and spectral graph convolutions",
      "Captured complex inter-feature relationships in photovoltaic inverter fault signals",
      "Achieved robust fault diagnosis under noisy and imbalanced conditions",
      "Published in Scientific Reports (Nature), vol. 15, no. 1, p. 31330, 2025",
    ],
  },
  {
    id: "hyperspectral",
    title: "Hyperspectral Image Classification",
    subtitle: "ICCIT 2022 (IEEE)",
    category: "research",
    description:
      "Proposed an attention-aware memory aggregation network that combines spectral-spatial feature extraction with an external memory module for improved classification of hyperspectral remote sensing imagery.",
    contributions: [
      "Designed an attention-aware memory aggregation network for hyperspectral image classification",
      "Combined spectral-spatial feature extraction with an external memory module",
      "Developed an attention mechanism that selectively emphasises discriminative spectral bands",
      "Memory module retains representative class prototypes across training iterations",
      "Published at the 25th ICCIT, IEEE, 2022",
    ],
  },
];
