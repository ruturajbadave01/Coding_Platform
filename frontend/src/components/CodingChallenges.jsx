import React, { useState, useEffect } from 'react';
import { allProgrammingProblems } from '../data/allProgrammingProblems';
import { validateProgrammingProblems } from '../utils/validateData';
import CodeEditor from './CodeEditor';
import './CodingChallenges.css';

function ChallengeCard({ challenge, onStart, isSolved }) {
  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Level 1':
      case 'Easy': return '#4CAF50';
      case 'Level 2':
      case 'Medium': return '#FF9800';
      case 'Level 3':
      case 'Hard': return '#F44336';
      case 'Level 4': return '#9C27B0';
      default: return '#757575';
    }
  };

  const getDifficultyIcon = (difficulty) => {
    switch (difficulty) {
      case 'Level 1':
      case 'Easy': return '🟢';
      case 'Level 2':
      case 'Medium': return '🟡';
      case 'Level 3':
      case 'Hard': return '🔴';
      case 'Level 4': return '🟣';
      default: return '⚪';
    }
  };

  const getDisplayDifficulty = (difficulty) => {
    switch (difficulty) {
      case 'Level 1': return 'Basic';
      case 'Level 2': return 'Intermediate';
      case 'Level 3': return 'Advanced';
      case 'Level 4': return 'Expert';
      default: return difficulty;
    }
  };

  return (
    <div className="challenge-card">
      <div className="challenge-header">
        <div className="challenge-title">
          <h3>{challenge.title}</h3>
          {isSolved && (
            <span className="solved-tag">SOLVED</span>
          )}
          <span className="difficulty-badge" style={{ backgroundColor: getDifficultyColor(challenge.difficulty) }}>
            {getDifficultyIcon(challenge.difficulty)} {getDisplayDifficulty(challenge.difficulty)}
          </span>
        </div>
        <div className="challenge-meta">
          <span className="category">{challenge.category}</span>
          <span className="points">{challenge.points} pts</span>
        </div>
      </div>
      
      <div className="challenge-description">
        <p>{challenge.description}</p>
      </div>
      
      <div className="challenge-stats">
        <span className="success-rate">Success Rate: {challenge.successRate || 'N/A'}%</span>
        <span className="submissions">{challenge.submissions || '0'} submissions</span>
        {challenge.testCases && challenge.testCases.length > 0 && (
          <span className="test-cases">📋 {challenge.testCases.length} test cases</span>
        )}
      </div>
      
      <div className="challenge-tags">
        {challenge.tags && Array.isArray(challenge.tags) && challenge.tags.map((tag, index) => (
          <span key={`tag-${challenge.id}-${index}`} className="tag">{tag}</span>
        ))}
      </div>
      
      <button className="start-challenge-btn" onClick={() => onStart(challenge)}>
        💻 Open Code Editor
      </button>
      
      {isSolved && (
        <div className="solved-badge">
          ✅ Solved • +{challenge.points || 5} points
        </div>
      )}
    </div>
  );
}

