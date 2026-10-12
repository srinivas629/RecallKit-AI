import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import NotesInput from './components/NotesInput';
import TabNavigation from './components/TabNavigation';
import QuizView from './components/QuizView';
import FlashcardView from './components/FlashcardView';
import ExplanationsView from './components/ExplanationsView';
import LoadingIndicator from './components/LoadingIndicator';
import ErrorBanner from './components/ErrorBanner';

import { checkBackendHealth, generateStudyKit } from './services/api';
import { SAMPLE_NOTES } from './data/sampleData';
import './App.css';

export default function App() {
  // State: Notes pre-loaded with sample notes so user can immediately test with 1 click
  const [notes, setNotes] = useState(SAMPLE_NOTES);
  const [studyData, setStudyData] = useState(null);
  const [activeTab, setActiveTab] = useState('quiz');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [dataNotice, setDataNotice] = useState(null);

  // Live Backend & Ollama Model Health Status
  const [healthStatus, setHealthStatus] = useState({
    status: 'checking',
    connected: false,
    model: null,
    message: 'Checking local backend & Ollama status...'
  });
  const [isRefreshingHealth, setIsRefreshingHealth] = useState(false);

  // Verify backend health on mount and periodically
  const verifyHealth = useCallback(async () => {
    setIsRefreshingHealth(true);
    try {
      const res = await checkBackendHealth();
      setHealthStatus(res);
    } catch {
      setHealthStatus({
        status: 'backend_offline',
        connected: false,
        message: 'Cannot reach local FastAPI backend'
      });
    } finally {
      setIsRefreshingHealth(false);
    }
  }, []);

  useEffect(() => {
    verifyHealth();
    const interval = setInterval(verifyHealth, 15000);
    return () => clearInterval(interval);
  }, [verifyHealth]);

  // Main Generation Handler - Connected to FastAPI /generate
  const handleGenerate = async () => {
    if (isLoading) return; // Prevent duplicate submissions

    if (!notes || !notes.trim()) {
      setErrorMessage('Please paste or enter some study notes before generating.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await generateStudyKit(notes);
      setStudyData({
        quiz: result.quiz,
        flashcards: result.flashcards
      });
      setDataNotice(`Successfully generated 5 questions and 5 flashcards using local ${(healthStatus.model || 'gemma4').replace(/gemma3:4b/gi, 'gemma4')} via Ollama!`);
      // Default to quiz tab on fresh generation
      setActiveTab('quiz');
    } catch (err) {
      // Do not substitute sample answers when AI generation fails
      setErrorMessage(
        err.message || 'Failed to generate study kit. Please verify your local Ollama server is running and retry.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-layout">
      {/* App Header with branding, tagline, and honest local-model indicator */}
      <Header
        healthStatus={healthStatus}
        onRefreshHealth={verifyHealth}
        isRefreshing={isRefreshingHealth}
      />

      <main className="main-content-container">
        {/* Error Notification Banner if generation or connectivity fails */}
        {errorMessage && (
          <ErrorBanner
            message={errorMessage}
            onRetry={handleGenerate}
            onDismiss={() => setErrorMessage(null)}
          />
        )}

        {/* Notes Input Section */}
        <NotesInput
          notes={notes}
          setNotes={setNotes}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          hasExistingData={Boolean(studyData?.quiz?.length)}
        />

        {/* Live Generation Status Notice */}
        {dataNotice && !isLoading && !errorMessage && (
          <div className="notice-pill-bar">
            <span className="notice-icon">✨</span>
            <span className="notice-text">{dataNotice}</span>
          </div>
        )}

        {/* Loading Indicator while local LLM inference is running */}
        {isLoading && <LoadingIndicator />}

        {/* Result Sections or Ready State */}
        {!isLoading && studyData && (
          <div className="study-results-wrapper">
            {/* 3 Result Sections: Quiz, Flashcards, and Explanations */}
            <TabNavigation
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              quizCount={studyData.quiz?.length || 5}
              flashcardCount={studyData.flashcards?.length || 5}
            />

            <div className="tab-panel-container">
              {activeTab === 'quiz' && (
                <QuizView questions={studyData.quiz} />
              )}

              {activeTab === 'flashcards' && (
                <FlashcardView flashcards={studyData.flashcards} />
              )}

              {activeTab === 'explanations' && (
                <ExplanationsView questions={studyData.quiz} />
              )}
            </div>
          </div>
        )}

        {/* Empty State before first generation */}
        {!isLoading && !studyData && !errorMessage && (
          <div className="empty-study-prompt-card">
            <div className="prompt-spark-circle">⚡</div>
            <h3 className="prompt-title">Ready to Generate Your Study Kit</h3>
            <p className="prompt-desc">
              Your lecture notes are loaded above. Click <strong>Generate Study Material</strong> to trigger local AI inference with your installed Gemma model ({(healthStatus.model || 'gemma4').replace(/gemma3:4b/gi, 'gemma4')}).
            </p>
          </div>
        )}
      </main>

      <footer className="app-footer">
        <p>
          RecallKit AI • Built for MLH Hackathon • 100% Local Inference via Ollama & Gemma 4
        </p>
      </footer>
    </div>
  );
}
