# TruthLens AI — Evidence Corpus & Data Provenance

## Overview
This directory contains the reference evidence corpus and curated demonstration claims used by TruthLens AI to verify statements in a self-contained, reproducible environment.

## Corpus Provenance
To ensure immediate out-of-the-box operation during hackathons, offline demonstrations, and automated testing without relying on brittle, paywalled, or rate-limited third-party search APIs, TruthLens AI bundles an curated local evidence corpus:

- `data/sample_evidence/evidence_corpus.json`: Contains 10 peer-vetted scientific, regulatory, and fact-checking passages sourced and adapted from authoritative organizations:
  - **NIST** (National Institute of Standards and Technology) & **IAPWS** (Water properties & boiling point standards)
  - **NREL** (National Renewable Energy Laboratory photovoltaic benchmarks)
  - **CDC**, **WHO**, and **Reuters Fact Check** (Vaccine chemical composition, needle gauge physical constraints, lack of microelectronic components)
  - **American College of Cardiology**, **European Society of Cardiology**, and **BMJ** (Nuanced cardiovascular effects of caffeine, diterpenes, and genetic metabolism)
  - **British Antarctic Survey** & **NSF** (Polar geology and glaciology surveying)

## Demo Claims
The `data/sample_claims.json` file contains four standard evaluation claims explicitly crafted to exercise the four assessment states:
1. **SUPPORTED**: Standard thermodynamic law on water boiling at 100°C.
2. **CONTRADICTED**: Viral rumor alleging vaccine tracking microchips.
3. **MIXED**: Health claim regarding coffee reducing heart disease, showing genuine scientific tension and conditional factors.
4. **INSUFFICIENT EVIDENCE**: Unsubstantiated niche speculation with zero matching empirical literature.

## External Provider Extension
TruthLens AI is designed with an `ExternalEvidenceProvider` adapter interface (`app.retrieval.external.ExternalEvidenceProvider`). When an external search provider (such as Tavily, Bing News API, or DuckDuckGo) is configured, external retrieved passages are merged with the local corpus and ranked using the identical semantic relevance and stance analysis pipeline.
