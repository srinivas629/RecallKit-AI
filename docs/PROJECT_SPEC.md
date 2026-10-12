# RecallKit AI - Project Specification

## 1. Overview
**RecallKit AI** is a beginner-friendly, hackathon-ready study companion web application. It transforms raw lecture notes or study text into interactive learning materials: 5 multiple-choice questions (with explanations) and 5 interactive flip flashcards.

The project is designed to run **100% locally and privately**, leveraging a locally hosted Ollama instance and Google's Gemma model family (`gemma3:4b`), requiring zero paid API keys, zero third-party cloud services, and zero database setup.

---

## 2. Target Audience & Problem Statement
- **Students & Learners:** Want rapid self-testing tools without subscription paywalls, sign-up friction, or data privacy concerns.
- **Hackathon Judges & Developers:** Need an easy-to-run, deterministic, local AI project with clear architecture, minimal dependencies, and zero setup hurdles.

---

## 3. Core Requirements & Constraints

### 3.1 Technology Stack
- **Frontend:** React 18+ powered by Vite (JavaScript), styled with clean, modern Vanilla CSS.
- **Backend:** Python 3.10+ with FastAPI and Uvicorn.
- **AI Inference Engine:** Local Ollama server (`http://127.0.0.1:11434/api/generate` or `/api/chat`).
- **AI Model:** Pre-installed local Gemma model (`gemma3:4b`).
- **Data Persistence:** In-memory / ephemeral session state (No database or persistent store in Version 1).
- **Authentication:** None (open local utility).
- **File Ingestion:** Direct text paste only (No PDF parsing or file uploads in Version 1).

---

## 4. Feature Specifications

### 4.1 Study Notes Ingestion
- Clean multi-line text input area with character count and pre-filled sample text buttons for quick hackathon demonstrations.
- Validation for minimum input length (e.g., minimum 50 characters to ensure meaningful AI output).

### 4.2 AI-Powered Generation
- A single backend endpoint (`POST /api/generate`) that prompts the local `gemma3:4b` model using strict JSON schema formatting.
- Output artifacts generated in a single pass:
  1. **5 Multiple-Choice Questions (MCQs):**
     - Question text.
     - 4 distinct options (indexed `0` to `3` or labeled `A`, `B`, `C`, `D`).
     - Correct option identifier.
     - Short explanation validating the correct choice.
  2. **5 Flashcards:**
     - Front: Question or core concept prompt.
     - Back: Clear, concise answer or key definition.

### 4.3 Interactive Quiz Mode
- Clean quiz interface allowing students to select an option for each question.
- Real-time or batch submission to calculate score (e.g., `4/5 (80%)`).
- Visual feedback on correct vs. incorrect answers with the AI-generated explanation revealed upon completion.
- Retake quiz functionality.

### 4.4 Interactive Flashcards
- Card flip animation (CSS 3D transform) revealing front/back.
- Navigation controls (Next card, Previous card, Card counter `X / 5`).
- Keyboard shortcut support (Space or Enter to flip, arrows to navigate).

### 4.5 Robust Error & Health Handling
- Backend `/api/health` endpoint that checks local Ollama connectivity (`http://127.0.0.1:11434/api/tags`).
- Visual connection status indicator in the frontend header (🟢 Connected / 🔴 Ollama Offline).
- Human-friendly alert cards when:
  - Ollama is not running locally.
  - The model `gemma3:4b` is not installed or pulled.
  - Malformed JSON is returned from the local model (with automatic fallback parser or retry).

---

## 5. Non-Functional Requirements
- **Performance:** Streamlined JSON parsing with low latency overhead.
- **UI/UX Aesthetics:** Polished, modern dark/light balanced theme, crisp typography (Inter/system-ui), subtle glassmorphism, responsive grid layout for desktop, tablet, and mobile.
- **Portability:** Can be cloned and run on any local Windows, macOS, or Linux machine with Ollama installed.
