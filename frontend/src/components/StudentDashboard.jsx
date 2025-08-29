import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CodingChallenges from './CodingChallenges';
import collegeLogo from '../assets/college-logo.jpeg';
import { getContestsByDepartment } from '../data/contests';
import ContestCard from './ContestCard';
import { initializeSession, logout } from '../utils/sessionManager';
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
      <div className="user-points">{points} pts</div>
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

export default function StudentDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
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

  useEffect(() => {
    // Initialize session management
    const cleanupSession = initializeSession();

    // Fetch current user data
    const userEmail = localStorage.getItem('userEmail');
    const isLoggedIn = localStorage.getItem('studentLoggedIn');
    
    if (userEmail && isLoggedIn === 'true') {
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
            setUserStats(data.stats);
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

    // Cleanup session management on unmount
    return cleanupSession;
  }, []);

  // Poll user stats for real-time streak updates
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) return;

    let abort = false;
    const fetchStats = () => {
      fetch(`http://localhost:5000/api/student/${encodeURIComponent(userEmail)}/stats`)
        .then(res => res.json())
        .then(data => {
          if (abort) return;
          if (data && data.stats) {
            setUserStats(data.stats);
          }
        })
        .catch(() => {});
    };

    fetchStats();
    const interval = setInterval(fetchStats, 15000); // 15s
    return () => { abort = true; clearInterval(interval); };
  }, []);

  // Fetch leaderboard initially and set up polling for real-time updates
  useEffect(() => {
    let abort = false;
    const fetchLeaderboard = () => {
      setLeaderboardLoading(true);
      setLeaderboardError('');
      fetch('http://localhost:5000/api/leaderboard?limit=50')
        .then(res => res.json())
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
        })
        .finally(() => {
          if (!abort) setLeaderboardLoading(false);
        });
    };

    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 15000); // 15s
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

  // Set up real-time updates for contests (polling every 30 seconds)
  useEffect(() => {
    if (!currentUser || !currentUser.branch) return;

    const interval = setInterval(() => {
      fetch(`http://localhost:5000/api/contests/department/${currentUser.branch}`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setContests(data);
          }
        })
        .catch(error => {
          console.error('Error updating contests:', error);
        });
    }, 30000); // 30 seconds

    return () => clearInterval(interval);
  }, [currentUser]);

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
    const handleVisibility = () => {
      if (!document.hidden) {
        const userEmail = localStorage.getItem('userEmail');
        if (!userEmail) return;
        fetch(`http://localhost:5000/api/student/${encodeURIComponent(userEmail)}/stats`)
          .then(res => res.json())
          .then(data => { if (data.stats) setUserStats(data.stats); })
          .catch(() => {});
      }
    };
    window.addEventListener('storage', handleStorage);
    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      window.removeEventListener('storage', handleStorage);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
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
            <button 
              className={`nav-item ${activeTab === 'contests' ? 'active' : ''}`}
              onClick={() => setActiveTab('contests')}
            >
              🏆 Contests
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
                  title="College Rank"
                  value={`#${userStats.rank}`}
                  color="#9C27B0"
                  gradient="linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)"
                />
              </div>
              <div style={{ marginTop: '20px' }}>
                <StreakBadge currentStreak={userStats.currentStreak} />
              </div>
            </div>
          )}

          {activeTab === 'problems' && <CodingChallenges />}

          {activeTab === 'leaderboard' && (
            <div className="leaderboard-section">
              <h2 className="section-title">Global Leaderboard</h2>
              
              {leaderboardLoading && (
                <div className="leaderboard-loading">Loading leaderboard…</div>
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
                  <div className="rank-badge">#{userStats.rank}</div>
                  <div className="user-info">
                    <div className="avatar">👨‍🎓</div>
                    <div className="user-details">
                      <h4>
                        {currentUser ? `${currentUser.first_name} ${currentUser.last_name}` : 'Loading...'}
                      </h4>
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

          {activeTab === 'contests' && (
            <div className="contests-section">
              <h2 className="section-title">Department Contests</h2>
              
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
                      onJoin={(contestId) => {
                        const userEmail = localStorage.getItem('userEmail');
                        if (!userEmail) {
                          alert('Please log in to join contests.');
                          return;
                        }
                        
                        fetch(`http://localhost:5000/api/contests/${contestId}/join`, {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/json',
                          },
                          body: JSON.stringify({ studentEmail: userEmail }),
                        })
                          .then(res => res.json())
                          .then(data => {
                            if (data.message) {
                              alert('Successfully joined the contest!');
                              // Refresh contests to update participant count
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
                            } else {
                              alert('Error joining contest: ' + (data.error || 'Unknown error'));
                            }
                          })
                          .catch(error => {
                            console.error('Error joining contest:', error);
                            alert('Error joining contest. Please try again.');
                          });
                      }}
                      onView={(contestId) => {
                        console.log('Viewing contest:', contestId);
                        // TODO: Implement contest viewing logic
                        alert('Contest viewing functionality will be implemented soon!');
                      }}
                    />
                  ))}
                </div>
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
    </div>
  );
}