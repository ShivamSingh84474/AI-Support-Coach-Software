# AI Support Coach Software (PUC/POC)

This repository now includes a lightweight **Proof of Concept (POC)** for an AI support system that:

- learns from mixed knowledge formats (text, image, audio, video metadata),
- supports two access modes:
  - **Support Mode** (client-facing, product-only),
  - **Developer Mode** (internal technical access),
- chooses the most suitable response format automatically,
- lets the user override with a preferred output format.

## Demo Included

Open `/home/runner/work/AI-Support-Coach-Software/AI-Support-Coach-Software/index.html` in a browser.

No build step or dependency install is required.

## What the POC Demonstrates

1. **Mode-aware access control**
   - Support Mode blocks deep technical answers.
   - Developer Mode can return architecture/code-flow style answers.
2. **Multimodal response orchestration**
   - Auto-selection across text/image/audio/video based on query intent.
   - Optional user preference override (`Auto`, `Text`, `Image`, `Audio`, `Video`, `Mixed`).
3. **Explainable response decision**
   - Confidence score + short reasoning for why a format was chosen.
4. **Management-friendly presentation**
   - Single-page interactive demo with sample questions.

## Suggested Walkthrough for Management

1. Start in **Support Mode** and ask: `How do I reset my password?`
2. Switch to **Developer Mode** and ask: `Show API timeout flow`
3. Change preferred format to **Video** or **Mixed** and re-run the same query.
4. Highlight how one system can serve both client support and internal technical discovery.