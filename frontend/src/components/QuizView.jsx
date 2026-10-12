import React, { useState } from 'react';

const OPTION_LABELS = ['A', 'B', 'C', 'D'];

export default function QuizView({ questions = [] }) {
  // selectedAnswers: { [questionId]: optionIndex }
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const totalQuestions = questions.length;
  const answeredCount = Object.keys(selectedAnswers).length;

  const handleSelectOption = (questionId, optionIndex) => {
    if (isSubmitted) return; // Prevent changing after submission until retake
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }));
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
  };

  const handleRetakeQuiz = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
  };

  // Calculate score
  let correctCount = 0;
  if (isSubmitted) {
    questions.forEach(q => {
      if (selectedAnswers[q.id] === q.correct_index) {
        correctCount += 1;
      }
    });
  }

  const scorePercentage = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const getScoreVerdict = (percent) => {
    if (percent === 100) return { title: 'Perfect Score! 🌟', subtitle: 'You have mastered this study material.' };
    if (percent >= 80) return { title: 'Great Job! 🎉', subtitle: 'You have a solid grasp of the core concepts.' };
    if (percent >= 60) return { title: 'Good Effort! 📚', subtitle: 'Review the explanations below to reinforce weaker areas.' };
    return { title: 'Keep Practicing! 💪', subtitle: 'Use the flashcards and review explanations to boost recall.' };
  };

  const verdict = getScoreVerdict(scorePercentage);

  return (
    <div className="quiz-view-container" aria-label="Multiple Choice Quiz">
      {/* Quiz Header / Status Row */}
      <div className="quiz-top-bar">
        <div className="quiz-meta-info">
          <span className="quiz-pill">
            <span className="dot active"></span> 5 Multiple Choice Questions
          </span>
          <span className="answered-status">
            {isSubmitted
              ? `Completed (${totalQuestions}/${totalQuestions})`
              : `${answeredCount} of ${totalQuestions} answered`}
          </span>
        </div>

        <div className="quiz-actions-top">
          {!isSubmitted ? (
            <button
              id="submit-quiz-btn"
              type="button"
              className="submit-quiz-btn"
              onClick={handleSubmitQuiz}
              disabled={answeredCount === 0}
            >
              Submit & Check Answers ({answeredCount}/{totalQuestions})
            </button>
          ) : (
            <button
              id="retake-quiz-btn"
              type="button"
              className="retake-quiz-btn"
              onClick={handleRetakeQuiz}
            >
              🔄 Retake Quiz
            </button>
          )}
        </div>
      </div>

      {/* Submitted Score Summary Banner */}
      {isSubmitted && (
        <div className="score-summary-card">
          <div className="score-badge-circle">
            <span className="score-number">{scorePercentage}%</span>
            <span className="score-subtext">{correctCount}/{totalQuestions} Correct</span>
          </div>
          <div className="score-verdict-info">
            <h3 className="score-verdict-title">{verdict.title}</h3>
            <p className="score-verdict-desc">{verdict.subtitle}</p>
            <div className="score-progress-track">
              <div
                className="score-progress-bar"
                style={{ width: `${scorePercentage}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Questions List */}
      <div className="questions-list">
        {questions.map((q, qIndex) => {
          const selectedOption = selectedAnswers[q.id];
          const hasSelected = selectedOption !== undefined;
          const isCorrect = isSubmitted && selectedOption === q.correct_index;
          const isIncorrect = isSubmitted && hasSelected && selectedOption !== q.correct_index;
          const isUnanswered = isSubmitted && !hasSelected;

          return (
            <article
              key={q.id || qIndex}
              className={`question-card ${
                isSubmitted
                  ? isCorrect
                    ? 'card-correct'
                    : 'card-incorrect'
                  : hasSelected
                    ? 'card-selected'
                    : ''
              }`}
            >
              <div className="question-header">
                <span className="question-number">Question {qIndex + 1}</span>
                {isSubmitted && (
                  <span className={`result-tag ${isCorrect ? 'correct' : 'incorrect'}`}>
                    {isCorrect ? '✓ Correct (+1)' : isUnanswered ? '○ Unanswered (0)' : '✗ Incorrect (0)'}
                  </span>
                )}
              </div>

              <h3 className="question-text">{q.question}</h3>

              <div className="options-grid">
                {q.options.map((option, optIdx) => {
                  const isThisSelected = selectedOption === optIdx;
                  const isThisTheCorrectAnswer = isSubmitted && optIdx === q.correct_index;
                  const isThisWrongSelected = isSubmitted && isThisSelected && !isThisTheCorrectAnswer;

                  let optionClass = 'option-btn';
                  if (isSubmitted) {
                    if (isThisTheCorrectAnswer) {
                      optionClass += ' option-correct';
                    } else if (isThisWrongSelected) {
                      optionClass += ' option-wrong';
                    } else {
                      optionClass += ' option-dimmed';
                    }
                  } else if (isThisSelected) {
                    optionClass += ' option-selected';
                  }

                  return (
                    <button
                      key={optIdx}
                      type="button"
                      className={optionClass}
                      onClick={() => handleSelectOption(q.id, optIdx)}
                      disabled={isSubmitted}
                      aria-pressed={isThisSelected}
                    >
                      <span className="option-letter">{OPTION_LABELS[optIdx]}</span>
                      <span className="option-text">{option}</span>
                      {isSubmitted && isThisTheCorrectAnswer && (
                        <span className="option-badge-icon">✓</span>
                      )}
                      {isSubmitted && isThisWrongSelected && (
                        <span className="option-badge-icon">✗</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Reveal */}
              {isSubmitted && q.explanation && (
                <div className="explanation-box">
                  <div className="explanation-title">
                    <span className="bulb-icon">💡</span> Explanation:
                  </div>
                  <p className="explanation-content">{q.explanation}</p>
                </div>
              )}
            </article>
          );
        })}
      </div>

      {/* Bottom Submit/Retake Button */}
      <div className="quiz-bottom-actions">
        {!isSubmitted ? (
          <button
            type="button"
            className="submit-quiz-btn large"
            onClick={handleSubmitQuiz}
            disabled={answeredCount === 0}
          >
            Submit & Calculate Score ({answeredCount}/{totalQuestions})
          </button>
        ) : (
          <button
            type="button"
            className="retake-quiz-btn large"
            onClick={handleRetakeQuiz}
          >
            🔄 Retake Quiz
          </button>
        )}
      </div>
    </div>
  );
}
