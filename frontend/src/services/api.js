import { SAMPLE_STUDY_MATERIAL } from '../data/sampleData';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Check health of backend and local Ollama server.
 * Returns honest status: only returns connected=true if backend actually confirms it.
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`${API_BASE_URL}/api/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        status: 'error',
        connected: false,
        message: `Backend returned status ${res.status}`
      };
    }

    const data = await res.json();
    return {
      status: data.ollama_connected ? 'connected' : 'ollama_offline',
      connected: !!data.ollama_connected,
      model: data.model || 'gemma3:4b',
      message: data.ollama_connected
        ? `Local model ready (${data.model || 'gemma3:4b'})`
        : 'Backend running, but local Ollama service is unreachable'
    };
  } catch (err) {
    return {
      status: 'backend_offline',
      connected: false,
      message: 'Local FastAPI backend not connected (run on port 8000)'
    };
  }
}

/**
 * Generate quiz questions and flashcards.
 * Attempts real FastAPI endpoint first; can fallback to realistic sample data for UI testing.
 */
export async function generateStudyKit(notes, { allowSampleFallback = true } = {}) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s for local LLM inference

    const res = await fetch(`${API_BASE_URL}/api/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ notes }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.detail || `Server error (${res.status}): Failed to generate study material`);
    }

    const data = await res.json();
    return {
      source: 'backend',
      quiz: data.quiz,
      flashcards: data.flashcards
    };
  } catch (error) {
    if (allowSampleFallback) {
      // Simulate realistic generation delay so user can test the loading UI
      await new Promise(resolve => setTimeout(resolve, 1200));
      return {
        source: 'sample',
        notice: 'Loaded realistic sample data (FastAPI backend is offline)',
        quiz: SAMPLE_STUDY_MATERIAL.quiz,
        flashcards: SAMPLE_STUDY_MATERIAL.flashcards
      };
    }
    throw error;
  }
}
