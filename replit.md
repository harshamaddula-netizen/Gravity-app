# TruthLens AI — Replit Deployment Guide

TruthLens AI is designed to run seamlessly in modern cloud hosting environments, including Replit.

## 1. Architecture on Replit
- **Backend**: Python 3.11 FastAPI server running on port `8000`.
- **Frontend**: Vite + React dev/preview server running on port `5173`.
- **Database**: Local SQLite file (`truthlens.db`) automatically created on first boot.

## 2. Replit Run Configuration (.replit)
If you deploy to Replit, configure your `.replit` file:

```toml
modules = ["python-3.11", "nodejs-20"]
run = "sh run_replit.sh"

[nix]
channel = "stable-24_05"

[[ports]]
localPort = 5173
externalPort = 80
```

## 3. Startup Script (`run_replit.sh`)
Create `run_replit.sh`:
```bash
#!/bin/bash
# Install backend requirements
pip install -r backend/requirements.txt

# Install frontend requirements & build
cd frontend && npm install && npm run build && cd ..

# Start backend in background
PYTHONPATH=backend python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 &

# Start frontend preview server
cd frontend && npm run preview -- --host 0.0.0.0 --port 5173
```

## 4. Environment Variables on Replit
Add the following in Replit Secrets / Environment:
- `DEMO_MODE`: `true`
- `MIN_EVIDENCE_SCORE`: `0.55`
- `MIN_RELEVANT_SOURCES`: `1`
- `LLM_PROVIDER`: `demo` (or `openai` if `OPENAI_API_KEY` is provided)
