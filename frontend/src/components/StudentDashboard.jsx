import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CodingChallenges from './CodingChallenges';
import CodeEditor from './CodeEditor';
import ContestProblemEditor from './ContestProblemEditor';
import collegeLogo from '../assets/college-logo.jpeg';
import { getContestsByDepartment } from '../data/contests';
import ContestCard from './ContestCard';
import { initializeSession, logout, validateSession } from '../utils/sessionManager';
import './StudentDashboard.css';

function StarBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationId;
    canvas.width = width;
    canvas.height = height;

    const STAR_COUNT = 100;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      radius: Math.random() * 1.5 + 0.5,
    }));

    function draw() {
      ctx.clearRect(0, 0, width, height);
      // Draw stars
      for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.shadowColor = '#fff';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
      // Draw lines
      for (let i = 0; i < stars.length; i++) {
        for (let j = i + 1; j < stars.length; j++) {
          const dx = stars[i].x - stars[j].x;
          const dy = stars[i].y - stars[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = 'rgba(255,255,255,0.1)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    }

    function update() {
      for (const star of stars) {
        star.x += star.vx;
        star.y += star.vy;
        if (star.x < 0 || star.x > width) star.vx *= -1;
        if (star.y < 0 || star.y > height) star.vy *= -1;
      }
    }

    function animate() {
      update();
      draw();
      animationId = requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    }
    window.addEventListener('resize', handleResize);
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} className="star-bg-canvas" />;
}

function Header({ isLive, lastUpdate, connectionStatus }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="student-header">
      <div className="header-logo-section">
        <img src={collegeLogo} alt="SKN College Logo" className="header-college-logo" />
        <div className="logo">SKN <span>CODEMATE</span></div>
      </div>
      <div className="header-live-section">
        <LiveIndicator isLive={isLive} lastUpdate={lastUpdate} connectionStatus={connectionStatus} />
      </div>
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </nav>
    </header>
  );
}

function StatCard({ icon, title, value, color, gradient }) {
  return (
    <div className="stat-card" style={{ background: gradient }}>
      <div className="stat-icon" style={{ color: color }}>{icon}</div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-value">{value}</p>
      </div>
    </div>
  );
}



function LeaderboardCard({ rank, name, points, solved, avatar }) {
  return (
    <div className="leaderboard-card">
      <div className="rank-badge">{rank}</div>
      <div className="user-info">
        <div className="avatar">{avatar}</div>
        <div className="user-details">
          <h4>{name}</h4>
          <p>{solved} problems solved</p>
        </div>
      </div>
      <div className="user-points" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div className={`live-dot ${/* always show live style for freshness */ 'live'}`}></div>
        <span>{points} pts</span>
      </div>
    </div>
  );
}

function StreakBadge({ currentStreak }) {
  const getBadge = (streak) => {
    if (streak >= 100) return { label: 'Gold Badge', color: '#FFD700' };
    if (streak >= 50) return { label: 'Silver Badge', color: '#C0C0C0' };
    if (streak >= 25) return { label: 'Bronze Badge', color: '#CD7F32' };
    return null;
  };

  const badge = getBadge(currentStreak);
  if (!badge) {
    return (
      <div className="streak-badge--empty">
        <div style={{ fontWeight: 700, color: '#fff' }}>Keep Going!</div>
        <div style={{ color: '#bbb', fontSize: '14px' }}>Solve daily to earn badges</div>
      </div>
    );
  }

  return (
    <div className="streak-badge">
      <div className={`streak-badge__star ${badge.label.includes('Gold') ? 'is-gold' : badge.label.includes('Silver') ? 'is-silver' : 'is-bronze'}`}>★</div>
      <div className="streak-badge__title">SKN CODEMATE</div>
      <div className="streak-badge__subtitle">SKN Sinhagd College of Engineering</div>
      <div className={`streak-badge__label ${badge.label.includes('Gold') ? 'is-gold' : badge.label.includes('Silver') ? 'is-silver' : 'is-bronze'}`}>{badge.label}</div>
      <div className="streak-badge__streak">Streak: {currentStreak} days</div>
    </div>
  );
}

function LiveIndicator({ isLive, lastUpdate, connectionStatus }) {
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit', 
      second: '2-digit' 
    });
  };

  return (
    <div className="live-indicator">
      <div className={`live-dot ${isLive ? 'live' : 'offline'}`}></div>
      <span className="live-text">
        {isLive ? 'LIVE' : 'OFFLINE'}
      </span>
      <span className="last-update">
        Last update: {formatTime(lastUpdate)}
      </span>
      <span className={`connection-status ${connectionStatus}`}>
        {connectionStatus === 'connected' ? '🟢' : '🔴'} {connectionStatus}
      </span>
    </div>
  );
}

