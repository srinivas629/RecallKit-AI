# RecallKit AI

> Turn your notes into knowledge.

RecallKit AI is a privacy-first, beginner-friendly study kit generator running entirely on your local machine using Ollama and Google's Gemma model. The application requires zero API keys, zero cloud subscriptions, and zero external inference providers.

---

## Features

- **Paste Study Notes**: Input raw lecture notes, article excerpts, textbook summaries, or key concepts into an interactive text editor.
- **5 Multiple-Choice Questions (MCQs)**: Generates exactly five structured questions, each with four distinct options, one correct answer, and an in-depth explanation.
- **5 Interactive Flashcards**: Active-recall study cards featuring smooth 3D flip animations, sequential progress tracking, and grid/single card view modes.
- **Instant Quiz Scoring**: Complete the quiz interactively, submit answers, and receive an automated score calculation with visual answer feedback and correctness badges.
- **Conceptual Explanations**: Dedicated deep-dive review tab breaking down the underlying reasoning for each question, including distractor evaluations and a real-time keyword filter.
- **100% Private and Local**: All model inference executes against your local Ollama daemon at `http://127.0.0.1:11434`. No study materials or user notes ever leave your machine.
- **Diagnostic Health Monitoring**: Real-time status pill indicating local backend and Ollama connectivity, preventing false connection reports.
- **Color Hunt Design System**: Styled with a high-contrast dark theme utilizing pure black (`#000000`) for the canvas, charcoal (`#333333`) for cards and panels, crisp white (`#FFFFFF`) for typography and primary buttons, pale mint (`#E1F4F3`) for subtle accents and selection states, and warm gray (`#706C61`) for borders and secondary labels.

---

## Technology Stack

| Layer | Component | Details |
|---|---|---|
| **Frontend** | React 18 + Vite | Modular functional components, clean state management, accessible markup |
| **Styling** | Plain CSS | Centralized CSS variables, responsive mobile/laptop layouts, no CSS frameworks |
| **Backend** | FastAPI + Uvicorn | High-performance asynchronous Python API server with CORS middleware |
| **Data Validation** | Pydantic v2 | Strict schema parsing, bounds enforcement, and output sanitization |
| **HTTP Client** | HTTPX | Asynchronous connection pooling and timeout management for Ollama calls |
| **AI Inference** | Ollama (Local Daemon) | Local HTTP inference server running at `http://127.0.0.1:11434` |
| **Model** | Gemma 3 / Gemma 4 (`gemma3:4b`) | Open weights model running locally on CPU/GPU |

---

## Prerequisites and Environment Setup

RecallKit AI has been verified on Windows, macOS, and Linux with the following requirements:

- **Node.js**: v18.0.0 or newer (v24.21.0+ verified)
- **npm**: v9.0.0 or newer (v11.19.0+ verified)
- **Python**: v3.10 or newer (v3.14.2 verified)
- **Ollama**: Installed and running locally
- **Local Gemma Model**: Pre-pulled `gemma3:4b` model in Ollama

---

## Step-by-Step Installation and Execution Guide

### Step 1: Verify Ollama and the Local Model

Open a terminal or PowerShell prompt and ensure Ollama is installed and contains the Gemma model:

```bash
ollama list
```

You should see `gemma3:4b` in the list of installed models. If Ollama is not currently active, start it:

```bash
ollama serve
```

---

### Step 2: Configure and Start the FastAPI Backend

Open a new terminal window, navigate to the `backend` folder, set up your Python virtual environment, install dependencies, and start the server:

#### Windows PowerShell:
```powershell
cd "backend"

# Create a virtual environment (first time only)
python -m venv venv

# Activate the virtual environment
.\venv\Scripts\Activate.ps1

# Install required Python packages
pip install -r requirements.txt

# Start the FastAPI server
python -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

#### macOS / Linux:
```bash
cd "backend"

# Create a virtual environment (first time only)
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate

# Install required Python packages
pip install -r requirements.txt

# Start the FastAPI server
python3 -m uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

The backend is accessible at:
- API Base URL: `http://127.0.0.1:8000`
- System Health Endpoint: `http://127.0.0.1:8000/health`
- Interactive OpenAPI Docs: `http://127.0.0.1:8000/docs`

---

### Step 3: Configure and Start the React Frontend

Open a separate terminal window, navigate to the `frontend` folder, install Node dependencies, and start the Vite dev server:

```bash
cd "frontend"

# Install Node modules (first time only)
npm install

# Start the Vite development server
npm run dev -- --host 127.0.0.1 --port 5173
```

Open your browser and navigate to:
- Application Dashboard: `http://127.0.0.1:5173`

---

## API Endpoints Reference

### 1. Health Check
- **Endpoint**: `GET /health`
- **Description**: Returns connection health for the FastAPI server and the local Ollama daemon, including whether the configured model is installed.
- **Sample Response**:
```json
{
  "status": "healthy",
  "backend": "online",
  "ollama_connected": true,
  "model": "gemma3:4b",
  "model_available": true,
  "available_models": ["gemma3:4b:latest"]
}
```

