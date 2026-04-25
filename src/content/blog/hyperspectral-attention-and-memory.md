---
title: "Attention and external memory for hyperspectral classification"
date: "2026-02-07"
description: "A first-principles walk through hyperspectral image classification. It covers why the data shape breaks ordinary CNNs, how spectral attention recovers the inductive bias, and what an external memory module of class prototypes actually contributes."
tags: ["hyperspectral", "attention", "remote-sensing", "design-notes"]
draft: false
---

Hyperspectral image classification is the problem that taught me to read a data shape carefully before choosing a model. On the surface it looks like image classification; in practice it is much closer to signal processing on a short, high-dimensional vector with a small spatial prior. The architecture that works follows from taking that distinction seriously. The rest of this post walks through an architecture I keep coming back to, spectral attention paired with an external memory module, and, more importantly, the reasoning that makes each piece necessary.

## What a hyperspectral pixel actually is

A hyperspectral pixel is not a triple of red, green, and blue values. It is a vector of between roughly one hundred and three hundred narrow-band reflectance measurements spanning the visible and near-infrared range. Stack a two-dimensional grid of such pixels and you have a cube: height by width by bands, where the band dimension typically carries far more classification-relevant information than the other two combined.

Three properties follow from this shape. The first is that adjacent bands are highly correlated with each other, but which bands actually discriminate between classes is strongly class-dependent. A band that cleanly separates one pair of materials is useless noise for another pair. The second is that ground-truth datasets are almost always small relative to the ambient dimensionality of the signal. The third is that the spatial neighborhood, counter to most photographic intuition, is often not that informative: two adjacent pixels are frequently the same material, and the spatial variation that would matter for a classical vision problem is largely absent.

Any model whose inductive biases come primarily from the spatial axis is importing the wrong priors into this problem.

## Why a convolutional network is the wrong default

A two-dimensional convolutional network is built for translation-invariant spatial patterns: edges, textures, shapes. Hyperspectral pixels have none of those in abundance. The network then treats the band axis as a channel dimension, which means all of its nonlinear reasoning about bands is reduced to pointwise combinations at each spatial location. That is nearly the opposite of what the data asks for. The bands are where almost all the class information lives, and treating them as subordinate to space squanders the signal.

A three-dimensional convolutional network that convolves over the full cube solves the representational problem but introduces a new one. The parameter count explodes, and the small ground-truth footprint cannot support it. The model overfits before its spectral features have had a chance to settle. This is an architecture that works only when you do not actually need it.

## Spectral attention as the right inductive bias

The move that actually fits the data is to treat the band axis as a sequence of tokens and apply attention along it. Each band's reflectance value, embedded through a small linear layer into a more expressive vector, becomes a token. A learned positional encoding over the bands is added so the model can exploit the continuity of neighboring bands without being forced to treat them identically. Self-attention across this sequence produces a per-band context vector, and averaging across bands yields a single embedding per pixel that summarizes which bands mattered and how they combined.

This architecture has two properties that match what the data asks for. It has no hard bias toward locality on the spatial axis, since there is no spatial axis in the attention at all, which matches the observation that spatial neighborhoods do not help much. And it has a soft, learnable bias toward using the right subset of bands per example, which matches the observation that discriminative bands are class-dependent. The band-wise positional encoding retains a sense of ordering without locking the model into fixed band-group assumptions.

## What attention cannot solve on its own

Spectral attention gives you two things: per-class band weighting and a compact embedding. What it does not give you is any explicit notion of the class structure itself. A classifier on top of the attention embedding learns a decision boundary, but with few labelled pixels per class the boundary overfits to the specific training points rather than to the class-typical spectra. The model learns to recognize training pixels rather than class signatures.

This is the gap an external memory fills.

## External memory as a learned non-parametric classifier

An external memory module is a small set of learnable prototype vectors, roughly an order of magnitude more prototypes than there are classes, so with ten classes you might carry around a hundred prototypes. These prototypes are trainable parameters, but they play a role structurally closer to the exemplars in a non-parametric classifier than to the weights of a linear layer.

At inference time, a pixel's attention embedding is used as a query. Scaled dot-product attention between the query and the prototype set produces a distribution over prototypes, and a weighted combination of the prototypes using those weights yields a context vector. The context vector is then passed through a small head to produce class logits.

The intuition is that the prototypes collectively act as a compressed summary of what the classes look like in the attention-embedded space. A pixel whose embedding sits near the cluster of prototypes associated with a particular class will produce a context vector that leans toward that class, and the head maps that cleanly to a correct prediction. The prototypes are trained end-to-end with the rest of the network, so nothing is frozen or pre-computed. But the representational bias toward storing class signatures externally, rather than baking them into the final layer's weights, is exactly what lets the model generalize from few examples.

## Why initialization changes training

Random prototype initialization works, but slowly. A substantially better starting point is to run a brief clustering pass on the training pixel embeddings produced by an untrained forward pass of the attention module, then initialize the prototypes from the cluster centers. This turns the early training phase from an exploratory search for useful prototypes into a refinement of prototypes that already carry the rough structure of the training distribution. In practice it cuts the epochs-to-convergence by roughly half and, more importantly, avoids the instability in the first few epochs where random prototypes and an untrained query network coevolve chaotically.

## Training dynamics that make or break the model

Two training choices matter more than they look. The first is label smoothing on the cross-entropy loss, typically with a smoothing value around one tenth. The prototypes have more representational capacity than the class structure strictly requires, and without smoothing the softmax drives the attention weights over prototypes to extreme distributions that the small training set cannot stabilize. Smoothing keeps the attention over prototypes broad enough for robust gradient flow.

The second is band-wise dropout on the input. Randomly zeroing a small random subset of input bands at training time regularizes the model against overfitting to specific sensor calibrations, which is a real failure mode when the training and test spectra come from slightly different acquisition conditions. Augmentation on the spatial axis is mostly wasted here, because the spatial axis carries little information to begin with; band-wise dropout targets the axis that actually matters.

## What this architecture generalizes to

The attention-plus-memory pattern is not hyperspectral-specific. It generalizes to any problem where each example is a long, high-dimensional signal and the labelled set is small, such as certain kinds of financial time series, some gene-expression classification problems, and even graph-structured problems where a signal has a rich frequency decomposition. The specific band-weighting attention is hyperspectral-shaped and does not port blindly, but the idea of pairing a data-adaptive weighting mechanism with a small set of learnable exemplars is broadly portable.

## The discipline worth keeping

What you carry forward from working through a problem like this one is not a particular architecture. It is the habit of matching the architecture to the data shape rather than to the domain, and of writing down, for each component of the model, which inductive bias it is supposed to contribute.

> If a component cannot answer "what does this contribute?" in a single sentence, it is probably not earning its cost.
