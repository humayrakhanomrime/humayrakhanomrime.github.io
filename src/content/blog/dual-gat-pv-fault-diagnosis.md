---
title: "Designing dual-attention graph networks for fault diagnosis"
date: "2026-03-11"
description: "A walkthrough of building a dual-branch graph attention network for sensor-based fault diagnosis: constructing spatial and spectral graphs, running parallel attention, and fusing the branches without letting one dominate the other."
tags: ["graph-neural-networks", "attention", "fault-diagnosis", "design-notes"]
draft: false
---

Sensor-based fault diagnosis is one of the few problems where a graph neural network is not an aesthetic choice. The system under test has an explicit physical topology, and the sensors are literally connected to one another through that topology. The question is not whether to use a graph network but which graph to use, and my experience has been that the honest answer is almost always "more than one." The rest of this post is a walk through why, using a sensor-rich power inverter as the running example, though the pattern applies to any system whose signals have both a spatial and a spectral structure.

## The shape of the problem

The task, in the abstract, is to take a short window of sensor readings and classify the current operating state of the system into one of several fault classes, with a healthy class included. Three properties of the data drive everything that follows.

The first is that the sensors sit at known physical positions relative to each other, and their pairwise coupling is well characterized. A voltage probe on one inverter leg and a thermal probe on an adjacent power stage share a clear physical relationship; a voltage probe and one on an electrically isolated branch do not. This is a graph, and it is handed to you for free by the system schematics.

The second is that the signals exhibit fault-specific harmonic content that is often more diagnostic than the raw time-domain waveform. Certain fault modes appear as distinct peaks in the frequency decomposition that do not show up clearly, if at all, in the unprocessed signal. Any architecture that treats the time series as its only input is leaving diagnostic information on the table.

The third is severe class imbalance. The healthy class dominates by one or two orders of magnitude, and some fault classes have fewer than a hundred training examples. A model that maximizes accuracy will quickly discover the trivial strategy of always predicting healthy and get a very good number for doing nothing useful.

## Two views, two graphs

The spatial structure gives one graph for free. Nodes are sensors; each node carries its time-window reading as a feature vector. Edges connect sensors that are physically coupled according to the system's topology. The edge set is fixed across samples, which is a feature rather than a limitation. The attention mechanism only has to learn how to use the structure, not infer what the structure is.

The spectral structure gives a second graph, and the construction matters more than the first. Start from a short-time frequency decomposition of the sensor window and build a graph whose nodes are frequency bands, not sensors. Each node's feature vector encodes the magnitude of that band across all sensors, which is the piece that carries the fault-specific harmonic information. The edges on this graph cannot come from physics, since there is no physical topology of frequencies, so they must come from the data itself. A reasonable default is to connect each band to its nearest neighbors in a coherence sense, measuring how correlated the band magnitudes are across training examples. A fully connected spectral graph gives attention nothing to specialize against; a coherence-pruned one gives it a meaningful structure to focus on.

## Why a merged single-graph model drifts

One tempting move is to merge both views into a single heterogeneous graph: add both kinds of nodes, add both kinds of edges, and let attention sort them out. In practice this nearly always ends with one modality dominating. The reason lies in how graph attention normalizes. Each node's attention is a softmax over its neighbors. If the spatial side of the merged graph gives most nodes four neighbors while the spectral side gives them fifty, the spectral softmax is already much softer before any training has happened. Gradient updates preferentially flow through whichever side has the steeper local loss surface, and within a handful of epochs the model has collapsed into an effectively single-view classifier.

Keeping the branches architecturally separate avoids this entirely. Each branch has its own normalization regime and its own attention weights. Neither branch can drown the other out during optimization because they are not, in fact, competing for the same softmax mass.

## Two parallel branches, fused late

The architecture that falls out of this is two parallel graph attention networks, each two layers deep with a small number of attention heads, each seeing only its own graph. The spatial branch processes the sensor graph; the spectral branch processes the frequency-band graph. Both emit a node-level embedding tensor, which is reduced to a graph-level embedding by averaging across nodes.

The fusion layer is where the design decision of how much cross-talk to allow shows up. The simplest option, and the one I recommend as a default, is to concatenate the two graph-level embeddings and run them through a small multilayer perceptron ending in a classifier head. This is boring and it works. The alternatives, such as a gated sum where the model learns branch-wise weights, or a cross-attention layer where one branch queries the other, either add hyperparameters that are sensitive to initialization or introduce a capacity that small training sets cannot support. Unless you have a specific reason to need cross-branch interactions inside the fusion, concatenation is the right choice.

## Why loss engineering beats architecture

With imbalance in the range described, the single biggest determinant of validation performance is not the architecture. It is the loss function. Plain cross-entropy trains a model that is more than ninety-nine percent accurate by always predicting healthy. To train anything useful, you have to either reweight the loss per class, focus the loss on hard examples, or both.

The pattern I keep coming back to is a class-balanced focal loss. The class-balanced part multiplies each class's cross-entropy contribution by a weight derived from the effective-number-of-samples formula, which is specifically designed to handle classes with very few examples without the instability of raw inverse-frequency weighting. The focal part multiplies each example's loss by one minus its predicted probability raised to a focusing exponent, usually somewhere between one and a half and two and a half. Together they prevent the majority class from saturating the gradient and keep the model paying attention to hard, rare examples.

An alternative is oversampling the minority classes in the dataloader. It works, but combining it with focal loss tends to overcorrect: the minority class starts to dominate the gradient and the model collapses in the opposite direction. Pick one tool or the other, not both.

## What to watch during training

The validation dashboard should lead with macro-F1, which weights all classes equally and therefore actually reflects what you care about. Directly below it should be per-class recall, which is the single metric that most cleanly reveals when the model is silently ignoring a rare class. Validation accuracy should not be on the dashboard at all; it is misleading under imbalance.

One more signal is worth tracking even though it is not a metric per se: the histogram of attention weights, one histogram per branch. A branch whose attention has collapsed to near-uniform has effectively stopped learning. Seeing this early, before the validation curve reveals it, tells you that something in the training regime is wrong.

## Extensions worth trying

A few directions look promising. Dynamic edge construction for the spectral graph, where the coherence-based edges are re-weighted per sample rather than held fixed across the dataset, gives the model a way to adapt when a particular fault activates an unusual band pair. Temporal attention across successive windows, where the diagnosis becomes a function of not just the current window but a short history of windows, should help when the fault has a time constant longer than a single window. And contrastive pretraining on the abundant healthy signals, followed by supervised fine-tuning on the rare faults, gives the backbone a head start on a representation that transfers cleanly to the fine-grained classification task.

> The single piece of advice I would emphasize is to resist the temptation to merge the two views into one graph. Two competent branches beat one clever fused branch almost every time, and the engineering cost of keeping them separate is negligible compared to the cost of debugging a collapsed attention layer.
