import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
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

function Header() {
  return (
    <header className="student-header">
      <div className="logo">SKN <span>CODEMATE</span></div>
      <nav className="nav">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/login" className="nav-link">Logout</Link>
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

function QuestionCard({ difficulty, title, category, points, solved, total }) {
  const getDifficultyColor = (diff) => {
    switch(diff.toLowerCase()) {
      case 'easy': return '#4CAF50';
      case 'medium': return '#FF9800';
      case 'hard': return '#F44336';
      default: return '#4CAF50';
    }
  };

  const getDifficultyIcon = (diff) => {
    switch(diff.toLowerCase()) {
      case 'easy': return '🟢';
      case 'medium': return '🟡';
      case 'hard': return '🔴';
      default: return '🟢';
    }
  };

  return (
    <div className="question-card">
      <div className="question-header">
        <span className="difficulty-badge" style={{ color: getDifficultyColor(difficulty) }}>
          {getDifficultyIcon(difficulty)} {difficulty}
        </span>
        <span className="points">{points} pts</span>
      </div>
      <h3 className="question-title">{title}</h3>
      <p className="question-category">{category}</p>
      <div className="question-stats">
        <span className="solved-count">{solved}/{total} solved</span>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${(solved/total) * 100}%`,
              backgroundColor: getDifficultyColor(difficulty)
            }}
          ></div>
        </div>
      </div>
      <button className="solve-btn">Start Solving</button>
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
      <div className="user-points">{points} pts</div>
    </div>
  );
}

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [userStats] = useState({
    totalSolved: 24,
    totalPoints: 1850,
    currentStreak: 7,
    rank: 15,
    accuracy: 87
  });

  const [questions] = useState([
    {
      id: 1,
      title: "Two Sum",
      difficulty: "Easy",
      category: "Arrays",
      points: 10,
      solved: 1250,
      total: 1500
    },
    {
      id: 2,
      title: "Valid Parentheses",
      difficulty: "Easy",
      category: "Stack",
      points: 15,
      solved: 980,
      total: 1200
    },
    {
      id: 3,
      title: "Merge Two Sorted Lists",
      difficulty: "Medium",
      category: "Linked List",
      points: 25,
      solved: 650,
      total: 900
    },
    {
      id: 4,
      title: "Binary Tree Inorder Traversal",
      difficulty: "Medium",
      category: "Tree",
      points: 30,
      solved: 420,
      total: 750
    },
    {
      id: 5,
      title: "Longest Palindromic Substring",
      difficulty: "Hard",
      category: "Dynamic Programming",
      points: 50,
      solved: 180,
      total: 500
    },
    {
      id: 6,
      title: "Regular Expression Matching",
      difficulty: "Hard",
      category: "String",
      points: 60,
      solved: 95,
      total: 300
    }
  ]);

  const [leaderboard] = useState([
    { rank: 1, name: "Alex Johnson", points: 2850, solved: 45, avatar: "👨‍💻" },
    { rank: 2, name: "Sarah Chen", points: 2720, solved: 42, avatar: "👩‍💻" },
    { rank: 3, name: "Mike Rodriguez", points: 2650, solved: 40, avatar: "👨‍💻" },
    { rank: 4, name: "Emily Davis", points: 2580, solved: 38, avatar: "👩‍💻" },
    { rank: 5, name: "David Kim", points: 2450, solved: 36, avatar: "👨‍💻" }
  ]);

  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/students')
      .then(res => res.json())
      .then(data => setStudents(data))
      .catch(() => setStudents([]));
  }, []);

  return (
    <div className="student-dashboard-bg">
      <StarBackground />
      <Header />
      
      <div className="dashboard-container">
        <div className="sidebar">
          <div className="user-profile">
            <div className="profile-avatar">👨‍🎓</div>
            <h3>Welcome back!</h3>
            <p className="user-name">John Doe</p>
            <p className="user-email">john.doe@skncoe.ac.in</p>
          </div>
          
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={`nav-item ${activeTab === 'problems' ? 'active' : ''}`}
              onClick={() => setActiveTab('problems')}
            >
              💻 Problems
            </button>
            <button 
              className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('leaderboard')}
            >
              🏆 Leaderboard
            </button>
            <button 
              className={`nav-item ${activeTab === 'progress' ? 'active' : ''}`}
              onClick={() => setActiveTab('progress')}
            >
              📈 Progress
            </button>
          </nav>
        </div>

        <div className="main-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <h2 className="section-title">Dashboard Overview</h2>
              
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
                  title="Global Rank"
                  value={`#${userStats.rank}`}
                  color="#9C27B0"
                  gradient="linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)"
                />
              </div>

              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button className="action-btn primary">
                    🚀 Start Daily Challenge
                  </button>
                  <button className="action-btn secondary">
                    📚 Practice Arrays
                  </button>
                  <button className="action-btn secondary">
                    🎯 Take Assessment
                  </button>
                </div>
              </div>

              <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <span className="activity-icon">✅</span>
                    <div className="activity-content">
                      <p>Solved "Two Sum" problem</p>
                      <span className="activity-time">2 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">🏆</span>
                    <div className="activity-content">
                      <p>Earned 25 points for "Valid Parentheses"</p>
                      <span className="activity-time">1 day ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">📈</span>
                    <div className="activity-content">
                      <p>Improved rank from #18 to #15</p>
                      <span className="activity-time">2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'problems' && (
            <div className="problems-section">
              <div className="section-header">
                <h2 className="section-title">Coding Problems</h2>
                <div className="filter-controls">
                  <select className="filter-select">
                    <option>All Difficulties</option>
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </select>
                  <select className="filter-select">
                    <option>All Categories</option>
                    <option>Arrays</option>
                    <option>Strings</option>
                    <option>Linked List</option>
                    <option>Tree</option>
                    <option>Dynamic Programming</option>
                  </select>
                </div>
              </div>

              <div className="questions-grid">
                {questions.map(question => (
                  <QuestionCard key={question.id} {...question} />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="leaderboard-section">
              <h2 className="section-title">Global Leaderboard</h2>
              
              <div className="leaderboard-container">
                {leaderboard.map((user, index) => (
                  <LeaderboardCard key={index} {...user} />
                ))}
              </div>

              <div className="your-position">
                <h3>Your Position</h3>
                <div className="position-card">
                  <div className="rank-badge">#{userStats.rank}</div>
                  <div className="user-info">
                    <div className="avatar">👨‍🎓</div>
                    <div className="user-details">
                      <h4>John Doe</h4>
                      <p>{userStats.totalSolved} problems solved</p>
                    </div>
                  </div>
                  <div className="user-points">{userStats.totalPoints} pts</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'progress' && (
            <div className="progress-section">
              <h2 className="section-title">Your Progress</h2>
              
              <div className="progress-cards">
                <div className="progress-card">
                  <h3>Weekly Progress</h3>
                  <div className="progress-chart">
                    <div className="chart-bar" style={{ height: '60%' }}></div>
                    <div className="chart-bar" style={{ height: '80%' }}></div>
                    <div className="chart-bar" style={{ height: '45%' }}></div>
                    <div className="chart-bar" style={{ height: '90%' }}></div>
                    <div className="chart-bar" style={{ height: '75%' }}></div>
                    <div className="chart-bar" style={{ height: '85%' }}></div>
                    <div className="chart-bar" style={{ height: '70%' }}></div>
                  </div>
                  <p>Problems solved this week</p>
                </div>

                <div className="progress-card">
                  <h3>Accuracy Rate</h3>
                  <div className="accuracy-circle">
                    <span className="accuracy-percentage">{userStats.accuracy}%</span>
                  </div>
                  <p>Overall problem solving accuracy</p>
                </div>

                <div className="progress-card">
                  <h3>Streak Counter</h3>
                  <div className="streak-display">
                    <span className="streak-number">{userStats.currentStreak}</span>
                    <span className="streak-label">days</span>
                  </div>
                  <p>Keep the momentum going!</p>
                </div>
              </div>
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
    </div>
  );
}