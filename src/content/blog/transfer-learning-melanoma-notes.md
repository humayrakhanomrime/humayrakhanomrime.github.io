---
title: "Transfer learning under class imbalance: a practical pipeline"
date: "2026-01-27"
description: "A walkthrough of a transfer-learning pipeline for imbalanced medical image classification: backbone selection, fine-tuning regime, augmentation policy, loss engineering, and the evaluation protocol that actually measures what you care about."
tags: ["transfer-learning", "medical-imaging", "class-imbalance", "design-notes"]
draft: false
---

Transfer learning on imbalanced medical images is one of those problems that looks straightforward until you try to compare two runs honestly. The default recipe (pretrained backbone, cross-entropy loss, area-under-curve as the headline metric) hides enough confounders to let almost any claim sound plausible. The purpose of this post is to walk through the pipeline in the order the decisions actually arise, to name the choices that matter, and to describe the protocol that removes the most common sources of noise. The running example is dermoscopic classification of benign, malignant, and intermediate lesions, but nothing in the pipeline is dermoscopy-specific. The same structure applies, with the obvious adjustments, to retinal imaging, histopathology slides, and chest radiographs.

## Writing down the error profile first

Before any architectural decision, commit to an error profile in writing. What does a false negative cost in this domain? What does a false positive cost? At what operating point is the model intended to run in production? For dermoscopic classification, a plausible answer is that false negatives on malignant lesions are substantially more costly than false positives, and that the model should operate at a sensitivity of at least ninety-five percent on the malignant class. That single sentence determines every metric the pipeline will track and most of the loss choices it will make.

Teams that skip this step end up tuning area-under-curve aggressively, choosing the model that wins on the aggregate metric, and then discovering at deployment that their intended operating point has a catastrophically low recall. The model was not wrong; the metric was the wrong abstraction of what they actually cared about. Writing the error profile down at the start prevents this by making the target explicit before any training run is scored.

## Backbone selection is narrower than the literature suggests

Every year's leaderboard produces a new "best" backbone. On medium-sized medical-imaging datasets with tens of thousands of labelled examples, the practical spread across modern backbones is smaller than the seed-to-seed variance within any one of them. That is not a controversial claim anymore; it is visible in every honest ablation. The implication for a new project is that the backbone choice is not load-bearing. A defensible default lineup is a stable reference like a mid-sized residual network, a few variants of a modern efficient convolutional backbone, and a vision transformer initialized from a strong self-supervised pretraining. Run all three with at least five seeds each before believing any ranking between them.

The one place backbone choice meaningfully matters is in the pretraining regime, not the architecture. A backbone pretrained via modern self-supervision, on images closer in distribution to the target domain, almost always outperforms a supervised generic-pretrained version of the same architecture. Treat the pretraining corpus as a hyperparameter, and search over it as deliberately as you would over learning rates.

## The fine-tuning regime

Three regimes are worth naming. The first is a pure linear probe, where the backbone is frozen and only the classifier head is trained. Fast, cheap, and under-fits for most medical tasks. The second is a full fine-tune, where every parameter is trainable. The highest capacity and, on small datasets, the highest risk of forgetting useful pretrained features. The third, which is the reliable default for medical imaging with tens of thousands of examples, is gradual unfreezing with differential learning rates. The head is trained first on a frozen backbone for a few epochs, then deeper blocks are unfrozen one at a time, each with a learning rate an order of magnitude smaller than the head's.

The exact ratio of learning rates from head to backbone stem matters less than the overall shape: the deepest, most task-specific layers move fastest, and the shallowest, most general-purpose layers barely move at all. A cosine schedule with a short warmup on top of this setup gives a well-behaved optimization trajectory without further tuning.

## Augmentation policy, honestly ranked

Augmentation is the part of a medical-imaging pipeline that most rewards skepticism. Some augmentations that work on natural images actively hurt clinical data, and the assumption that a domain-generic policy ports across medical modalities is one of the reliable failure patterns in the field.

For dermoscopic images specifically, the shape of the right policy is roughly as follows. Horizontal and vertical flips are safe and productive, because lesions have no canonical handedness or orientation. Free rotations across the full circle are equally safe for the same reason. Random crop-and-resize encourages focus on the lesion interior and tends to help. Mild color jitter is worth keeping, since it simulates dermatoscope calibration variation; heavy color jitter, on the other hand, destroys clinically relevant chromatic cues and should be dropped. Gaussian blur similarly hurts, because it blurs the exact texture structure that drives diagnosis. Sample-mixing strategies like CutMix and MixUp have mixed evidence on fine-grained medical data and are worth testing before trusting. Learned-augmentation policies like AutoAugment and its descendants rarely pay for their tuning cost at this scale of data.

