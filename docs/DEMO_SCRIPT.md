# RecallKit AI - Hackathon Demo Script & Presentation Guide

**Time:** 2 - 3 minutes  
**Target Audience:** Hackathon Judges, Educators, and Developers  
**Core Message:** 100% Private, Zero-Cost, Local Study Toolkit Powered by Gemma & Ollama

---

## 1. The Hook (0:00 - 0:30)
> *"Hello everyone! We’ve all used AI tools to study, but they often come with painful trade-offs: monthly subscription paywalls, rate limits, and sending our private lecture notes and research into third-party cloud servers.*  
> *Meet **RecallKit AI** — a high-speed, beginner-friendly study companion that runs **completely offline on your own machine** using local Gemma models and Ollama. No API keys, no subscription tiers, no cloud dependencies, and zero data leakage."*

---

## 2. Architecture & Status Check (0:30 - 0:50)
- **Show the Interface:**
  > *"When we open the application, notice the live status badge at the top right: `🟢 Local Ollama Connected (gemma3:4b)`. The frontend immediately verified our local backend and Ollama server health without any cloud pings."*
- **Highlight Simplicity:**
  > *"Built with a lightweight React + Vite frontend and a high-performance Python FastAPI backend."*

---

## 3. Live Generation Demo (0:50 - 1:40)
- **Action:** Click the **"Load Sample Notes"** button (loads sample notes on Photosynthesis or Computer Architecture) or paste custom notes.
- **Action:** Click **"Generate Study Kit"**.
- **Talking Points while loading (~5-15 seconds depending on hardware):**
  > *"Behind the scenes, our FastAPI server constructs a strict prompt schema and invokes `gemma3:4b` running natively through Ollama on this Windows machine. In a single pass, it derives both multiple-choice diagnostic questions and flashcards."*
- **Reveal:** Both tabs populate instantly once generation completes.

---

## 4. Feature Walkthrough: Interactive Quiz (1:40 - 2:10)
- **Action:** Stay on the **Quiz Mode** tab.
- **Select Answers:** Choose options across the 5 generated questions. Pick one intentional wrong answer to demonstrate the grading logic.
- **Action:** Click **"Submit & Calculate Score"**.
- **Highlight:**
  > *"We get an instant score calculation (e.g., 80% - 4/5 correct). Notice how wrong answers are clearly flagged in red, the correct option is highlighted in green, and Gemma provides an instant conceptual explanation for why that option is correct."*

---

## 5. Feature Walkthrough: 3D Flip Flashcards (2:10 - 2:35)
- **Action:** Switch to the **Flashcards** tab.
- **Action:** Click on the card (or press Space) to trigger the smooth 3D flip animation revealing the back answer.
- **Action:** Use the "Next" and "Previous" controls to flip through all 5 cards.
  > *"Students can immediately switch to active recall mode with responsive 3D flip flashcards designed to lock in retention."*

---

## 6. Resilience & Error Handling Demo (2:35 - 2:50)
- **Demonstration / Talking Point:**
  > *"What if Ollama isn't running? RecallKit AI features proactive health monitoring. Instead of an unhandled crash or blank screen, the user is greeted with a clear, helpful troubleshooting banner instructing them to run `ollama serve` or check their model status."*

---

## 7. Wrap-up & Future Vision (2:50 - 3:00)
> *"RecallKit AI proves that local AI is practical, responsive, and private for everyday students. Thank you, and we'd love to take your questions!"*
