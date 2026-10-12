# RecallKit AI 🧠⚡

> A beginner-friendly, hackathon-ready study kit generator running **100% locally** on your machine with **Ollama** and Google's **Gemma** model (`gemma3:4b`). No API keys, no subscriptions, and zero cloud dependencies.

---

## ✨ Features

- 📝 **Paste Study Notes:** Simply paste lecture notes, book summaries, or flash concepts.
- 🎯 **5 Multiple-Choice Questions (MCQs):** Generated with 4 options each, correct answers, and clear conceptual explanations.
- 🗂️ **5 Interactive Flashcards:** Active recall cards with smooth 3D flip animation and navigation controls.
- 📊 **Instant Quiz Scoring:** Take the quiz interactively, submit answers, and receive your percentage score with detailed answer breakdowns.
- 🔒 **100% Private & Local:** All AI inference runs on `http://127.0.0.1:11434` via local Ollama. No data leaves your computer.
- 🛡️ **Resilient Error Handling:** Built-in connection status monitoring and actionable error banners if Ollama is unreachable.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Vanilla CSS |
| **Backend** | Python 3.10+, FastAPI, Uvicorn, HTTPX, Pydantic |
| **AI Inference** | Local Ollama daemon (`http://127.0.0.1:11434`) |
| **AI Model** | `gemma3:4b` (Pre-installed local model) |

---

## 📋 Prerequisites & Verified Environment

RecallKit AI has been verified on Windows with:
- **Node.js:** v24.21.0+ (npm 11.19.0+)
- **Python:** 3.14.2+ (or 3.10+)
- **Ollama:** v0.40.3+ with `gemma3:4b` installed
  - Verify with: `ollama list`
  - Ensure Ollama is running at: `http://127.0.0.1:11434`

---

## 🚀 Quickstart Guide

### 1. Verify Ollama & Model
Ensure Ollama is running and your Gemma model is present:
```powershell
ollama list
```
*(You should see `gemma3:4b` in the list. If Ollama is not running, run `ollama serve` in a separate terminal).*

### 2. Backend Setup (FastAPI)
Open a terminal in the project root:
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
The FastAPI backend will start at: `http://127.0.0.1:8000`  
Interactive Swagger docs: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup (React + Vite)
Open a second terminal in the project root:
```powershell
cd frontend
npm install
npm run dev
```
The Vite development server will start at: `http://localhost:5173`

---

## 📁 Project Structure

```text
mlh-hackday/
├── .env.example              # Template environment variables
├── .gitignore                # Git ignore patterns for Python & Node
├── README.md                 # Project guide & quickstart
├── docs/
│   ├── ARCHITECTURE.md       # Architecture diagram & API contracts
│   ├── DEMO_SCRIPT.md        # 2-3 minute hackathon pitch & demo steps
│   └── PROJECT_SPEC.md       # Detailed requirements & feature specs
├── backend/
│   ├── main.py               # FastAPI entrypoint & routes (/api/generate, /api/health)
│   ├── ollama_client.py      # Local Ollama communication & JSON parsing
│   ├── schemas.py            # Pydantic models for request & response
│   └── requirements.txt      # Python dependencies (fastapi, uvicorn, httpx, pydantic)
└── frontend/
    ├── index.html            # HTML entrypoint
    ├── package.json          # Frontend dependencies & scripts
    ├── vite.config.js        # Vite configuration
    └── src/
        ├── App.jsx           # Main state, tab switcher, generation orchestrator
        ├── App.css           # Component styles & interactive animations
        ├── index.css         # CSS design system (tokens, colors, layout)
        ├── main.jsx          # React DOM root
        └── components/
            ├── Header.jsx    # App branding & live Ollama status indicator
            ├── NotesInput.jsx# Textarea input with sample text triggers
            ├── QuizView.jsx  # Interactive 5-question quiz with score calc
            └── FlashcardView.jsx # 3D flip flashcards & navigation controls
```

---

## 📖 Documentation
- [Project Specification](file:///c:/Users/srini/Downloads/Programming%20Files/mlh-hackday/docs/PROJECT_SPEC.md)
- [System Architecture](file:///c:/Users/srini/Downloads/Programming%20Files/mlh-hackday/docs/ARCHITECTURE.md)
- [Hackathon Demo Script](file:///c:/Users/srini/Downloads/Programming%20Files/mlh-hackday/docs/DEMO_SCRIPT.md)

---

## 📄 License
MIT License. Created for the MLH Hackathon.
