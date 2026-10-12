import React from 'react';
import { SAMPLE_NOTES } from '../data/sampleData';

export default function NotesInput({
  notes,
  setNotes,
  onGenerate,
  isLoading,
  hasExistingData
}) {
  const charCount = notes.length;
  const wordCount = notes.trim() ? notes.trim().split(/\s+/).length : 0;
  const isTooShort = charCount > 0 && charCount < 50;

  const handleLoadSample = () => {
    setNotes(SAMPLE_NOTES);
  };

  const handleClear = () => {
    setNotes('');
  };

  return (
    <section className="notes-input-section" aria-label="Study notes input">
      <div className="section-header-row">
        <div className="section-title-wrap">
          <h2 className="section-title">
            <span className="section-icon">📝</span> Paste Your Study Notes
          </h2>
          <p className="section-subtitle">
            Paste lecture notes, article excerpts, or concept summaries below to generate your kit.
          </p>
        </div>

        <div className="quick-actions">
          <button
            type="button"
            className="action-pill-btn"
            onClick={handleLoadSample}
            disabled={isLoading}
            title="Load biology study notes for quick testing"
          >
            <span className="icon">✨</span> Load Sample Notes
          </button>
          {notes && (
            <button
              type="button"
              className="action-pill-btn danger"
              onClick={handleClear}
              disabled={isLoading}
              title="Clear text area"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      <div className="textarea-wrapper">
        <textarea
          id="study-notes-input"
          className="study-notes-textarea"
          placeholder="Paste your study notes here (minimum ~50 characters recommended for high-quality quiz generation)...

Example:
Glycolysis occurs in the cytoplasm of the cell and converts one molecule of glucose into two molecules of pyruvate. It is an anaerobic process producing a net gain of 2 ATP and 2 NADH..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          disabled={isLoading}
          rows={7}
        />

        <div className="textarea-footer">
          <div className="counter-stats">
            <span className={`counter-item ${isTooShort ? 'warning' : ''}`}>
              <strong>{charCount.toLocaleString()}</strong> characters
            </span>
            <span className="counter-divider">•</span>
            <span className="counter-item">
              <strong>{wordCount.toLocaleString()}</strong> words
            </span>
            {isTooShort && (
              <span className="length-hint"> (Recommendation: 50+ chars)</span>
            )}
          </div>

          <button
            id="generate-material-btn"
            type="button"
            className={`generate-btn ${isLoading ? 'loading' : ''}`}
            onClick={onGenerate}
            disabled={isLoading || !notes.trim()}
          >
            {isLoading ? (
              <>
                <span className="spinner-dot"></span>
                <span>Generating Study Material...</span>
              </>
            ) : (
              <>
                <span className="btn-icon">⚡</span>
                <span>{hasExistingData ? 'Regenerate Study Material' : 'Generate Study Material'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
