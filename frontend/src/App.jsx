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
import { SAMPLE_NOTES, SAMPLE_STUDY_MATERIAL } from './data/sampleData';
import './App.css';

export default function App() {
  // Application State
  const [notes, setNotes] = useState(SAMPLE_NOTES);
  const [studyData, setStudyData] = useState(SAMPLE_STUDY_MATERIAL);
  const [activeTab, setActiveTab] = useState('quiz');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [dataNotice, setDataNotice] = useState('Initialized with realistic sample study material. Click Generate to test workflow.');

  // Live Health Status - starts at 'checking' and only turns connected if confirmed
  const [healthStatus, setHealthStatus] = useState({
    status: 'checking',
    connected: false,
    model: null,
    message: 'Checking local backend & Ollama status...'
  });
  const [isRefreshingHealth, setIsRefreshingHealth] = useState(false);

  // Health verification function
  const verifyHealth = useCallback(async () => {
    setIsRefreshingHealth(true);
    try {
      const res = await checkBackendHealth();
      setHealthStatus(res);
    } catch (err) {
      setHealthStatus({
        status: 'backend_offline',
        connected: false,
        message: 'Unable to reach backend service'
      });
    } finally {
      setIsRefreshingHealth(false);
    }
  }, []);

  // Check health on initial mount
  useEffect(() => {
    verifyHealth();
    // Periodic check every 15 seconds
    const interval = setInterval(verifyHealth, 15000);
    return () => clearInterval(interval);
  }, [verifyHealth]);

  // Generation Handler
  const handleGenerate = async () => {
    if (!notes.trim()) {
      setErrorMessage('Please paste or enter some study notes before generating.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await generateStudyKit(notes, { allowSampleFallback: true });
      setStudyData({
        quiz: result.quiz,
        flashcards: result.flashcards
      });
      if (result.notice) {
        setDataNotice(result.notice);
      } else {
        setDataNotice('Successfully generated live using local Gemma model!');
      }
    } catch (err) {
      setErrorMessage(
        err.message || 'Failed to generate study kit. Please check if Ollama is running and retry.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseSampleFallback = () => {
    setNotes(SAMPLE_NOTES);
    setStudyData(SAMPLE_STUDY_MATERIAL);
    setErrorMessage(null);
    setDataNotice('Loaded sample biology study material.');
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
            onUseSample={handleUseSampleFallback}
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

        {/* Generation Source / Status Notice */}
        {dataNotice && !isLoading && (
          <div className="notice-pill-bar">
            <span className="notice-icon">ℹ️</span>
            <span className="notice-text">{dataNotice}</span>
          </div>
        )}

        {/* Content Section or Loading Indicator */}
        {isLoading ? (
          <LoadingIndicator />
        ) : studyData ? (
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
        ) : null}
      </main>

      <footer className="app-footer">
        <p>
          RecallKit AI • Built for MLH Hackathon • 100% Local Inference via Ollama & Gemma 3
        </p>
      </footer>
    </div>
  );
}
