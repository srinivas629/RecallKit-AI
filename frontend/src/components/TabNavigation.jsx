import React from 'react';

export default function TabNavigation({
  activeTab,
  setActiveTab,
  quizCount = 5,
  flashcardCount = 5
}) {
  const tabs = [
    {
      id: 'quiz',
      label: 'Quiz',
      icon: '📝',
      badge: `${quizCount} Questions`,
      description: 'Test your understanding with 4-choice questions'
    },
    {
      id: 'flashcards',
      label: 'Flashcards',
      icon: '🗂️',
      badge: `${flashcardCount} Cards`,
      description: 'Active recall training with 3D flip cards'
    },
    {
      id: 'explanations',
      label: 'Explanations',
      icon: '💡',
      badge: 'Review & Concepts',
      description: 'Comprehensive breakdown of answers and reasoning'
    }
  ];

  return (
    <nav className="tabs-navigation-container" aria-label="Study Material Sections">
      <div className="tabs-bar">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              className={`tab-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
              aria-selected={isActive}
              role="tab"
            >
              <div className="tab-btn-content">
                <span className="tab-icon">{tab.icon}</span>
                <span className="tab-label">{tab.label}</span>
                <span className="tab-badge">{tab.badge}</span>
              </div>
              {isActive && <div className="tab-indicator" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