The broader point is that augmentation policies are dataset-specific, not domain-specific. A policy that works on dermoscopy may actively hurt on retinal imaging even though both are broadly "medical." Assume the policy is wrong until you have ablated it on your own data.

## Loss engineering for imbalance

With class imbalance in the range of ten to one or a hundred to one, plain cross-entropy gives you a model that is ninety-five percent accurate by predicting the majority class and useless on the minority class. Three alternatives, in ascending order of complexity, handle this.

The simplest is weighted cross-entropy, where each class's contribution to the loss is scaled by an inverse frequency or, more stably, by the effective-number-of-samples formula. The effective-number weighting is specifically designed to be stable for classes with very few examples, where raw inverse-frequency weights diverge.

The next step up is focal loss, which multiplies each example's cross-entropy by one minus its predicted probability raised to a focusing exponent, usually between one and a half and two and a half. Focal loss is most useful when the majority class has many easy examples that saturate the gradient. It directs the optimization pressure toward examples the model is getting wrong, which tends to be the minority class in an imbalanced setting.

The third, which is worth reaching for only if the cost asymmetry between false positives and false negatives is explicit, is an asymmetric loss formulation where positive and negative examples have different focusing exponents. This is the right tool when the error profile written down at the start of the project has sharply different costs for the two directions of error.

Do not stack these without ablating. Combining focal loss with aggressive oversampling, for example, tends to overcorrect. The minority class starts dominating the gradient, and the model collapses onto it.

## Sampling strategy

Sampling choices interact with loss choices in ways that are worth naming. Uniform sampling under-represents minority classes; it is only the baseline. Class-balanced sampling, where each class is drawn with equal probability and examples within a class are drawn uniformly, is the usual right answer. An effective-number sampling variant, which weights classes by the same effective-number formula used in the weighted loss, is smoother and behaves better when some classes have fewer than about a hundred examples.

Class-balanced sampling paired with a weighted cross-entropy loss is the usual combination I end up with. The weights in the loss correct the residual bias that sampling alone cannot fully eliminate: minority-class examples repeat more frequently across epochs under class-balanced sampling, so they face more gradient pressure per example, and the loss weights compensate.

## The validation protocol that removes the most noise

More noise is removed from medical-imaging results by fixing the validation protocol than by any choice of model. Four practices, in rough order of impact.

The first is to split the data by patient, not by image. Multiple images from the same patient can correlate strongly through lesions on the same anatomical site, lighting from the same device, or skin type, and splitting by image leaks information across folds. Stratified K-fold by patient is the right default.

The second is to pick a fixed validation operating point derived from the error profile. For a target sensitivity of ninety-five percent on the positive class, compute the threshold that achieves that sensitivity on the validation fold and report specificity at that threshold. Reporting area-under-curve instead buries the operating-point question behind an aggregate metric that may not reflect production behavior.

The third is to seed-average across at least five seeds and report mean and standard deviation. A single-seed result comparing two models is almost always noise. Variance estimates are not optional; they are the thing that tells you whether a one-point gap is meaningful.

The fourth is to pre-register the primary metric before running any experiments. The gravitational pull of "pick the metric that looks best retroactively" is real, and it is the single most common source of over-claimed results on imbalanced medical data. Decide on macro-F1, or specificity-at-target-sensitivity, or whatever matches the error profile, and hold to it.

Most of the "method X beats method Y" claims on imbalanced medical benchmarks fall apart under the patient-level split alone. The other three practices make the remaining claims more precise.

## Putting the pipeline together

Looking at the full pipeline in one sweep: the backbone is a mid-sized modern network, pretrained on a corpus close in distribution to the target data. Gradual unfreezing with differential learning rates handles the fine-tuning, with a cosine schedule on top. The augmentation policy is dermoscopy-specific and has been ablated. The sampler is class-balanced, the loss is weighted focal, and both are kept separate from other imbalance tricks rather than stacked. Validation is patient-level, uses a fixed operating point derived from a written-down error profile, and reports the primary metric across at least five seeds.

None of this is exotic. All of it is deliberately boring, and that is the point. Most of the interesting mistakes in medical-imaging transfer learning come from departures from this baseline, not from the baseline itself.

## What carries forward

What you take from one imbalanced-classification project to the next is not the particular model you trained. It is the protocol. Patient-level splits, seed averaging, pre-registered metrics, and loss choices tied to an explicit cost profile are not dramatic, but they are the difference between a claim that holds up in production and one that does not.

> The rest is detail.
