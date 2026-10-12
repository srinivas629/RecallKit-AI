# RecallKit AI - Hackathon Demo Script & Presentation Guide

**Presentation Time:** 2 - 3 minutes  
**Target Audience:** Hackathon Judges, Educators, and Developers  
**Core Message:** 100% Private, Zero-Cost, Local Study Toolkit Powered by Gemma & Ollama

---

## 🎯 Sample Demonstration Notes (Machine Learning)
Keep these notes ready to paste during your demonstration:

```text
Supervised Learning and Neural Networks

Supervised learning trains models on labeled datasets consisting of input features and target labels. In a feedforward neural network, layers perform linear transformations of inputs and weights, followed by non-linear activation functions such as ReLU. The loss function measures prediction error, and backpropagation calculates gradients via the chain rule to update parameters using gradient descent. Overfitting is mitigated through regularization techniques such as dropout and weight decay.
```

---

## 1. The Hook (0:00 - 0:30)
- **Presenter:**
  > *"Hello everyone! We have all used AI tools to study, but they often come with painful trade-offs: monthly subscription paywalls, rate limits, and transmitting private lecture notes and research to third-party cloud servers.*  
  > *Meet **RecallKit AI** — a high-speed study companion that runs **100% locally on your machine** using local Gemma models and Ollama. No API keys, no subscriptions, no cloud dependencies, and zero data leakage."*

---

## 2. Architecture & Real-Time Status Check (0:30 - 0:45)
- **Action:** Open `http://localhost:5173` on the display.
- **Presenter Points to Header:**
  > *"Notice the live status pill at the top right: `🟢 Gemma 3 Ready (gemma3:4b)`. Our React frontend confirmed real-time health directly with our local FastAPI backend and Ollama server. Notice it does not falsely claim connection when services are offline."*

---

## 3. Live Generation Walkthrough (0:45 - 1:30)
- **Action:** Paste the **Supervised Learning and Neural Networks** sample notes into the text area (or click *Load Sample Notes*).
- **Point out:** Live character and word counters updating immediately.
- **Action:** Click **"Generate Study Material"**.
- **Talking Points while loading (~25-35 seconds):**
  > *"Behind the scenes, our FastAPI server constructs a strict JSON prompt schema and calls our locally hosted `gemma3:4b` model via Ollama at `127.0.0.1:11434`. In a single pass, it generates 5 multiple-choice questions with 4 options and reasoning, plus 5 active-recall flashcards."*
- **Visual cue:** The progress indicator pulses with stage messages, and duplicate submissions are safely disabled.

---

## 4. Feature Demo: Interactive Quiz & Scoring (1:30 - 2:05)
- **Action:** Show the populated **Quiz** tab.
- **Action:** Answer all 5 questions on screen. Intentionally choose one incorrect option to demonstrate grading.
- **Action:** Click **"Submit & Check Answers"**.
- **Visual Result:**
  - Animated score summary card appears (`80% - 4/5 Correct - Great Job! 🎉`).
  - Correct answers turn emerald green with checkmarks.
  - Incorrect selection turns rose red with clear distinction.
  - Explanation box expands under each question detailing why the correct answer is right.
- **Presenter:**
  > *"All grading, scoring, and explanation reveals happen instantly inside React with zero additional network or AI round-trips."*

---

## 5. Feature Demo: 3D Flip Flashcards (2:05 - 2:30)
- **Action:** Switch to the **Flashcards** tab.
- **Action:** Click the card or press **Spacebar** to trigger the 3D flip animation revealing the back answer.
- **Action:** Click **"Next Card"** or press the **Right Arrow** key to advance to Card 2.
- **Action:** Toggle to **"Grid View"** to display all 5 cards simultaneously for rapid review.
  > *"Students can switch to active recall mode with responsive 3D flip flashcards designed to lock in retention."*

---

## 6. Feature Demo: Deep-Dive Explanations (2:30 - 2:45)
- **Action:** Switch to the **Explanations** tab.
- **Action:** Type a term like `"loss"` or `"backpropagation"` into the filter box.
- **Presenter:**
  > *"The Explanations view breaks down every concept, identifies the correct answer, and even evaluates why the other distractors are incorrect."*

---

## 7. Wrap-up & Q&A (2:45 - 3:00)
- **Presenter:**
  > *"RecallKit AI proves that local AI is fast, private, and practical for everyday students. Zero API keys, zero cloud costs, 100% on-device learning. Thank you!"*
