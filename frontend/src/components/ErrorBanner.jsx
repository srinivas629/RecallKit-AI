import React from 'react';

export default function ErrorBanner({ message, onRetry, onDismiss, onUseSample }) {
  return (
    <div className="error-banner-card" role="alert">
      <div className="error-icon-box">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="8" x2="12" y2="12" />
          <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
      </div>

      <div className="error-content-body">
        <h4 className="error-title">Generation Issue Detected</h4>
        <p className="error-message-text">{message}</p>
        <div className="error-troubleshooting-tips">
          <span>Troubleshooting:</span>
          <ul>
            <li>Ensure Ollama is running in your terminal: <code>ollama serve</code></li>
            <li>Ensure your FastAPI backend is running: <code>python -m uvicorn main:app --port 8000</code></li>
            <li>Verify the model is installed: <code>ollama list</code></li>
          </ul>
        </div>
      </div>

      <div className="error-actions-cluster">
        {onRetry && (
          <button
            type="button"
            className="error-retry-btn"
            onClick={onRetry}
          >
            🔄 Retry
          </button>
        )}
        {onUseSample && (
          <button
            type="button"
            className="error-sample-btn"
            onClick={onUseSample}
            title="Load pre-built sample data to test the UI immediately"
          >
            ✨ Load Preview Sample
          </button>
        )}
        {onDismiss && (
          <button
            type="button"
            className="error-dismiss-btn"
            onClick={onDismiss}
            aria-label="Dismiss message"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}
