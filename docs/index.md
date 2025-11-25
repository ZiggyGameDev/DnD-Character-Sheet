---
layout: default
title: D&D 5e Character Manager
nav_order: 1
---

# D&D 5e Character Manager

A lightweight overview of the architecture, UX flows, and rules logic for a Flutter-based Dungeons & Dragons 5e character manager. This page is organized for GitHub Pages so the whole plan is easy to browse online.

## Quick links
- [Architecture & data models](architecture.md#2-proposed-architecture-and-data-models)
- [Core goals and assumptions](architecture.md#1-clarify-goals-and-assumptions)
- [Key screens and UX flows](architecture.md#3-key-screens-and-ux-flows)
- [Rules logic and pseudocode](architecture.md#4-rules-logic-and-pseudocode)
- [How it fits together](architecture.md#5-how-it-fits-together)
- [Web demo (GitHub Pages build output)](./site/index.html)

## Overview
The app is built from scratch with an offline-first philosophy, using a single packaged XML file for all rules content. Flutter provides a single codebase for iOS and Android, while the layered architecture below keeps rules math, data ingestion, and UI concerns separated.

Head to the full [Architecture document](architecture.md) for detailed guidance.

To publish the interactive demo to GitHub Pages, run `npm run build:pages`; the static assets land in `docs/site/` so Pages can
serve both this documentation and the playable web app together.

## GitHub Pages deployment
- The repository now includes an automated workflow (`Deploy GitHub Pages`) that installs dependencies, runs the offline smoke tests, builds the static bundle into `docs/site`, and publishes it to Pages.
- This ensures the hosted site serves compiled JavaScript (avoiding browser MIME errors from raw JSX) and stays in sync with the latest main branch changes.
