# Creative enhancer: tuning plan

**Status: not started.** No model has been trained. This page records what Adaption's docs say (checked
2026-11-16) and what is still undecided, so the live build doesn't re-research it.

## What Adaption provides

Source: <https://docs.adaptionlabs.ai>. SDK: `pip install adaption` (the docs ask for 0.16+ for inference,
0.7+ for AutoScientist). Key: `ADAPTION_API_KEY`.

1. **Adaptive Data** turns source data (CSV, JSON, JSONL, Parquet, documents, Hugging Face or Kaggle URLs) into
   a model-ready dataset: instruction pairs (prompt, completion) or preference pairs (chosen, rejected).
2. **AutoScientist** trains and evaluates repeatedly until a `target_win_rate` or `max_iterations`.
   `training_method="instruction"` is SFT; `"alignment"` is SFT then DPO. LoRA or full fine-tuning,
   depending on the base model.
3. The best checkpoint is **downloadable** as a `.tgz` (for LoRA: `adapter_model.safetensors` and friends).

Constraints worth planning around:
- Minimum rows (base plus augmentation): 1,000 for most base models, 10,000 for some (for example
  `google/gemma-4-31B-it`, `Qwen/Qwen3.5-122B-A10B`). DPO needs at least 12,000 rows for every model.
- Training context is shorter than serving context; long rows are truncated, not rejected.
- The run ends as `succeeded` even if it missed its target, so check `best_win_rate`.

## What is not documented (the open question)

Adaption's docs don't describe deploying a trained model to their inference API. Hosted models are called
by ID (for example `gemma-4-31b-it`, `qwen3.5-397b`) and saved configurations by `stack:<slug>`, but the
stack docs don't say a stack can use a tuned model. Ask Adaption support, or plan to self-host the LoRA.

## Proposed approach (to confirm)

- **Task framing:** input is the scene plan plus Gemini's draft; target is a more vivid version that keeps
  the same beats, characters and facts. This matches the pipeline in ADR 0007.
- **Data:** a corpus you have the right to train on, cleaned with Adaptive Data. Provenance and licence are
  the author's responsibility; nothing here assumes a particular source.
- **Base model:** pick from the supported list after deciding where it will be served; a Google-lineage base
  (Gemma) is fine for the enhancer but must never be the judge.
- **Success metric:** win rate against the plain Gemini draft, **and** violations introduced per 1,000 words
  by the chapter linter. Creativity that raises violations is a regression.

## Decisions needed

1. Training data source and licence.
2. Base model and LoRA vs full fine-tuning.
3. Serving: Adaption-hosted if available, otherwise self-hosted LoRA behind an OpenAI-compatible endpoint.
4. Whether tuning before the event counts as pre-build (see `PREBUILT.md`, open questions).