// Contest Problem Card Component
function ContestProblemCard({ problem, index, onSolve, contestStatus }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return '#4CAF50';
      case 'Medium': return '#FF9800';
      case 'Hard': return '#F44336';
      case 'Expert': return '#9C27B0';
      default: return '#757575';
    }
  };

  const getQuestionTypeIcon = (questionType) => {
    return questionType === 'mcq' ? '📝' : '💻';
  };

  return (
    <div className="contest-problem-card">
      <div className="problem-header">
        <div className="problem-title-section">
          <h4 className="problem-title">Problem {index + 1}: {problem.title}</h4>
          <div className="problem-meta">
            <span
              className="difficulty-badge"
              style={{ backgroundColor: getDifficultyColor(problem.difficulty) }}
            >
              {problem.difficulty}
            </span>
            <span className="points-badge">{problem.points} points</span>
            <span className="question-type-badge">
              {getQuestionTypeIcon(problem.question_type)}
              {problem.question_type === 'mcq' ? ' MCQ' : ' Coding'}
            </span>
          </div>
        </div>
        <button
          className="solve-btn"
          onClick={() => onSolve(problem)}
          disabled={contestStatus === 'completed'}
        >
          {contestStatus === 'completed' ? '🔒 Contest Ended' : 
           problem.question_type === 'mcq' ? '📝 Solve MCQ' : '💻 Solve Coding'}
        </button>
      </div>

      <div className="problem-description">
        <p>{problem.description}</p>
      </div>

      {problem.question_type === 'coding' && (problem.testCases || problem.test_cases) && (problem.testCases || problem.test_cases).length > 0 && (
        <div className="test-cases-preview">
          <h5 className="test-cases-title">Sample Test Cases:</h5>
          <div className="test-cases-grid">
            {(problem.testCases || problem.test_cases).slice(0, 2).map((testCase, idx) => (
              <div key={idx} className="test-case-preview">
                <div className="test-input">
                  <strong className="test-label">Input:</strong> 
                  <code className="test-code">{testCase.input}</code>
                </div>
                <div className="test-output">
                  <strong className="test-label">Output:</strong> 
                  <code className="test-code">{testCase.output}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// MCQ Problem Component
function MCQProblem({ contestId, problem, onSolved, onClose }) {
  const [selectedIndex, setSelectedIndex] = React.useState(null);
  const [submitting, setSubmitting] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const options = Array.isArray(problem.mcqOptions) ? problem.mcqOptions : (problem.mcq_options ? JSON.parse(problem.mcq_options) : []);

  const handleSubmit = async () => {
    if (selectedIndex === null) {
      alert('Please select an option.');
      return;
    }
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      alert('Please log in to submit.');
      return;
    }
    setSubmitting(true);
    setMessage('Submitting...');
    try {
      const res = await fetch(`http://localhost:5000/api/contests/${contestId}/problems/${problem.id}/submit-mcq`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentEmail: userEmail, selectedIndex })
      });
      const data = await res.json();
      if (data.success) {
        setMessage(data.message || (data.correct ? 'Correct!' : 'Incorrect'));
        if (data.correct && onSolved) onSolved();
      } else {
        setMessage(data.error || 'Submission failed');
      }
    } catch (e) {
      setMessage(e.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mcq-problem">
      <div className="mcq-description">
        <h4>Description:</h4>
        <p>{problem.description}</p>
      </div>
      <div className="mcq-options">
        {options && options.length > 0 ? options.map((opt, idx) => (
          <label key={idx} className={`mcq-option${selectedIndex === idx ? ' selected' : ''}`}>
            <input
              type="radio"
              name={`mcq-${problem.id}`}
              value={idx}
              checked={selectedIndex === idx}
              onChange={() => setSelectedIndex(idx)}
            />
            <span>{opt}</span>
          </label>
        )) : (
          <div>No options provided.</div>
        )}
      </div>
      <div className="mcq-actions">
        <button className="back-button" onClick={onClose}>← Back to Contest</button>
        <button className="solve-btn" onClick={handleSubmit} disabled={submitting}>
          {submitting ? 'Submitting...' : 'Submit Answer'}
        </button>
      </div>
      {message && <div className="mcq-message">{message}</div>}
    </div>
  );
}

// Contest View Component
function ContestView({ contest, problems, onBack, onSolveProblem }) {
  const [timeLeft, setTimeLeft] = React.useState(null);
  const [contestStatus, setContestStatus] = React.useState('ongoing');

  React.useEffect(() => {
    const updateTimer = () => {
      const now = new Date();
      const endTime = new Date(contest.end_date);
      const timeDiff = endTime - now;
      
      if (timeDiff <= 0) {
        setTimeLeft('Contest Ended');
        setContestStatus('completed');
        return;
      }
      
      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
      setTimeLeft(`${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [contest.end_date]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'ongoing': return '#27ae60';
      case 'completed': return '#e74c3c';
      default: return '#3498db';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'ongoing': return '🔥 Live Contest';
      case 'completed': return '✅ Contest Ended';
      default: return '🕐 Contest';
    }
  };

  return (
    <div className="contest-view">
      <div className="contest-view-header">
        <div className="header-glow"></div>
        <button 
          onClick={onBack}
          className="back-button"
        >
          ← Back to Contests
        </button>
        <div className="contest-info">
          <div className="contest-title-section">
            <h2 className="contest-title">🏆 {contest.title}</h2>
            <div className="contest-status-banner" style={{ backgroundColor: getStatusColor(contestStatus) }}>
              {getStatusText(contestStatus)}
            </div>
          </div>
          <p className="contest-description">{contest.description}</p>
          <div className="contest-meta">
            <span className="contest-difficulty">
              <span className="meta-icon">🎯</span> <span className="meta-text">{contest.difficulty}</span>
            </span>
            <span className="contest-duration">
              <span className="meta-icon">⏱️</span> <span className="meta-text">{contest.duration} mins</span>
            </span>
            <span className="contest-problems-count">
              <span className="meta-icon">📝</span> <span className="meta-text">{problems.length} problems</span>
            </span>
            {timeLeft && (
              <span className={`contest-timer ${contestStatus === 'ongoing' ? 'timer-ongoing' : 'timer-completed'}`}>
                <span className="meta-icon">⏰</span> <span>{timeLeft} left</span>
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="problems-section">
        <div className="problems-header">
          <h3 className="problems-title">Contest Problems</h3>
          <div className="contest-stats">
            <span className="participants-count">👥 {contest.current_participants} participants</span>
            <span className="contest-progress">📊 Solve to climb the leaderboard</span>
          </div>
        </div>
        <div className="problems-grid">
          {problems.map((problem, index) => (
            <ContestProblemCard 
              key={problem.id}
              problem={problem}
              index={index}
              onSolve={onSolveProblem}
              contestStatus={contestStatus}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Helper function to generate unique 8-digit ID
const generateUniqueId = () => {
  return Math.floor(10000000 + Math.random() * 90000000).toString();
};

// Helper function to create badge in database
const createBadge = async (studentEmail, badgeType, badgeTier, badgeLabel, achievementValue, description) => {
  try {
    const response = await fetch('http://localhost:5000/api/badges/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentEmail,
        badgeType,
        badgeTier,
        badgeLabel,
        achievementValue,
        description
      })
    });
    
    const result = await response.json();
    if (result.success) {
      console.log('Badge created successfully:', result.badgeId);
      return result.badgeId;
    } else {
      console.error('Failed to create badge:', result.error);
      return null;
    }
  } catch (error) {
    console.error('Error creating badge:', error);
    return null;
  }
};

// Helper function to get problem-based badge
const getProblemBadge = (problemsSolved) => {
  // Only return badges for exact thresholds - no partial badges
  // Check for exact thresholds first (highest to lowest)
  if (problemsSolved >= 240) return { 
    label: 'Conquer Badge', 
    color: '#FF6B6B', 
    tier: 'Conquer',
    minProblems: 240,
    description: 'Ultimate Problem Solver - All 240 problems completed!'
  };
  if (problemsSolved >= 200) return { 
    label: 'Diamond Badge', 
    color: '#B9F2FF', 
    tier: 'Diamond',
    minProblems: 200,
    description: 'Problem Solving Master - 200 problems completed!'
  };
  if (problemsSolved >= 100) return { 
    label: 'Gold Badge', 
    color: '#FFD700', 
    tier: 'Gold',
    minProblems: 100,
    description: 'Problem Solving Expert - 100 problems completed!'
  };
  if (problemsSolved >= 50) return { 
    label: 'Silver Badge', 
    color: '#C0C0C0', 
    tier: 'Silver',
    minProblems: 50,
    description: 'Problem Solving Advanced - 50 problems completed!'
  };
  if (problemsSolved >= 25) return { 
    label: 'Bronze Badge', 
    color: '#CD7F32', 
    tier: 'Bronze',
    minProblems: 25,
    description: 'Problem Solving Intermediate - 25 problems completed!'
  };
  return null; // No badge until exactly 25 problems solved
};

// Helper function to generate improved SVG badge
const generateBadgeSVG = (currentStreak, currentUser, problemsSolved = 0, badgeType = 'streak', badgeId = null) => {
  const getBadge = (streak) => {
    if (streak >= 100) return { label: 'Gold Streak Badge', color: '#FFD700' };
    if (streak >= 50) return { label: 'Silver Streak Badge', color: '#C0C0C0' };
    if (streak >= 25) return { label: 'Bronze Streak Badge', color: '#CD7F32' };
    if (streak >= 1) return { label: 'Day 1 Streak', color: '#00E5FF' };
    return { label: 'Getting Started', color: '#9E9E9E' };
  };

  const badge = badgeType === 'problems' ? getProblemBadge(problemsSolved) : getBadge(currentStreak);
  const displayName = currentUser ? `${currentUser.first_name || ''} ${currentUser.middle_name || ''} ${currentUser.last_name || ''}`.replace(/\s+/g,' ').trim() : 'Student';
  const uniqueId = badgeId || generateUniqueId();
  const width = 800; 
  const height = 420;

  return `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<div style="width: 100vw; height: 100vh; background: #000; display: flex; justify-content: center; align-items: center; margin: 0; padding: 0;">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" 
     style="background: #000; display: block; max-width: 100vw; max-height: 100vh; object-fit: contain;">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0f2027;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#203a43;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#2c5364;stop-opacity:1" />
    </linearGradient>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="6" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <style type="text/css">
      <![CDATA[
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          height: 100%;
          background: #000;
          display: flex;
          justify-content: center;
          align-items: center;
          overflow: hidden;
        }
        .badge-container {
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          background: #000;
        }
        .badge-content {
          text-align: center;
          padding: 40px;
        }
      ]]>
    </style>
  </defs>
  
  <!-- Background -->
  <rect x="0" y="0" width="${width}" height="${height}" rx="24" fill="url(#bgGrad)"/>
  
  <!-- Badge Content Container -->
  <g class="badge-container">
    <g class="badge-content" filter="url(#glow)">
      <!-- Title -->
      <text x="${width/2}" y="110" text-anchor="middle" 
            font-family="Inter, Segoe UI, Arial, sans-serif" 
            font-size="42" font-weight="900" fill="#FFFFFF">SKN CODEMATE</text>
      
      <!-- Subtitle -->
      <text x="${width/2}" y="155" text-anchor="middle" 
            font-family="Inter, Segoe UI, Arial, sans-serif" 
            font-size="20" fill="#E0E0E0">SKN Sinhagd College of Engineering</text>
      
      <!-- Student Name -->
      <text x="${width/2}" y="185" text-anchor="middle" 
            font-family="Inter, Segoe UI, Arial, sans-serif" 
            font-size="18" fill="#FFFFFF">${displayName}</text>
      
      <!-- Star -->
      <text x="${width/2}" y="260" text-anchor="middle" 
            font-family="Segoe UI Emoji, Apple Color Emoji, Noto Color Emoji, sans-serif" 
            font-size="96" fill="${badge.color}">★</text>
      
      <!-- Badge Label -->
      <text x="${width/2}" y="320" text-anchor="middle" 
            font-family="Inter, Segoe UI, Arial, sans-serif" 
            font-size="28" font-weight="800" fill="${badge.color}">${badge.label}</text>
      
      <!-- Problem/Streak Info -->
      ${badgeType === 'problems' ? 
        `<text x="${width/2}" y="350" text-anchor="middle" 
               font-family="Inter, Segoe UI, Arial, sans-serif" 
               font-size="20" fill="#FFFFFF">Problems Solved: ${problemsSolved}</text>
         <text x="${width/2}" y="375" text-anchor="middle" 
               font-family="Inter, Segoe UI, Arial, sans-serif" 
               font-size="18" fill="#CCCCCC">${badge.description}</text>
         <text x="${width/2}" y="400" text-anchor="middle" 
               font-family="Inter, Segoe UI, Arial, sans-serif" 
               font-size="14" fill="#999999">Certificate ID: ${uniqueId}</text>` :
        `<text x="${width/2}" y="365" text-anchor="middle" 
               font-family="Inter, Segoe UI, Arial, sans-serif" 
               font-size="22" fill="#FFFFFF">Streak: ${currentStreak} day${currentStreak===1?'':'s'}</text>
         <text x="${width/2}" y="390" text-anchor="middle" 
               font-family="Inter, Segoe UI, Arial, sans-serif" 
               font-size="14" fill="#999999">Certificate ID: ${uniqueId}</text>`
      }
    </g>
  </g>
</svg>
</div>`;
};

function BadgePreviewModal({ isOpen, onClose, currentStreak, currentUser, problemsSolved = 0, badgeType = 'streak' }) {
  if (!isOpen) return null;

  const getBadge = (streak) => {
    if (streak >= 100) return { label: 'Gold Streak Badge', color: '#FFD700' };
    if (streak >= 50) return { label: 'Silver Streak Badge', color: '#C0C0C0' };
    if (streak >= 25) return { label: 'Bronze Streak Badge', color: '#CD7F32' };
    if (streak >= 1) return { label: 'Day 1 Streak', color: '#00E5FF' };
    return { label: 'Getting Started', color: '#9E9E9E' };
  };

  const badge = badgeType === 'problems' ? getProblemBadge(problemsSolved) : getBadge(currentStreak);
  const displayName = currentUser ? `${currentUser.first_name || ''} ${currentUser.middle_name || ''} ${currentUser.last_name || ''}`.replace(/\s+/g,' ').trim() : 'Student';

  const downloadBadge = () => {
    const svg = generateBadgeSVG(currentStreak, currentUser, problemsSolved, badgeType);
    const blob = new Blob([svg], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = badgeType === 'problems' ? `problem_badge_${problemsSolved}.svg` : `streak_badge_${currentStreak}.svg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="badge-modal-overlay" onClick={onClose}>
      <div className="badge-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="badge-modal-header">
          <h2>{badgeType === 'problems' ? 'Problem Solving Achievement Badge' : 'Streak Achievement Badge'}</h2>
          <button className="badge-modal-close" onClick={onClose}>×</button>
        </div>
        
        <div className="badge-modal-body">
          <div className="badge-preview-container">
            <div className="badge-preview">
              <div className="badge-preview-star" style={{ color: badge.color }}>★</div>
              <div className="badge-preview-title">SKN CODEMATE</div>
              <div className="badge-preview-subtitle">SKN Sinhagd College of Engineering</div>
              <div className="badge-preview-name">{displayName}</div>
              <div className="badge-preview-label" style={{ color: badge.color }}>{badge.label}</div>
              {badgeType === 'problems' ? (
                <>
                  <div className="badge-preview-streak">Problems Solved: {problemsSolved}</div>
                  <div className="badge-preview-description">{badge.description}</div>
                </>
              ) : (
                <div className="badge-preview-streak">Streak: {currentStreak} day{currentStreak === 1 ? '' : 's'}</div>
              )}
            </div>
          </div>
          
          <div className="badge-modal-actions">
            <button className="badge-download-btn-modal" onClick={downloadBadge}>
              ⬇️ Download Badge
            </button>
            <button className="badge-close-btn-modal" onClick={onClose}>
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [isCodeEditorOpen, setIsCodeEditorOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userStats, setUserStats] = useState({
    totalSolved: 0,
    totalPoints: 0,
    currentStreak: 0,
    rank: 0,
    accuracy: 0
  });

  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState('');

  const [students, setStudents] = useState([]);
  const [contests, setContests] = useState([]);
  
  // Contest state
  const [currentContest, setCurrentContest] = useState(null);
  const [contestProblems, setContestProblems] = useState([]);
  const [showContestView, setShowContestView] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [showProblemEditor, setShowProblemEditor] = useState(false);
  const [currentProblemIndex, setCurrentProblemIndex] = useState(0);
  const [solvedProblems, setSolvedProblems] = useState(new Set());
  const [showContestComplete, setShowContestComplete] = useState(false);
  const [showContestPopup, setShowContestPopup] = useState(false);
  const [popupContest, setPopupContest] = useState(null);
  const [contestFullscreen, setContestFullscreen] = useState(false);
  const [participatedContests, setParticipatedContests] = useState(() => {
    // Load participated contests from localStorage on component mount
    const saved = localStorage.getItem('participatedContests');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });
  
  // Live data indicators
  const [isLive, setIsLive] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [connectionStatus, setConnectionStatus] = useState('connected');
  
  // Badge modal state
  const [showBadgeModal, setShowBadgeModal] = useState(false);
  const [badgeModalType, setBadgeModalType] = useState('streak');

  // Handle tab changes with proper history management
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    // Push new state to browser history
    window.history.pushState({ tab: tabName }, '', window.location.pathname);
  };

  // Recover active contest on reload
  useEffect(() => {
    const activeContestId = localStorage.getItem('activeContestId');
    const userEmail = localStorage.getItem('userEmail');
    if (activeContestId && userEmail) {
      fetch(`http://localhost:5000/api/contests/${activeContestId}?studentEmail=${encodeURIComponent(userEmail)}`)
        .then(res => res.json())
        .then(data => {
          if (data.contest && data.problems) {
            setCurrentContest(data.contest);
            setContestProblems(data.problems);
            setShowContestView(true);
            setContestFullscreen(true);
            setActiveTab('contests');
          }
        })
        .catch(err => console.error('Error recovering contest:', err));
    }
  }, []);

  // Contest progression handlers
  const handleNextProblem = (nextIndex) => {
    if (nextIndex < contestProblems.length) {
      setCurrentProblemIndex(nextIndex);
      setSelectedProblem(contestProblems[nextIndex]);
      setShowProblemEditor(true);
      setShowContestView(false);
    }
  };

  const handleContestComplete = () => {
    setShowContestComplete(true);
    setShowProblemEditor(false);
    setContestFullscreen(false); // Exit fullscreen mode
  };

  const handleExitContest = () => {
    localStorage.removeItem('activeContestId');
    setShowContestView(false);
    setCurrentContest(null);
    setContestProblems([]);
    setSolvedProblems(new Set());
    setCurrentProblemIndex(0);
    setContestFullscreen(false); // Exit fullscreen mode
    setActiveTab('contests'); // Return to contests
  };

  // Request fullscreen immediately when user clicks Solve (counts as a user gesture)
  const enterContestFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen({ navigationUI: 'hide' });
      }
    } catch (_) {
      // ignore rejection; user can still proceed
    }
  };

  const handleSubmitContest = async () => {
    if (!currentContest) return;
    
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) {
        alert('Please log in to submit contest.');
        return;
      }

      // Submit contest completion
      const response = await fetch(`http://localhost:5000/api/contests/${currentContest.id}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          studentEmail: userEmail,
          completedProblems: Array.from(solvedProblems)
        }),
      });

      const result = await response.json();
      
      if (result.success) {
        alert('🎉 Contest submitted successfully!');
        localStorage.removeItem('activeContestId');
        // Exit fullscreen and reset contest state – no return to contest
        setContestFullscreen(false);
        setShowContestComplete(false);
        setShowContestView(false);
        setShowProblemEditor(false);
        setCurrentContest(null);
        setContestProblems([]);
        setSelectedProblem(null);
        setCurrentProblemIndex(0);
        setSolvedProblems(new Set());
        try {
          if (document.fullscreenElement) document.exitFullscreen();
        } catch (_) {}
      } else {
        alert(`Failed to submit contest: ${result.error || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Error submitting contest:', error);
      alert('Error submitting contest. Please try again.');
    }
  };
  // Helper: read local progress from Problems page
  const getLocalProgress = () => {
    try {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return { solved: 0, points: 0 };
      const raw = localStorage.getItem(`progress:${userEmail}`);
      if (!raw) return { solved: 0, points: 0 };
      const parsed = JSON.parse(raw);
      const solved = Array.isArray(parsed?.solvedIds) ? parsed.solvedIds.length : 0;
      const points = typeof parsed?.totalPoints === 'number' ? parsed.totalPoints : 0;
      return { solved, points };
    } catch (_) {
      return { solved: 0, points: 0 };
    }
  };

  // Live rank computed from current leaderboard list
  const myRank = useMemo(() => {
    if (!currentUser || !currentUser.email) return userStats.rank || 999;
    const idx = leaderboard.findIndex((row) => row.email === currentUser.email);
    return idx >= 0 ? idx + 1 : (userStats.rank || 999);
  }, [leaderboard, currentUser, userStats.rank]);

  useEffect(() => {
    // Initialize session management
    const cleanupSession = initializeSession();

    // Handle back navigation within dashboard
    const handlePopState = () => {
      if (!validateSession('student')) {
        logout();
        return;
      }
      
      // If user is on a sub-tab (not overview), go back to overview
      if (activeTab !== 'overview') {
        setActiveTab('overview');
        // Push a new state to prevent going back to login
        window.history.pushState({ tab: 'overview' }, '', window.location.pathname);
      }
    };
    
    window.addEventListener('popstate', handlePopState);
    
    // Push initial state to establish history
    window.history.pushState({ tab: activeTab }, '', window.location.pathname);

    // Fetch current user data
    const userEmail = localStorage.getItem('userEmail');
    const isLoggedIn = localStorage.getItem('studentLoggedIn');
    
    if (userEmail && isLoggedIn === 'true') {
      // No-op here; we will read local progress fresh on every stats refresh
      // Fetch user profile data
      fetch(`http://localhost:5000/api/student/${encodeURIComponent(userEmail)}`)
        .then(res => res.json())
        .then(data => {
          if (data.student) {
            setCurrentUser(data.student);
          } else {
            // If user not found, redirect to login
            console.log('User not found in database, redirecting to login');
            localStorage.removeItem('studentLoggedIn');
            localStorage.removeItem('userEmail');
            window.location.href = '/login';
          }
        })
        .catch((error) => {
          // If error occurs, redirect to login
          console.log('Error fetching user data, redirecting to login');
          localStorage.removeItem('studentLoggedIn');
          localStorage.removeItem('userEmail');
          window.location.href = '/login';
        });

      // Fetch user stats/progress data
      fetch(`http://localhost:5000/api/student/${encodeURIComponent(userEmail)}/stats`)
        .then(res => res.json())
        .then(data => {
          if (data.stats) {
            const lp = getLocalProgress();
            const merged = {
              ...data.stats,
              totalSolved: Math.max(data.stats.totalSolved || 0, lp.solved || 0),
              totalPoints: Math.max(data.stats.totalPoints || 0, lp.points || 0)
            };
            setUserStats(merged);
          }
        })
        .catch((error) => {
          console.log('Error fetching user stats:', error);
          // Keep default stats if fetch fails
        });
    } else {
      // Redirect to login if not logged in
      if (!userEmail || isLoggedIn !== 'true') {
        window.location.href = '/login';
      }
    }

    // Fetch all students
    fetch('http://localhost:5000/api/students')
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(() => setStudents([]));

    // Cleanup session management and event listeners on unmount
    return () => {
      cleanupSession();
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Poll user stats for real-time streak updates
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    let abort = false;
    const fetchStats = () => {
      fetch(`http://localhost:5000/api/student/${encodeURIComponent(userEmail)}/stats`)
        .then(res => {
          if (abort) return;
          setConnectionStatus('connected');
          setIsLive(true);
          setLastUpdate(new Date());
          return res.json();
        })
        .then(data => {
          if (abort) return;
          if (data && data.stats) {
            const lp = getLocalProgress();
            const merged = {
              ...data.stats,
              totalSolved: Math.max(data.stats.totalSolved || 0, lp.solved || 0),
              totalPoints: Math.max(data.stats.totalPoints || 0, lp.points || 0)
            };
            setUserStats(merged);
          }
        })
        .catch(() => {
          if (abort) return;
          setConnectionStatus('disconnected');
          setIsLive(false);
        });
    };

    fetchStats();
    const interval = setInterval(fetchStats, 10000); // 10s for more frequent updates
    return () => { abort = true; clearInterval(interval); };
  }, []);

  // Fetch leaderboard initially and set up polling for real-time updates
  useEffect(() => {
    let abort = false;
    const fetchLeaderboard = () => {
      setLeaderboardLoading(true);
      setLeaderboardError('');
      fetch('http://localhost:5000/api/leaderboard?limit=50')
        .then(res => {
          if (abort) return;
          setConnectionStatus('connected');
          setIsLive(true);
          setLastUpdate(new Date());
          return res.json();
        })
        .then(data => {
          if (abort) return;
          if (Array.isArray(data)) {
            // Attach simple avatars for UI continuity
            const withAvatars = data.map((row) => ({
              ...row,
              avatar: '👨‍💻'
            }));
            setLeaderboard(withAvatars);
          } else {
            setLeaderboard([]);
            setLeaderboardError('Invalid leaderboard data');
          }
        })
        .catch(err => {
          if (abort) return;
          setLeaderboardError('Failed to load leaderboard');
          setLeaderboard([]);
          setConnectionStatus('disconnected');
          setIsLive(false);
        })
        .finally(() => {
          if (!abort) setLeaderboardLoading(false);
        });
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000); // 10s for more frequent updates
    return () => {
      abort = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    // Fetch contests for the user's department from database
    if (currentUser && currentUser.branch) {
      fetch(`http://localhost:5000/api/contests/department/${currentUser.branch}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setContests(data);
            
            // Check for live or upcoming contests to show popup
            const now = new Date();
            const liveContests = data.filter(contest => {
              const startDate = new Date(contest.start_date);
              const endDate = new Date(contest.end_date);
              return now >= startDate && now <= endDate; // Live contests
            });
            
            const upcomingContests = data.filter(contest => {
              const startDate = new Date(contest.start_date);
              const hoursUntilStart = (startDate - now) / (1000 * 60 * 60);
              return now < startDate && hoursUntilStart <= 24; // Upcoming within 24 hours
            });
            
            // Show popup for live contests first, then upcoming
            // But only if student hasn't participated in this contest yet
            const contestToShow = liveContests[0] || upcomingContests[0];
            if (contestToShow && !showContestPopup && !participatedContests.has(contestToShow.id)) {
              setPopupContest(contestToShow);
              setShowContestPopup(true);
            }
          } else {
            console.error('Invalid contests data:', data);
            setContests([]);
          }
        })
        .catch(error => {
          console.error('Error fetching contests:', error);
          setContests([]);
        });
    }
  }, [currentUser]);

  // Save participated contests to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('participatedContests', JSON.stringify([...participatedContests]));
  }, [participatedContests]);

  // Create badges when milestones are reached
  useEffect(() => {
    if (!currentUser || !userStats.totalSolved) return;

    const checkAndCreateBadges = async () => {
      const problemsSolved = userStats.totalSolved;
      const currentStreak = userStats.currentStreak;
      const studentEmail = currentUser.email;

      // Check for problem-solving badges
      const problemBadge = getProblemBadge(problemsSolved);
      if (problemBadge) {
        // Check if badge already exists for this achievement level
        const existingBadges = JSON.parse(localStorage.getItem('createdBadges') || '[]');
        const badgeKey = `problems_${problemBadge.tier}_${problemsSolved}`;
        
        if (!existingBadges.includes(badgeKey)) {
          const badgeId = await createBadge(
            studentEmail,
            'problems',
            problemBadge.tier,
            problemBadge.label,
            problemsSolved,
            problemBadge.description
          );
          
          if (badgeId) {
            // Mark this badge as created
            const updatedBadges = [...existingBadges, badgeKey];
            localStorage.setItem('createdBadges', JSON.stringify(updatedBadges));
            console.log(`🎉 Problem Badge Created: ${problemBadge.label} (ID: ${badgeId})`);
          }
        }
      }

      // Check for streak badges
      if (currentStreak >= 25) {
        const streakBadge = currentStreak >= 100 ? 
          { tier: 'Gold', label: 'Gold Streak Badge', description: '100+ day coding streak!' } :
          currentStreak >= 50 ? 
          { tier: 'Silver', label: 'Silver Streak Badge', description: '50+ day coding streak!' } :
          { tier: 'Bronze', label: 'Bronze Streak Badge', description: '25+ day coding streak!' };

        const existingBadges = JSON.parse(localStorage.getItem('createdBadges') || '[]');
        const badgeKey = `streak_${streakBadge.tier}_${currentStreak}`;
        
        if (!existingBadges.includes(badgeKey)) {
          const badgeId = await createBadge(
            studentEmail,
            'streak',
            streakBadge.tier,
            streakBadge.label,
            currentStreak,
            streakBadge.description
          );
          
          if (badgeId) {
            const updatedBadges = [...existingBadges, badgeKey];
            localStorage.setItem('createdBadges', JSON.stringify(updatedBadges));
            console.log(`🔥 Streak Badge Created: ${streakBadge.label} (ID: ${badgeId})`);
          }
        }
      }
    };

    checkAndCreateBadges();
  }, [userStats.totalSolved, userStats.currentStreak, currentUser]);

  // Real-time contest list: poll every 5s when on Contests tab so Start, Duration, Participants stay current
  useEffect(() => {
    if (!currentUser?.branch || activeTab !== 'contests') return;

    const refresh = () => {
      fetch(`http://localhost:5000/api/contests/department/${currentUser.branch}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setContests(data);
        })
        .catch(() => {});
    };
    refresh();
    const interval = setInterval(refresh, 5000);
    return () => clearInterval(interval);
  }, [currentUser, activeTab]);

  // Immediately refresh stats when other tabs/pages signal an update
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === 'statsUpdated') {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) return;
        fetch(`http://localhost:5000/api/student/${encodeURIComponent(userEmail)}/stats`)
          .then(res => res.json())
          .then(data => { if (data.stats) setUserStats(data.stats); })
          .catch(() => {});
      }
    };
    const handleStatsEvent = () => {
      const userEmail = localStorage.getItem('userEmail');
      if (!userEmail) return;
      // refetch stats and leaderboard immediately
      fetch(`http://localhost:5000/api/student/${encodeURIComponent(userEmail)}/stats`)
        .then(res => res.json())
        .then(data => {
          if (data.stats) {
            const lp = getLocalProgress();
            const merged = {
              ...data.stats,
              totalSolved: Math.max(data.stats.totalSolved || 0, lp.solved || 0),
              totalPoints: Math.max(data.stats.totalPoints || 0, lp.points || 0)
            };
            setUserStats(merged);
          }
        })
        .catch(() => {});
      fetch('http://localhost:5000/api/leaderboard?limit=50')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const withAvatars = data.map((row) => ({ ...row, avatar: '👨‍💻' }));
            setLeaderboard(withAvatars);
          }
        })
        .catch(() => {});
      setIsLive(true);
      setConnectionStatus('connected');
      setLastUpdate(new Date());
    };
    const handleVisibility = () => {
      if (!document.hidden) {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) return;
        fetch(`http://localhost:5000/api/student/${encodeURIComponent(userEmail)}/stats`)
          .then(res => res.json())
          .then(data => {
            if (data.stats) {
              const lp = getLocalProgress();
              const merged = {
                ...data.stats,
                totalSolved: Math.max(data.stats.totalSolved || 0, lp.solved || 0),
                totalPoints: Math.max(data.stats.totalPoints || 0, lp.points || 0)
              };
              setUserStats(merged);
            }
          })
          .catch(() => {});
      }
    };
    window.addEventListener('storage', handleStorage);
    window.addEventListener('statsUpdated', handleStatsEvent);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('statsUpdated', handleStatsEvent);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, []);

  return (
    <div className="student-dashboard-bg">
      <StarBackground />
      {!(contestFullscreen || isCodeEditorOpen) && (
        <Header isLive={isLive} lastUpdate={lastUpdate} connectionStatus={connectionStatus} />
      )}
      
      <div className="dashboard-container">
        {!contestFullscreen && !isCodeEditorOpen && (
          <div className="sidebar">
          <div className="user-profile">
            <div className="profile-avatar">👨‍🎓</div>
            <h3>Welcome back!</h3>
            <p className="user-name">
              {currentUser ? `${currentUser.first_name} ${currentUser.middle_name} ${currentUser.last_name}` : 'Loading...'}
            </p>
            <p className="user-email">
              {currentUser ? currentUser.email : 'Loading...'}
            </p>
                         {currentUser && (
               <div className="user-details">
                 <p className="user-class">Class: {currentUser.class}</p>
                 <p className="user-branch">Branch: {currentUser.branch}</p>
               </div>
             )}

          </div>
          
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => handleTabChange('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={`nav-item ${activeTab === 'problems' ? 'active' : ''}`}
              onClick={() => handleTabChange('problems')}
            >
              💻 Problems
            </button>
            <button 
              className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => handleTabChange('leaderboard')}
            >
              🏆 Leaderboard
            </button>
            <button 
              className={`nav-item ${activeTab === 'progress' ? 'active' : ''}`}
              onClick={() => handleTabChange('progress')}
            >
              📈 Progress
            </button>
            <button 
              className={`nav-item ${activeTab === 'contests' ? 'active' : ''}`}
              onClick={() => handleTabChange('contests')}
            >
              🏆 Contests
            </button>
          </nav>
        </div>
        )}

        <div className={`main-content ${contestFullscreen ? 'contest-fullscreen' : ''} ${isCodeEditorOpen ? 'editor-fullwidth' : ''}`}>
          
          {activeTab === 'overview' && (
            <div className="overview-section">
              <div className="overview-header">
                <h2 className="section-title">Dashboard Overview</h2>
                <div className="live-status-banner">
                  <div className={`live-pulse ${isLive ? 'active' : ''}`}></div>
                  <span className="live-status-text">
                    {isLive ? '🟢 Live Data' : '🔴 Offline Mode'}
                  </span>
                  <span className="update-frequency">Updates every 10s</span>
                </div>
              </div>
              
              <div className="stats-grid">
                <StatCard 
                  icon="🎯"
                  title="Problems Solved"
                  value={userStats.totalSolved}
                  color="#4CAF50"
                  gradient="linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
                />
                <StatCard 
                  icon="⭐"
                  title="Total Points"
                  value={userStats.totalPoints}
                  color="#FF9800"
                  gradient="linear-gradient(135deg, #FF9800 0%, #F57C00 100%)"
                />
                <StatCard 
                  icon="🔥"
                  title="Current Streak"
                  value={`${userStats.currentStreak} days`}
                  color="#F44336"
                  gradient="linear-gradient(135deg, #F44336 0%, #D32F2F 100%)"
                />
                <StatCard 
                  icon="🏆"
                  title="College Rank"
                  value={`#${myRank}`}
                  color="#9C27B0"
                  gradient="linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)"
                />
              </div>
              <div style={{ marginTop: '20px' }}>
                <div className="streak-badge-wrap" id="streak-badge-wrap">
                  <StreakBadge currentStreak={userStats.currentStreak} />
                </div>
                <div className="badge-actions">
                  <button
                    className="badge-download-btn"
                    onClick={() => {
                      setBadgeModalType('streak');
                      setShowBadgeModal(true);
                    }}
                  >
                    🔥 Streak Badge
                  </button>
                  {/* Problem Badge - Simple progress message */}
                  <div className="badge-progress-simple">
                    <div className="badge-progress-content">
                      {(() => {
                        const problemsSolved = userStats.totalSolved;
                        let nextBadge = null;
                        let problemsNeeded = 0;
                        
                        if (problemsSolved < 25) {
                          nextBadge = 'Bronze Badge';
                          problemsNeeded = 25 - problemsSolved;
                        } else if (problemsSolved < 50) {
                          nextBadge = 'Silver Badge';
                          problemsNeeded = 50 - problemsSolved;
                        } else if (problemsSolved < 100) {
                          nextBadge = 'Gold Badge';
                          problemsNeeded = 100 - problemsSolved;
                        } else if (problemsSolved < 200) {
                          nextBadge = 'Diamond Badge';
                          problemsNeeded = 200 - problemsSolved;
                        } else if (problemsSolved < 240) {
                          nextBadge = 'Conquer Badge';
                          problemsNeeded = 240 - problemsSolved;
                        } else {
                          return (
                            <div className="badge-complete">
                              <span className="badge-icon">🏆</span>
                              <span className="badge-text">You've completed all badges! Amazing work!</span>
                            </div>
                          );
                        }
                        
                        return (
                          <div className="badge-next">
                            <span className="badge-icon">🎯</span>
                            <span className="badge-text">You have <strong>{problemsNeeded}</strong> problems to get your next <strong>{nextBadge}</strong></span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'problems' && (
            <CodingChallenges
              onEditorModeChange={setIsCodeEditorOpen}
            />
          )}

          {activeTab === 'leaderboard' && (
            <div className="leaderboard-section">
              <div className="leaderboard-header">
                <h2 className="section-title">Global Leaderboard</h2>
                <div className="leaderboard-live-indicator">
                  <div className={`live-dot ${isLive ? 'live' : 'offline'}`}></div>
                  <span className="live-text">
                    {leaderboardLoading ? 'Updating...' : isLive ? 'Live Rankings' : 'Offline'}
                  </span>
                  <span className="last-update">
                    {!leaderboardLoading && `Updated ${lastUpdate.toLocaleTimeString()}`}
                  </span>
                </div>
              </div>
              
              {leaderboardLoading && (
                <div className="leaderboard-loading">
                  <div className="loading-spinner"></div>
                  Loading live leaderboard…
                </div>
              )}

              {!leaderboardLoading && leaderboardError && (
                <div className="leaderboard-error">{leaderboardError}</div>
              )}

              {!leaderboardLoading && !leaderboardError && (
                <div className="leaderboard-container">
                  {leaderboard.length === 0 ? (
                    <div className="leaderboard-empty">No leaderboard data available yet.</div>
                  ) : (
                    leaderboard.map((user, index) => (
                      <LeaderboardCard key={index} {...user} />
                    ))
                  )}
                </div>
              )}

              <div className="your-position">
                <h3>Your Position</h3>
                <div className="position-card">
                  <div className="rank-badge">#{myRank}</div>
                  <div className="user-info">
                    <div className="avatar">👨‍🎓</div>
                    <div className="user-details">
                      <h4>
                        {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Loading...'}
                      </h4>
                      <p>{userStats.totalSolved} problems solved</p>
                    </div>
                  </div>
                  <div className="user-points" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div className={`live-dot ${isLive ? 'live' : 'offline'}`}></div>
                    <span>{userStats.totalPoints} pts</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="progress-section">
              <div className="overview-header">
                <h2 className="section-title">Your Progress</h2>
                <div className="live-status-banner">
                  <div className={`live-pulse ${isLive ? 'active' : ''}`}></div>
                  <span className="live-status-text">
                    {isLive ? '🟢 Live Points' : '🔴 Offline'}
                  </span>
                  <span className="update-frequency">{`Points: ${userStats.totalPoints}`} • Updates every 10s</span>
                </div>
              </div>
              
              <div className="progress-cards">
                <div className="progress-card">
                  <h3>Streak Counter</h3>
                  <div className="streak-display">
                    <span className="streak-number">{userStats.currentStreak}</span>
                    <span className="streak-label">days</span>
                  </div>
                  <p>Keep the momentum going!</p>
                </div>

                <div className="progress-card">
                  <h3>Live Points</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className={`live-dot ${isLive ? 'live' : 'offline'}`}></div>
                    <div className="stat-value">{userStats.totalPoints} pts</div>
                  </div>
                  <p style={{ color: '#bbb', marginTop: '8px' }}>Auto-refreshed every 10s</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'contests' && (
            <div className="contests-section">
              {showContestView ? (
                <ContestView 
                  contest={currentContest}
                  problems={contestProblems}
              onBack={handleExitContest}
                  onSolveProblem={(problem) => {
                    console.log('Solving problem:', problem.title);
                    // Enter fullscreen right on click
                    enterContestFullscreen();
                    setSelectedProblem(problem);
                    setShowProblemEditor(true);
                    setShowContestView(false);
                  }}
                />
              ) : showProblemEditor && selectedProblem ? (
                <div className="contest-problem-editor">
                  <div className="problem-editor-header">
                    <button 
                      onClick={() => {
                        setShowProblemEditor(false);
                        setSelectedProblem(null);
                      }}
                      className="back-button"
                    >
                      ← Back to Contest
                    </button>
                    <h2 className="section-title">{selectedProblem.question_type === 'mcq' ? '📝 ' : '💻 '}{selectedProblem.title}</h2>
                    <p className="challenges-subtitle">
                      {selectedProblem.difficulty} • {selectedProblem.points} points • Contest Problem
                      {contestProblems.length > 0 && (
                        <span className="contest-progress">
                          • Problem {currentProblemIndex + 1} of {contestProblems.length}
                        </span>
                      )}
                    </p>
                  </div>

                  {selectedProblem.question_type === 'mcq' ? (
                    <MCQProblem
                      contestId={currentContest.id}
                      problem={selectedProblem}
                      onSolved={() => {
                        const userEmail = localStorage.getItem('userEmail');
                        if (userEmail) {
                          fetch(`http://localhost:5000/api/student/${encodeURIComponent(userEmail)}/stats`)
                            .then(res => res.json())
                            .then(data => { if (data.stats) setUserStats(data.stats); })
                            .catch(() => {});
                        }
                      }}
                      onClose={() => {
                        setShowProblemEditor(false);
                        setSelectedProblem(null);
                      }}
                    />
                  ) : (
                    <CodeEditor
                      problem={{
                        id: selectedProblem.id,
                        title: selectedProblem.title,
                        description: selectedProblem.description,
                        difficulty: selectedProblem.difficulty,
                        points: selectedProblem.points,
                        testCases: selectedProblem.testCases || selectedProblem.test_cases || []
                      }}
                      contestId={currentContest.id}
                      allProblems={contestProblems}
                      currentProblemIndex={contestProblems.findIndex((p) => p.id === selectedProblem.id)}
                      onNextProblem={(nextIndex) => {
                        if (nextIndex >= 0 && nextIndex < contestProblems.length) {
                          setCurrentProblemIndex(nextIndex);
                          setSelectedProblem(contestProblems[nextIndex]);
                          setShowProblemEditor(true);
                          setShowContestView(false);
                        }
                      }}
                      onContestComplete={handleContestComplete}
                      onSubmission={(result) => {
                        const allPassed = (result && (result.allTestsPassed ?? (result.result && result.result.allTestsPassed))) || false;
                        if (allPassed) {
                          setSolvedProblems((prev) => new Set([...prev, selectedProblem.id]));
                          const userEmail = localStorage.getItem('userEmail');
                          if (userEmail) {
                            fetch(`http://localhost:5000/api/student/${encodeURIComponent(userEmail)}/stats`)
                              .then((res) => res.json())
                              .then((data) => {
                                if (data.stats) {
                                  const lp = getLocalProgress();
                                  const merged = {
                                    ...data.stats,
                                    totalSolved: Math.max(data.stats.totalSolved || 0, lp.solved || 0),
                                    totalPoints: Math.max(data.stats.totalPoints || 0, lp.points || 0)
                                  };
                                  setUserStats(merged);
                                }
                              })
                              .catch(() => {});
                          }
                        }
                      }}
                      onClose={() => {
                        setShowProblemEditor(false);
                        setSelectedProblem(null);
                        setShowContestView(true);
                      }}
                    />
                  )}
                  
                  {/* Contest Completion Modal */}
                  {showContestComplete && (
                    <div className="contest-completion-modal">
                      <div className="contest-completion-content">
                        <div className="completion-header">
                          <h2>🎉 Contest Completed!</h2>
                          <p>You have solved all problems in this contest.</p>
                        </div>
                        <div className="completion-stats">
                          <div className="stat-item">
                            <span className="stat-label">Problems Solved:</span>
                            <span className="stat-value">{solvedProblems.size} / {contestProblems.length}</span>
                          </div>
                          <div className="stat-item">
                            <span className="stat-label">Contest:</span>
                            <span className="stat-value">{currentContest?.title}</span>
                          </div>
                        </div>
                        <div className="completion-actions">
                          <button 
                            className="submit-contest-btn"
                            onClick={handleSubmitContest}
                          >
                            🏆 Submit Contest
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <div className="contests-header">
                    <h2 className="section-title">Department Contests</h2>
                    <button 
                      className="refresh-btn"
                      onClick={() => {
                        if (currentUser && currentUser.branch) {
                          fetch(`http://localhost:5000/api/contests/department/${currentUser.branch}`)
                            .then(res => res.json())
                            .then(data => {
                              if (Array.isArray(data)) {
                                setContests(data);
                              }
                            })
                            .catch(error => {
                              console.error('Error refreshing contests:', error);
                            });
                        }
                      }}
                    >
                      🔄 Refresh
                    </button>
                  </div>
                  
                  {contests.length === 0 ? (
                    <div className="no-contests">
                      <div className="no-contests-icon">🏆</div>
                      <h3>No contests available</h3>
                      <p>There are currently no contests available for your department.</p>
                    </div>
                  ) : (
                    <div className="contests-grid">
                      {contests.map((contest) => (
                        <ContestCard 
                          key={contest.id} 
                          contest={contest}
                          onJoin={async (contestId) => {
                            const userEmail = localStorage.getItem('userEmail');
                            if (!userEmail) {
                              alert('Please log in to join contests.');
                              return;
                            }
                            
                            try {
                              // First join the contest
                              const joinResponse = await fetch(`http://localhost:5000/api/contests/${contestId}/join`, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({ studentEmail: userEmail }),
                              });
                              
                              let joinData;
                              try {
                                joinData = await joinResponse.json();
                              } catch (e) {
                                console.error('Error parsing join response:', e);
                                joinData = { error: 'Failed to parse response' };
                              }
                              
                              // Check if user is already participating (400 status) or successfully joined
                              if (joinResponse.ok || (joinResponse.status === 400 && (joinData.message || (joinData.error && joinData.error.includes('Already participating'))))) {
                                // Add contest to participated contests
                                setParticipatedContests(prev => new Set([...prev, contestId]));
                                
                                // Start attempt right after joining/participating
                                const startRes = await fetch(`http://localhost:5000/api/contests/${contestId}/start`, {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ studentEmail: userEmail })
                                });
                                const startJson = await startRes.json();
                                if (!startRes.ok) {
                                  alert(startJson.error || 'Unable to start contest attempt.');
                                  return;
                                }
                                // Load contest with enforcement
                                const contestResponse = await fetch(`http://localhost:5000/api/contests/${contestId}?studentEmail=${encodeURIComponent(userEmail)}`);
                                const contestData = await contestResponse.json();
                                if (contestResponse.ok && contestData.contest && contestData.problems) {
                                  console.log('Contest loaded successfully:', contestData.contest.title);
                                  setCurrentContest(contestData.contest);
                                  setContestProblems(contestData.problems);
                                  setShowContestView(true);
                                  setContestFullscreen(true); // Enable fullscreen contest mode
                                  setActiveTab('contests');
                                  localStorage.setItem('activeContestId', contestId);
                                } else {
                                  alert(contestData.error || 'Error loading contest details.');
                                }
                              } else {
                                alert('Error joining contest: ' + (joinData.error || 'Unknown error'));
                              }
                            } catch (error) {
                              console.error('Error joining contest:', error);
                              alert('Error joining contest. Please try again.');
                            }
                          }}
                          onView={async (contestId) => {
                            const userEmail = localStorage.getItem('userEmail');
                            if (!userEmail) {
                              alert('Please log in to join contests.');
                              return;
                            }
                            try {
                              // Ensure participant joins first
                              await fetch(`http://localhost:5000/api/contests/${contestId}/join`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ studentEmail: userEmail })
                              }).catch(() => {});
                              
                              // Add contest to participated contests
                              setParticipatedContests(prev => new Set([...prev, contestId]));
                              
                              // Start attempt (enforces single attempt and timing)
                              const startRes = await fetch(`http://localhost:5000/api/contests/${contestId}/start`, {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ studentEmail: userEmail })
                              });
                              const startJson = await startRes.json();
                              if (!startRes.ok) {
                                alert(startJson.error || 'Unable to start contest attempt.');
                                return;
                              }
                              // Load contest with enforcement (requires studentEmail)
                              const contestResponse = await fetch(`http://localhost:5000/api/contests/${contestId}?studentEmail=${encodeURIComponent(userEmail)}`);
                              const contestData = await contestResponse.json();
                              if (contestResponse.ok && contestData.contest && contestData.problems) {
                                setCurrentContest(contestData.contest);
                                setContestProblems(contestData.problems);
                                setShowContestView(true);
                                setContestFullscreen(true); // Enable fullscreen contest mode
                                setActiveTab('contests');
                                localStorage.setItem('activeContestId', contestId);
                              } else {
                                alert(contestData.error || 'Error loading contest details.');
                              }
                            } catch (error) {
                              alert('Error loading contest. Please try again.');
                            }
                          }}
                        />
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {activeTab === 'students' && (
            <div className="students-section">
              <h2 className="section-title">Registered Students</h2>
              
              <table className="students-table">
                <thead>
                  <tr>
                    <th>PRN</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Class</th>
                    <th>Branch</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((s, idx) => (
                    <tr key={s.prn || idx}>
                      <td>{s.prn}</td>
                      <td>{s.first_name} {s.middle_name} {s.last_name}</td>
                      <td>{s.email}</td>
                      <td>{s.class}</td>
                      <td>{s.branch}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      
      {/* Badge Preview Modal */}
      <BadgePreviewModal 
        isOpen={showBadgeModal}
        onClose={() => setShowBadgeModal(false)}
        currentStreak={userStats.currentStreak}
        currentUser={currentUser}
        problemsSolved={userStats.totalSolved}
        badgeType={badgeModalType}
      />
      
      {/* Contest Notification Popup */}
      {showContestPopup && popupContest && (
        <div className="contest-popup-overlay">
          <div className="contest-popup">
            <div className="popup-header">
              <div className="popup-icon">
                {popupContest.status === 'ongoing' ? '🔥' : '⏰'}
              </div>
              <div className="popup-title">
                <h3>{popupContest.status === 'ongoing' ? 'Live Contest!' : 'Upcoming Contest!'}</h3>
                <p>{popupContest.title}</p>
              </div>
              <button 
                className="popup-close"
                onClick={() => setShowContestPopup(false)}
              >
                ×
              </button>
            </div>
            
            <div className="popup-content">
              <div className="contest-details">
                <div className="detail-item">
                  <span className="label">📅 Date:</span>
                  <span className="value">{new Date(popupContest.start_date).toLocaleDateString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">⏰ Time:</span>
                  <span className="value">{new Date(popupContest.start_date).toLocaleTimeString()}</span>
                </div>
                <div className="detail-item">
                  <span className="label">⏱️ Duration:</span>
                  <span className="value">{popupContest.duration} minutes</span>
                </div>
                <div className="detail-item">
                  <span className="label">🎯 Problems:</span>
                  <span className="value">{popupContest.problem_count || 0} problems</span>
                </div>
                <div className="detail-item">
                  <span className="label">🏆 Difficulty:</span>
                  <span className="value">{popupContest.difficulty}</span>
                </div>
              </div>
              
              <div className="popup-actions">
                <button 
                  className="popup-btn primary"
                  onClick={() => {
                    setShowContestPopup(false);
                    // Add contest to participated contests when user interacts with popup
                    if (popupContest) {
                      setParticipatedContests(prev => new Set([...prev, popupContest.id]));
                    }
                    setActiveTab('contests');
                  }}
                >
                  {popupContest.status === 'ongoing' ? 'Join Now!' : 'View Details'}
                </button>
                <button 
                  className="popup-btn secondary"
                  onClick={() => setShowContestPopup(false)}
                >
                  Maybe Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}