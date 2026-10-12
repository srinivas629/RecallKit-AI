import React from 'react';

export default function Header({ healthStatus, onRefreshHealth, isRefreshing }) {
  // Determine badge styling and label based on verified backend & model status
  const getStatusBadge = () => {
    if (healthStatus.status === 'checking') {
      return {
        dotClass: 'status-dot checking',
        label: 'Checking Local Ollama...',
        tooltip: 'Verifying connection to local FastAPI backend and Ollama server'
      };
    }
    if (healthStatus.status === 'connected') {
      return {
        dotClass: 'status-dot connected',
        label: `Gemma 3 Ready (${healthStatus.model || 'gemma3:4b'})`,
        tooltip: 'Backend is connected and local Ollama gemma3:4b model is ready'
      };
    }
    if (healthStatus.status === 'ollama_offline') {
      return {
        dotClass: 'status-dot offline',
        label: 'Ollama Offline (127.0.0.1:11434)',
        tooltip: 'FastAPI is online, but Ollama service is unreachable. Start it with: ollama serve'
      };
    }
    // backend_offline or initial state
    return {
      dotClass: 'status-dot offline',
      label: 'FastAPI Offline (:8000)',
      tooltip: 'Local backend not detected on port 8000. Start backend to enable live Gemma inference.'
    };
  };

  const badge = getStatusBadge();

  return (
    <header className="app-header">
      <div className="header-brand-container">
        <div className="brand-logo-wrap">
          <div className="ai-icon-pulse">
            <svg
              className="ai-spark-icon"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-label="AI Icon"
            >
              <path
                d="M12 2L14.4 7.6L20 10L14.4 12.4L12 18L9.6 12.4L4 10L9.6 7.6L12 2Z"
                fill="url(#sparkGradient)"
              />
              <path
                d="M19 16L20.2 18.8L23 20L20.2 21.2L19 24L17.8 21.2L15 20L17.8 18.8L19 16Z"
                fill="url(#sparkGradient2)"
              />
              <defs>
                <linearGradient id="sparkGradient" x1="4" y1="2" x2="20" y2="18" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" />
                  <stop offset="1" stopColor="#06b6d4" />
                </linearGradient>
                <linearGradient id="sparkGradient2" x1="15" y1="16" x2="23" y2="24" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a855f7" />
                  <stop offset="1" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <div className="brand-text-block">
            <div className="brand-title-row">
              <h1 className="brand-title">RecallKit <span className="brand-badge">AI</span></h1>
              <span className="local-tag">100% Local</span>
            </div>
            <p className="brand-tagline">Turn your notes into knowledge.</p>
          </div>
        </div>

        <div className="header-status-container">
          <div
            className="status-pill"
            title={badge.tooltip}
          >
            <span className={badge.dotClass}></span>
            <span className="status-label">{badge.label}</span>
            <button
              onClick={onRefreshHealth}
              disabled={isRefreshing}
              className={`refresh-btn ${isRefreshing ? 'spinning' : ''}`}
              title="Re-check local status"
              aria-label="Re-check status"
            >
              <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
