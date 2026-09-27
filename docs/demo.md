# TruthLens AI — 2-Minute Hackathon Demo Script

Follow this step-by-step presentation script to deliver a judge presentation in 120 seconds.

---

### [0:00 - 0:25] The Problem & Core Thesis
- **Presenter**: "Judges, modern LLMs act like confident guessers. When asked if a viral claim is true, standard chatbots either hallucinate convincing citations or give binary true/false verdicts without showing proof.
- **Intro**: "Meet **TruthLens AI** — an evidence-first misinformation verification assistant. Our core philosophy: *Verify before you trust or share. And when evidence is insufficient, refuse to manufacture certainty.*"

---

### [0:25 - 0:50] Demo 1: Verified Claim (SUPPORTED)
- **Action**: On the home page, click the first demo claim: *"Water boils at 100 degrees Celsius under standard atmospheric pressure."*
- **Click**: Click **Verify Claim**.
- **Presenter**: "Notice the 4-stage pipeline analyzing semantics, searching the vector corpus, and running stance classification.
- **Show Result**:
  - Point to the **Supported** badge with the green shield icon.
  - Show the **Assessment Confidence** meter (94%).
  - Highlight the explanation: grounded directly in **NIST** and **IAPWS** standards.
  - Scroll to the **Evidence Cards**: show exact passage excerpts, 95% relevance match, and primary source links."

---

### [0:50 - 1:15] Demo 2: Debunked Viral Rumor (CONTRADICTED)
- **Action**: Click "Verify Another Claim" and click the second demo claim: *"Vaccines contain microchips to secretly track citizens."*
- **Click**: Click **Verify Claim**.
- **Show Result**:
  - Show the **Contradicted** badge with the rose warning icon.
  - Show the **Stance Distribution**: multiple contradicting sources from CDC, WHO, and Reuters Fact Check.
  - Explain: "The system identifies that optical and physical dimensions render microchip transceivers physically incapable of being injected through needle gauges, completely refuting the claim."

---

### [1:15 - 1:35] Demo 3: Nuanced Science (MIXED EVIDENCE)
- **Action**: Verify the third claim: *"Drinking coffee significantly reduces the risk of heart disease."*
- **Show Result**:
  - Point to the **Mixed Evidence** amber badge.
  - Explain: "TruthLens doesn't force a binary true/false. It surfaces observational cohort studies showing cardiovascular protection alongside clinical trials showing blood pressure spikes and cafestol LDL elevations. Science is nuanced, and TruthLens respects that nuance."

---

### [1:35 - 1:50] Demo 4: The Ultimate Test (INSUFFICIENT EVIDENCE)
- **Action**: Verify the fourth claim: *"Extraterrestrial beings established a secret hyper-quantum base beneath Mount Vinson in 1947."*
- **Show Result**:
  - Point to the **Insufficient Evidence** badge.
  - Explain: "Notice our **Uncertainty Layer**. While typical AI chatbots might invent a fictional sci-fi backstory, TruthLens's decision engine detects that relevance is below our configured 0.55 threshold. It states: *'The system refuses to manufacture certainty.'*"

---

### [1:50 - 2:00] Architecture & Wrap-Up
- **Action**: Click the **Methodology** tab in the top navigation.
- **Presenter**: "TruthLens features a modular Python FastAPI backend, custom vector retrieval with FAISS/NumPy fallback, an independent uncertainty decision engine, SQLite persistence, and an accessible React dashboard. 18 automated integration tests ensure every assessment state is mathematically verified. Thank you!"
