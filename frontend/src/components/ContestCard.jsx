import React from 'react';
import './ContestCard.css';

export default function ContestCard({ contest, onJoin, onView }) {
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming': return '#3498db';
      case 'ongoing': return '#27ae60';
      case 'completed': return '#95a5a6';
      default: return '#95a5a6';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'upcoming': return '🕐 Upcoming';
      case 'ongoing': return '🔥 Live Now';
      case 'completed': return '✅ Completed';
      default: return 'Unknown';
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#27ae60';
      case 'Medium': return '#f39c12';
      case 'Hard': return '#e74c3c';
      case 'Expert': return '#9b59b6';
      default: return '#95a5a6';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getQuestionTypeIcon = (questionType) => {
    return questionType === 'mcq' ? '📝' : '💻';
  };

  return (
    <div className="contest-card">
      <div className="contest-header">
        <div className="contest-title-section">
          <h3 className="contest-title">{contest.title}</h3>
          <div className="contest-meta">
            <span 
              className="status-badge"
              style={{ backgroundColor: getStatusColor(contest.status) }}
            >
              {getStatusText(contest.status)}
            </span>
            <span 
              className="difficulty-badge"
              style={{ backgroundColor: getDifficultyColor(contest.difficulty) }}
            >
              {contest.difficulty}
            </span>
          </div>
        </div>
        <div className="contest-actions">
          {contest.status === 'upcoming' && (
            <button 
              className="join-btn"
              onClick={() => onJoin(contest.id)}
            >
              🚀 Join Contest
            </button>
          )}
          {contest.status === 'ongoing' && (
            <button 
              className="enter-btn"
              onClick={() => onView(contest.id)}
            >
              🎯 Enter Now
            </button>
          )}
          {contest.status === 'completed' && (
            <button 
              className="view-btn"
              onClick={() => onView(contest.id)}
            >
              📊 View Results
            </button>
          )}
        </div>
      </div>

      <p className="contest-description">{contest.description}</p>

      <div className="contest-details">
        <div className="detail-row">
          <div className="detail-item">
            <span className="detail-icon">📅</span>
            <span className="detail-label">Start:</span>
            <span className="detail-value">{formatDate(contest.start_date)}</span>
          </div>
          <div className="detail-item">
            <span className="detail-icon">⏰</span>
            <span className="detail-label">Duration:</span>
            <span className="detail-value">{formatDuration(contest.duration)}</span>
          </div>
        </div>
        
        <div className="detail-row">
          <div className="detail-item">
            <span className="detail-icon">👥</span>
            <span className="detail-label">Participants:</span>
            <span className="detail-value">{contest.current_participants || 0}/{contest.max_participants}</span>
          </div>
          <div className="detail-item">
            <span className="detail-icon">🏆</span>
            <span className="detail-label">Problems:</span>
            <span className="detail-value">{contest.problem_count || 0}</span>
          </div>
        </div>
      </div>

      <div className="contest-problems-preview">
        <h4>📋 Problems Preview</h4>
        <div className="problems-grid">
          {/* Since we don't have problems in the main contest query, show a placeholder */}
          <div className="problem-preview">
            <span className="problem-type-icon">💻</span>
            <span className="problem-title">Problems will be loaded when contest starts</span>
            <span className="problem-points">-</span>
          </div>
        </div>
      </div>

      <div className="contest-footer">
        <div className="department-info">
          <span className="department-badge">{contest.department} Department</span>
        </div>
        <div className="contest-stats">
          <span className="stat-item">
            <span className="stat-icon">📊</span>
            <span className="stat-value">{Math.round((contest.currentParticipants / contest.maxParticipants) * 100)}%</span>
            <span className="stat-label">Full</span>
          </span>
        </div>
      </div>
    </div>
  );
} 