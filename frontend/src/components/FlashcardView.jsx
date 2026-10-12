import React, { useState, useEffect, useCallback } from 'react';

export default function FlashcardView({ flashcards = [] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [viewMode, setViewMode] = useState('single'); // 'single' | 'grid'

  const totalCards = flashcards.length;
  const currentCard = flashcards[currentIndex] || null;

  const handleNext = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1 < totalCards ? prev + 1 : 0));
  }, [totalCards]);

  const handlePrev = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 >= 0 ? prev - 1 : totalCards - 1));
  }, [totalCards]);

  const handleFlip = useCallback(() => {
    setIsFlipped((prev) => !prev);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore if user is typing in textarea or input
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      if (e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        handleFlip();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleFlip, handleNext, handlePrev]);

  if (!totalCards || !currentCard) {
    return (
      <div className="empty-state-container">
        <p>No flashcards available. Please generate study materials.</p>
      </div>
    );
  }

  return (
    <div className="flashcards-section" aria-label="Interactive Flashcards">
      {/* Top Controls Bar */}
      <div className="flashcards-top-bar">
        <div className="flashcards-counter-pill">
          <span className="dot active"></span>
          <span>Card {currentIndex + 1} of {totalCards}</span>
        </div>

        <div className="view-mode-toggles">
          <button
            type="button"
            className={`mode-btn ${viewMode === 'single' ? 'active' : ''}`}
            onClick={() => setViewMode('single')}
            title="Single card focus mode with 3D flip"
          >
            🗂️ Interactive Flip
          </button>
          <button
            type="button"
            className={`mode-btn ${viewMode === 'grid' ? 'active' : ''}`}
            onClick={() => setViewMode('grid')}
            title="View all cards at once"
          >
            📋 Grid View
          </button>
        </div>
      </div>

      {viewMode === 'single' ? (
        <div className="flashcard-interactive-wrapper">
          {/* Card Step Progress Bar */}
          <div className="progress-dots-row">
            {flashcards.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`progress-step-pill ${idx === currentIndex ? 'active' : ''}`}
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentIndex(idx);
                }}
                aria-label={`Go to card ${idx + 1}`}
              />
            ))}
          </div>

          {/* 3D Flip Card Container */}
          <div className="flip-card-perspective-container">
            <div
              id="active-flashcard"
              className={`flip-card-inner ${isFlipped ? 'is-flipped' : ''}`}
              onClick={handleFlip}
              role="button"
              tabIndex={0}
              aria-label="Flashcard. Click or press space to flip."
            >
              {/* Front Face (Question / Concept) */}
              <div className="flip-card-face flip-card-front">
                <div className="card-face-header">
                  <span className="face-badge front">QUESTION • CONCEPT</span>
                  <span className="flip-hint-icon">🔄 Click or press Space to flip</span>
                </div>
                <div className="card-face-body">
                  <h3 className="card-question-text">{currentCard.front}</h3>
                </div>
                <div className="card-face-footer">
                  <span className="card-id-label">Card #{currentCard.id || currentIndex + 1}</span>
                  <span className="action-link">Reveal Answer ➔</span>
                </div>
              </div>

              {/* Back Face (Answer / Explanation) */}
              <div className="flip-card-face flip-card-back">
                <div className="card-face-header">
                  <span className="face-badge back">ANSWER • EXPLANATION</span>
                  <span className="flip-hint-icon">🔄 Click or press Space to flip</span>
                </div>
                <div className="card-face-body">
                  <p className="card-answer-text">{currentCard.back}</p>
                </div>
                <div className="card-face-footer">
                  <span className="card-id-label">Card #{currentCard.id || currentIndex + 1}</span>
                  <span className="action-link">Back to Question ↺</span>
                </div>
              </div>
            </div>
          </div>

          {/* Nav Controls */}
          <div className="flashcard-controls-row">
            <button
              id="prev-card-btn"
              type="button"
              className="card-nav-btn"
              onClick={handlePrev}
              title="Previous card (Left Arrow)"
            >
              ← Previous
            </button>

            <button
              id="flip-card-btn"
              type="button"
              className="flip-action-btn"
              onClick={handleFlip}
              title="Flip card (Spacebar)"
            >
              <span className="flip-btn-icon">↻</span> {isFlipped ? 'Show Question' : 'Flip to Answer'}
            </button>

            <button
              id="next-card-btn"
              type="button"
              className="card-nav-btn primary"
              onClick={handleNext}
              title="Next card (Right Arrow)"
            >
              Next Card →
            </button>
          </div>

          <p className="keyboard-shortcuts-hint">
            💡 Keyboard Shortcuts: <strong>Space</strong> to Flip • <strong>← / →</strong> Arrow keys to Navigate
          </p>
        </div>
      ) : (
        /* Grid View Mode */
        <div className="flashcards-grid">
          {flashcards.map((card, idx) => (
            <div key={card.id || idx} className="grid-flashcard-item">
              <div className="grid-card-header">
                <span className="card-badge">Card #{idx + 1}</span>
              </div>
              <div className="grid-card-front-box">
                <h4 className="grid-card-label">Front:</h4>
                <p className="grid-card-text">{card.front}</p>
              </div>
              <div className="grid-card-back-box">
                <h4 className="grid-card-label highlight">Back:</h4>
                <p className="grid-card-text">{card.back}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