### 2. Generate Study Kit
- **Endpoint**: `POST /generate`
- **Description**: Validates user study notes and queries the local Ollama model to generate five multiple-choice questions and five flashcards.
- **Request Body**:
```json
{
  "notes": "Glycolysis takes place in the cytoplasm of the cell. It converts glucose into pyruvate, yielding 2 ATP and 2 NADH..."
}
```
- **Validation Rules**:
  - `notes` must not be empty or whitespace only.
  - `notes` minimum length: 10 characters.
  - `notes` maximum length: 10,000 characters.
- **Sample Response**:
```json
{
  "quiz": [
    {
      "id": 1,
      "question": "Where does glycolysis take place inside the cell?",
      "options": ["Mitochondria", "Cytoplasm", "Nucleus", "Endoplasmic Reticulum"],
      "correct_index": 1,
      "explanation": "Glycolysis occurs in the cytoplasm and does not require oxygen."
    }
  ],
  "flashcards": [
    {
      "id": 1,
      "front": "Where in the cell does glycolysis occur?",
      "back": "In the cytoplasm."
    }
  ],
  "model_used": "gemma3:4b",
  "source": "ollama_local"
}
```

---

## Automated Verification and Test Suite

An end-to-end test suite is included in `backend/test_verification.py` to confirm application stability across core functional requirements and edge cases:

```bash
cd "backend"
# With virtual environment activated:
python test_verification.py
```

### Covered Test Cases:
1. **Empty and Short Input Validation**: Verifies HTTP 422 Unprocessable Entity responses for empty or insufficient notes.
2. **Markdown Code Fence Stripping**: Verifies that json blocks wrapped in markdown fences by the LLM are cleanly extracted.
3. **Malformed JSON Normalization**: Confirms that missing keys, missing options, or non-integer indices are repaired without crashing.
4. **Missing Model Handling**: Confirms graceful HTTP 503 error reporting when the targeted model is not present.
5. **Ollama Service Interruption Handling**: Confirms clean HTTP 503 responses when the Ollama server is stopped.
6. **Quiz Scoring Logic**: Verifies correct mathematical scoring (100%, 80%, 0%) across answer variations.
7. **Live Local Inference**: Verifies end-to-end generation of 5 valid MCQs and 5 valid flashcards with the local Gemma model.

---

## Local-Only AI Audit

- **No External Providers**: The codebase contains zero integrations with OpenAI, Anthropic, Gemini Cloud, Groq, Mistral, or OpenRouter.
- **No API Keys**: No API key environment variables or billing accounts are needed.
- **Local Network Boundary**:
  - The React frontend makes HTTP requests exclusively to `http://127.0.0.1:8000`.
  - The FastAPI backend makes HTTP requests exclusively to `http://127.0.0.1:11434`.
- **Git Hygiene**: Environment files (`.env`), Python virtual environments (`venv/`), Node dependencies (`node_modules/`), and build artifacts are excluded via `.gitignore`.

---

## Project Structure

```text
mlh-hackday/
├── .env.example              # Template environment variables
├── .gitignore                # Git ignore rules for Python, Node, and build artifacts
├── README.md                 # Complete project documentation and guide
├── docs/
│   ├── ARCHITECTURE.md       # Architectural patterns and data flow contracts
│   ├── DEMO_SCRIPT.md        # Demonstration script and presentation guide
│   └── PROJECT_SPEC.md       # Core product specifications and design rules
├── backend/
│   ├── .env.example          # Backend-specific environment variables template
│   ├── .gitignore            # Backend git ignore rules
│   ├── config.py             # Settings loader and CORS configuration
│   ├── main.py               # FastAPI entrypoint (/health, /generate)
│   ├── ollama_client.py      # Ollama HTTP client and JSON parsing pipeline
│   ├── requirements.txt      # Python dependencies
│   ├── schemas.py            # Pydantic models for requests and responses
│   └── test_verification.py  # Comprehensive test script
└── frontend/
    ├── index.html            # Single page application HTML root
    ├── package.json          # Node dependencies and build scripts
    ├── vite.config.js        # Vite build tool configuration
    └── src/
        ├── App.css           # Component styles and Color Hunt theme implementation
        ├── App.jsx           # Main application shell and state orchestrator
        ├── index.css         # CSS tokens and base styles
        ├── main.jsx          # React DOM entrypoint
        ├── components/
        │   ├── ErrorBanner.jsx        # Error and troubleshooting notice card
        │   ├── ExplanationsView.jsx   # Conceptual breakdown and search interface
        │   ├── FlashcardView.jsx      # 3D interactive flip card component
        │   ├── Header.jsx             # Top bar with branding and model connection status
        │   ├── LoadingIndicator.jsx   # Generation status loader
        │   ├── NotesInput.jsx         # Text area editor and sample note trigger
        │   ├── QuizView.jsx           # 5-question multiple-choice interactive quiz
        │   └── TabNavigation.jsx      # Segmented navigation between study sections
        ├── data/
        │   └── sampleData.js          # Curated sample biology study notes
        └── services/
            └── api.js                 # Frontend API client for health and generation
```

---

## License

This project is licensed under the MIT License. Built for the MLH Hackathon.
