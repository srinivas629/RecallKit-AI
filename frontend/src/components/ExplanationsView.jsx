import React, { useState } from 'react';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function ExplanationsView({ questions = [] }) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredQuestions = questions.filter(q => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      q.question.toLowerCase().includes(query) ||
      (q.explanation && q.explanation.toLowerCase().includes(query)) ||
      q.options.some(opt => opt.toLowerCase().includes(query))
    );
  });

  return (
    <div className="explanations-view-container" aria-label="Conceptual Explanations">
      <div className="explanations-header-row">
        <div>
          <h2 className="explanations-title">
            <span className="icon">💡</span> Deep-Dive Conceptual Explanations
          </h2>
          <p className="explanations-desc">
            Review detailed breakdowns for each quiz question and master the reasoning behind the correct answers.
          </p>
        </div>

        <div className="search-box-wrap">
          <input
            type="text"
            className="search-input"
            placeholder="Filter concepts or terms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="explanations-cards-grid">
        {filteredQuestions.map((q, idx) => {
          const correctOptionText = q.options[q.correct_index] || '';
          const correctOptionLabel = OPTION_LABELS[q.correct_index] || '';

          return (
            <div key={q.id || idx} className="explanation-card">
              <div className="exp-card-header">
                <span className="exp-number-tag">Concept #{idx + 1}</span>
                <span className="exp-status-tag">Key Knowledge Point</span>
              </div>

              <h3 className="exp-question-title">{q.question}</h3>

              <div className="exp-correct-banner">
                <span className="exp-correct-label">Correct Answer:</span>
                <span className="exp-correct-value">
                  <strong>Option {correctOptionLabel}:</strong> {correctOptionText}
                </span>
              </div>

              <div className="exp-detailed-body">
                <h4 className="exp-subhead">Reasoning & Explanation:</h4>
                <p className="exp-text">{q.explanation}</p>
              </div>

              <div className="exp-distractors-summary">
                <h4 className="exp-subhead text-muted">Other Options Evaluated:</h4>
                <ul className="exp-distractor-list">
                  {q.options.map((opt, optIdx) => {
                    if (optIdx === q.correct_index) return null;
                    return (
                      <li key={optIdx} className="exp-distractor-item">
                        <span className="distractor-letter">{OPTION_LABELS[optIdx]}:</span>
                        <span className="distractor-text">{opt}</span>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          );
        })}

        {filteredQuestions.length === 0 && (
          <div className="empty-filter-state">
            <p>No concepts matching "{searchQuery}". Clear your search to see all 5 explanations.</p>
          </div>
        )}
      </div>
    </div>
  );
}