export default function CodingChallenges() {
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [showCodeEditor, setShowCodeEditor] = useState(false);
  const [solvedProblems, setSolvedProblems] = useState(new Set());
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentUser, setCurrentUser] = useState('');

  // Validate data integrity on component mount
  useEffect(() => {
    const isValid = validateProgrammingProblems();
    if (!isValid) {
      console.warn('⚠️ Programming problems data has duplicate IDs. Check the console for details.');
    }
  }, []);

  // Load persisted progress for the current user
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail') || '';
    setCurrentUser(userEmail);
    if (!userEmail) return;
    try {
      const raw = localStorage.getItem(`progress:${userEmail}`);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.solvedIds)) {
          setSolvedProblems(new Set(parsed.solvedIds));
        }
        if (typeof parsed.totalPoints === 'number') {
          setTotalPoints(parsed.totalPoints);
        }
      }
    } catch (_) {}
  }, []);

  // Persist progress when it changes
  useEffect(() => {
    if (!currentUser) return;
    const data = {
      solvedIds: Array.from(solvedProblems),
      totalPoints
    };
    try {
      localStorage.setItem(`progress:${currentUser}`, JSON.stringify(data));
    } catch (_) {}
  }, [solvedProblems, totalPoints, currentUser]);

  // Transform the new problem data to match the expected format
  const transformedChallenges = allProgrammingProblems
    .filter(problem => problem && problem.id && problem.title) // Filter out invalid problems
    .map(problem => ({
      ...problem,
      successRate: problem.successRate || Math.floor(Math.random() * 30) + 60, // Random success rate between 60-90%
      submissions: problem.submissions || Math.floor(Math.random() * 1000) + 100 // Random submissions between 100-1100
    }));

  const filteredChallenges = transformedChallenges.filter(challenge => {
    const difficultyMatch = selectedDifficulty === 'All' || challenge.difficulty === selectedDifficulty;
    const categoryMatch = selectedCategory === 'All' || challenge.category === selectedCategory;
    return difficultyMatch && categoryMatch;
  });

  // Get unique categories from the problems
  const uniqueCategories = [...new Set(transformedChallenges.map(challenge => challenge.category))].sort();

  const handleStartChallenge = (challenge) => {
    setSelectedChallenge(challenge);
    setShowCodeEditor(true);
  };

  const handleBackToChallenges = () => {
    setShowCodeEditor(false);
    setSelectedChallenge(null);
  };

  const handleSubmission = (result) => {
    const allPassed = (result && (result.allTestsPassed ?? (result.result && result.result.allTestsPassed))) || false;
    if (allPassed) {
      // Add to solved problems and update points
      if (selectedChallenge) {
        setSolvedProblems(prev => new Set([...prev, selectedChallenge.id]));
        setTotalPoints(prev => prev + (selectedChallenge.points || 5));
      }
      
      alert('🎉 Congratulations! All test cases passed!');
      // Redirect back to problems list
      setShowCodeEditor(false);
      setSelectedChallenge(null);
    } else {
      alert('❌ Some test cases failed. Check the output for details.');
    }
  };

  // If code editor is shown, render it with the selected challenge
  if (showCodeEditor && selectedChallenge) {
    return (
      <div className="coding-challenges">
        <div className="challenges-header">
          <button 
            onClick={handleBackToChallenges}
            className="back-button"
          >
            ← Back to Challenges
          </button>
          <h2 className="section-title">💻 {selectedChallenge.title}</h2>
          <p className="challenges-subtitle">
            {selectedChallenge.difficulty} • {selectedChallenge.category} • {selectedChallenge.points} points
          </p>
        </div>
        
        <CodeEditor 
          problem={{
            id: selectedChallenge.id,
            title: selectedChallenge.title,
            description: selectedChallenge.description,
            difficulty: selectedChallenge.difficulty,
            points: selectedChallenge.points,
            testCases: selectedChallenge.testCases || []
          }}
          onSubmission={handleSubmission}
          onClose={handleBackToChallenges}
        />
      </div>
    );
  }

  // Otherwise, render the challenges list
  return (
    <div className="coding-challenges">
      <div className="challenges-header">
        <h2 className="section-title">Coding Challenges</h2>
        <p className="challenges-subtitle">
          Master important coding problems that top companies ask in interviews
        </p>
        
        <div className="filter-controls">
          <div className="filter-group">
            <label>Difficulty:</label>
            <select 
              value={selectedDifficulty} 
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Difficulties</option>
              <option value="Level 1">Basic Fundamentals</option>
              <option value="Level 2">Intermediate Concepts</option>
              <option value="Level 3">Advanced Algorithms</option>
              <option value="Level 4">Expert Level</option>
            </select>
          </div>
          
          <div className="filter-group">
            <label>Category:</label>
            <select 
              value={selectedCategory} 
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Categories</option>
              {uniqueCategories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="challenges-stats">
        <div className="stat-item">
          <span className="stat-number">{filteredChallenges.length}</span>
          <span className="stat-label">Total Challenges</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{solvedProblems.size}</span>
          <span className="stat-label">Solved Challenges</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">{totalPoints}</span>
          <span className="stat-label">Total Points</span>
        </div>
      </div>

      <div className="challenges-grid">
        {filteredChallenges.map((challenge, index) => (
          <ChallengeCard 
            key={`challenge-${challenge.id}-${index}-${challenge.title.replace(/\s+/g, '-')}`} 
            challenge={challenge} 
            onStart={handleStartChallenge}
            isSolved={solvedProblems.has(challenge.id)}
          />
        ))}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="no-challenges">
          <h3>No challenges found</h3>
          <p>Try adjusting your filters to see more challenges.</p>
        </div>
      )}
    </div>
  );
} 