import React, { useState, useEffect } from 'react';

const LOADING_STAGES = [
  'Ingesting notes and isolating key concepts...',
  'Prompting local Gemma model (gemma4)...',
  'Crafting 5 targeted multiple-choice questions with 4 options...',
  'Generating concept explanations and rationale...',
  'Formatting interactive active-recall flashcards...',
  'Assembling your complete study kit...'
];

export default function LoadingIndicator() {
  const [stageIndex, setStageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStageIndex(prev => (prev + 1 < LOADING_STAGES.length ? prev + 1 : prev));
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-card-container" role="status" aria-live="polite">
      <div className="loading-pulse-ring">
        <div className="loading-spinner"></div>
        <div className="loading-center-brain">🧠</div>
      </div>

      <h3 className="loading-title">Generating Study Kit</h3>
      <p className="loading-stage-text">{LOADING_STAGES[stageIndex]}</p>

      <div className="loading-progress-indeterminate">
        <div className="indeterminate-bar"></div>
      </div>

      <p className="loading-subhint">
        ⚡ Running 100% locally via Ollama with Gemma 4. No cloud APIs, completely private.
      </p>
    </div>
  );
}
