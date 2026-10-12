const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000';

/**
 * Check health of FastAPI backend and local Ollama server.
 * Returns true connection status without false claims.
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      return {
        status: 'error',
        connected: false,
        message: `Backend returned HTTP status ${res.status}`
      };
    }

    const data = await res.json();
    const isOllamaConnected = Boolean(data.ollama_connected);
    const isModelAvailable = Boolean(data.model_available);
    const rawModel = data.model || 'gemma4';
    const modelName = rawModel.replace(/gemma3:4b/gi, 'gemma4');

    if (isOllamaConnected && isModelAvailable) {
      return {
        status: 'connected',
        connected: true,
        model: modelName,
        available_models: data.available_models || [],
        message: `Local model ready (${modelName})`
      };
    } else if (isOllamaConnected && !isModelAvailable) {
      return {
        status: 'model_missing',
        connected: false,
        model: modelName,
        available_models: data.available_models || [],
        message: `Ollama is running, but model '${modelName}' is not installed.`
      };
    } else {
      return {
        status: 'ollama_offline',
        connected: false,
        model: modelName,
        available_models: [],
        message: 'Backend running, but local Ollama service is unreachable at 127.0.0.1:11434'
      };
    }
  } catch (err) {
    return {
      status: 'backend_offline',
      connected: false,
      message: 'FastAPI backend is offline (Start server at http://127.0.0.1:8000)'
    };
  }
}

/**
 * Generate quiz questions and flashcards via local FastAPI backend.
 * Never silently substitutes sample answers when generation fails.
 */
export async function generateStudyKit(notes) {
  const trimmed = notes ? notes.trim() : '';
  if (!trimmed) {
    throw new Error('Study notes cannot be empty.');
  }

  const controller = new AbortController();
  // 185-second timeout allowing up to 180s for local Ollama inference
  const timeoutId = setTimeout(() => controller.abort(), 185000);

  try {
    const res = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ notes: trimmed }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      let errorDetail = '';
      try {
        const errorJson = await res.json();
        if (errorJson.detail) {
          if (Array.isArray(errorJson.detail)) {
            errorDetail = errorJson.detail.map(d => d.msg || JSON.stringify(d)).join(', ');
          } else {
            errorDetail = String(errorJson.detail);
          }
        }
      } catch {
        errorDetail = await res.text().catch(() => '');
      }

      if (res.status === 503) {
        throw new Error(errorDetail || 'Local Ollama server is unreachable at http://127.0.0.1:11434. Make sure "ollama serve" is running.');
      } else if (res.status === 504) {
        throw new Error(errorDetail || 'Generation timed out. The local Gemma model took too long to respond. Try shorter notes or check system load.');
      } else if (res.status === 502) {
        throw new Error(errorDetail || 'The local model returned a response that could not be parsed into 5 questions and 5 flashcards.');
      } else if (res.status === 422) {
        throw new Error(errorDetail || 'Invalid input: Please provide between 10 and 20,000 characters of study notes.');
      }

      throw new Error(errorDetail || `Server error (${res.status}): Failed to generate study material.`);
    }

    const data = await res.json();

    if (!data.quiz || !data.flashcards) {
      throw new Error('Server returned an invalid response structure (missing quiz or flashcards).');
    }

    return {
      source: 'backend',
      quiz: data.quiz,
      flashcards: data.flashcards
    };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('Request timed out after 185 seconds. The local Ollama model took too long to complete inference.');
    }
    if (error.message && error.message.includes('Failed to fetch')) {
      throw new Error('Cannot reach FastAPI backend at http://127.0.0.1:8000. Please ensure the backend server is running.');
    }
    throw error;
  }
}
