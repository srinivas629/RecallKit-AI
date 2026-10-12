# RecallKit AI 🧠⚡

> A beginner-friendly, hackathon-ready study kit generator running **100% locally** on your machine with **Ollama** and Google's **Gemma** model (`gemma3:4b`). No API keys, no subscriptions, and zero cloud dependencies.

---

## ✨ Features

- 📝 **Paste Study Notes:** Simply paste lecture notes, book summaries, or flash concepts.
- 🎯 **5 Multiple-Choice Questions (MCQs):** Generated with 4 options each, correct answers, and clear conceptual explanations.
- 🗂️ **5 Interactive Flashcards:** Active recall cards with smooth 3D flip animation and navigation controls.
- 📊 **Instant Quiz Scoring:** Take the quiz interactively, submit answers, and receive your percentage score with detailed answer breakdowns.
- 💡 **Conceptual Explanations:** Deep-dive concept review section with live search and distractor evaluation.
- 🔒 **100% Private & Local:** All AI inference runs on `http://127.0.0.1:11434` via local Ollama. No data leaves your computer.
- 🛡️ **Resilient Error Handling:** Built-in connection status monitoring and actionable error banners if Ollama is unreachable.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Vanilla CSS (Responsive for Mobile & Desktop) |
| **Backend** | Python 3.10+, FastAPI, Uvicorn, HTTPX, Pydantic v2 |
| **AI Inference** | Local Ollama daemon (`http://127.0.0.1:11434`) |
| **AI Model** | `gemma3:4b` (Pre-installed local model) |

---

## 📋 Prerequisites & Verified Windows Environment

RecallKit AI has been verified on Windows with:
- **Node.js:** v24.21.0+ (npm 11.19.0+)
- **Python:** 3.14.2+ (or 3.10+)
- **Ollama:** v0.40.3+ with `gemma3:4b` installed
  - Verify with: `ollama list`
  - Ensure Ollama is running at: `http://127.0.0.1:11434`

---

## 🚀 Quickstart Guide (Windows PowerShell)

### Step 1: Verify Ollama Service & Model
Open PowerShell and verify Ollama is active with the `gemma3:4b` model:
```powershell
ollama list
```
*(If the service is stopped, run `ollama serve` in a separate window).*

---

### Step 2: Backend Setup & Execution (Terminal 1)
Open PowerShell in the project root:
```powershell
cd "backend"

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install minimal dependencies
pip install -r requirements.txt

# Start the FastAPI backend
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
- **Backend API:** `http://127.0.0.1:8000`
- **Health Check:** `http://127.0.0.1:8000/health`
- **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`

---

### Step 3: Frontend Setup & Execution (Terminal 2)
Open a second PowerShell window in the project root:
```powershell
cd "frontend"

# Install dependencies (first time only)
npm install

# Start Vite development server
npm run dev -- --host 127.0.0.1 --port 5173
```
- **Application Web UI:** `http://127.0.0.1:5173`

---

## 🧪 Verification & Automated Test Suite

To verify all 9 core functional and resilience test cases:
```powershell
cd "backend"
.\venv\Scripts\Activate.ps1
python test_verification.py
```
**Tests Executed:**
1. ✅ Input validation for empty, whitespace, and short notes (HTTP 422).
2. ✅ Malformed LLM output parsing, markdown fences extraction, and normalization.
3. ✅ Missing model detection (HTTP 503 / degraded status).
4. ✅ Stopped Ollama connection drop handling (HTTP 503).
5. ✅ Quiz scoring calculation logic (100%, 80%, partial).
6. ✅ Live inference test producing 5 MCQs (4 options, 1 answer, explanation) and 5 flashcards via `gemma3:4b`.

---

## 🔒 Local-Only AI Audit Confirmation

- **No Remote AI Providers:** Zero usage of OpenAI, Anthropic, Gemini Cloud, Groq, or OpenRouter.
- **No API Keys:** Zero external credentials, tokens, or subscription keys required.
- **Air-Gapped Ready:** The React frontend communicates strictly with `http://127.0.0.1:8000`, and FastAPI communicates strictly with `http://127.0.0.1:11434`.
- **Git Exclusions:** `.env`, `.env.local`, `venv/`, `node_modules/`, and build caches are strictly ignored in `.gitignore`.

---

## 📁 Project Structure

```text
mlh-hackday/
├── .env.example              # Template environment variables
├── .gitignore                # Git ignore rules for Python & Node
├── README.md                 # Project guide & quickstart
├── docs/
│   ├── ARCHITECTURE.md       # Architecture diagram & API contracts
│   ├── DEMO_SCRIPT.md        # 2-3 minute hackathon pitch & ML demo notes
│   └── PROJECT_SPEC.md       # Detailed requirements & feature specs
├── backend/
│   ├── .env.example          # Backend environment template
│   ├── .gitignore            # Backend gitignore
│   ├── config.py             # Configuration loader & CORS origins
│   ├── schemas.py            # Pydantic models for request & response
│   ├── ollama_client.py      # Local Ollama communication & JSON parsing
│   ├── main.py               # FastAPI entrypoint (/health, /generate)
│   ├── requirements.txt      # Python dependencies (fastapi, uvicorn, httpx, pydantic)
│   └── test_verification.py  # Automated test suite for all hackathon cases
└── frontend/
    ├── index.html            # HTML entrypoint
    ├── package.json          # Frontend dependencies & scripts
    ├── vite.config.js        # Vite configuration
    └── src/
        ├── App.jsx           # Main state, tab switcher, generation orchestrator
        ├── App.css           # Component styles & interactive animations
        ├── index.css         # CSS design system (tokens, colors, layout)
        ├── main.jsx          # React DOM root
        ├── services/
        │   └── api.js        # Health check & generation API client
        ├── data/
        │   └── sampleData.js # Educational notes & reference dataset
        └── components/
            ├── Header.jsx           # App branding & live Ollama status indicator
            ├── NotesInput.jsx       # Textarea input with sample text triggers
            ├── TabNavigation.jsx    # Segmented navigation between the 3 sections
            ├── QuizView.jsx         # 5 MCQs, interactive options, scoring & answers
            ├── FlashcardView.jsx    # 3D flip flashcards & navigation controls
            ├── ExplanationsView.jsx # Conceptual explanations & live search
            ├── LoadingIndicator.jsx # Stage progression animated loader
            └── ErrorBanner.jsx      # Diagnostic messages & retry action
```

---

## 📄 License
MIT License. Created for the MLH Hackathon.
