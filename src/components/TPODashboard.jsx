import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './TPODashboard.css';

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
    localStorage.removeItem('tpoLoggedIn');
    navigate('/login');
  };

  return (
    <header className="tpo-header">
      <div className="logo">SKN <span>CODEMATE</span></div>
      <div className="tpo-info">
        <span className="tpo-badge">Training & Placement Officer</span>
        <button onClick={handleLogout} className="logout-btn">Logout</button>
      </div>
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

function BranchCard({ branch, stats, students }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="branch-card">
      <div className="branch-header" onClick={() => setIsExpanded(!isExpanded)}>
        <div className="branch-info">
          <h3 className="branch-name">{branch}</h3>
          <div className="branch-stats">
            <span className="stat">Total: {stats.total}</span>
            <span className="stat">SY: {stats.sy}</span>
            <span className="stat">TY: {stats.ty}</span>
            <span className="stat">BE: {stats.be}</span>
          </div>
        </div>
        <div className="branch-toggle">
          <span className={`toggle-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="branch-students">
          <div className="students-grid">
            {students.map((student, index) => (
              <div key={index} className="student-item">
                <div className="student-avatar">👨‍🎓</div>
                <div className="student-details">
                  <h4>{student.first_name} {student.last_name}</h4>
                  <p>{student.email}</p>
                  <span className="student-class">{student.class}</span>
                </div>
                <div className="student-performance">
                  <span className="performance-score">85%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function LeaderboardCard({ rank, student, performance }) {
  const getRankColor = (rank) => {
    switch(rank) {
      case 1: return '#FFD700'; // Gold
      case 2: return '#C0C0C0'; // Silver
      case 3: return '#CD7F32'; // Bronze
      default: return '#4CAF50';
    }
  };

  return (
    <div className="leaderboard-card">
      <div className="rank-badge" style={{ backgroundColor: getRankColor(rank) }}>
        {rank}
      </div>
      <div className="student-info">
        <div className="student-avatar">👨‍🎓</div>
        <div className="student-details">
          <h4>{student.first_name} {student.last_name}</h4>
          <p>{student.branch} - {student.class}</p>
        </div>
      </div>
      <div className="performance-info">
        <div className="performance-score">{performance.score}%</div>
        <div className="performance-label">Accuracy</div>
      </div>
      <div className="stats-info">
        <div className="stat-item">
          <span className="stat-value">{performance.problemsSolved}</span>
          <span className="stat-label">Solved</span>
        </div>
        <div className="stat-item">
          <span className="stat-value">{performance.points}</span>
          <span className="stat-label">Points</span>
        </div>
      </div>
    </div>
  );
}

function PerformanceChart({ data, title }) {
  return (
    <div className="performance-chart">
      <h3>{title}</h3>
      <div className="chart-container">
        <div className="chart-bars">
          {data.map((item, index) => (
            <div key={index} className="chart-bar">
              <div 
                className="bar-fill" 
                style={{ 
                  height: `${item.value}%`,
                  backgroundColor: item.color 
                }}
              ></div>
              <span className="bar-label">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function TPODashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');

  const BRANCHES = ['CSE', 'AIDS', 'ENTC', 'MECHANICAL', 'ELECTRICAL', 'CIVIL'];
  const CLASSES = ['SY', 'TY', 'BE'];

  useEffect(() => {
    // Check if TPO is logged in
    const isLoggedIn = localStorage.getItem('tpoLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Fetch all students
    fetch('http://localhost:5000/api/students')
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching students:', err);
        setLoading(false);
      });
  }, [navigate]);

  const getBranchStats = (branch) => {
    const branchStudents = students.filter(s => s.branch === branch);
    return {
      total: branchStudents.length,
      sy: branchStudents.filter(s => s.class === 'SY').length,
      ty: branchStudents.filter(s => s.class === 'TY').length,
      be: branchStudents.filter(s => s.class === 'BE').length
    };
  };

  const getOverallStats = () => {
    return {
      total: students.length,
      branches: BRANCHES.length,
      sy: students.filter(s => s.class === 'SY').length,
      ty: students.filter(s => s.class === 'TY').length,
      be: students.filter(s => s.class === 'BE').length
    };
  };

  const getFilteredStudents = () => {
    let filtered = students;
    
    if (selectedBranch !== 'all') {
      filtered = filtered.filter(s => s.branch === selectedBranch);
    }
    
    if (selectedClass !== 'all') {
      filtered = filtered.filter(s => s.class === selectedClass);
    }
    
    return filtered;
  };

  const getLeaderboardData = () => {
    // Mock performance data - in real app, this would come from database
    return students.slice(0, 20).map((student, index) => ({
      rank: index + 1,
      student,
      performance: {
        score: Math.floor(Math.random() * 30) + 70, // 70-100%
        problemsSolved: Math.floor(Math.random() * 50) + 10,
        points: Math.floor(Math.random() * 1000) + 500
      }
    }));
  };

  const getPerformanceData = () => {
    const branchData = BRANCHES.map(branch => ({
      label: branch,
      value: Math.floor(Math.random() * 40) + 60, // 60-100%
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    }));

    const classData = CLASSES.map(cls => ({
      label: cls,
      value: Math.floor(Math.random() * 40) + 60,
      color: `hsl(${Math.random() * 360}, 70%, 60%)`
    }));

    return { branchData, classData };
  };

  const overallStats = getOverallStats();
  const leaderboardData = getLeaderboardData();
  const performanceData = getPerformanceData();

  if (loading) {
    return (
      <div className="tpo-dashboard-bg">
        <StarBackground />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading students data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="tpo-dashboard-bg">
      <StarBackground />
      <Header />
      
      <div className="dashboard-container">
        <div className="sidebar">
          <div className="tpo-profile">
            <div className="profile-avatar">👨‍💼</div>
            <h3>TPO Dashboard</h3>
            <p className="tpo-name">Training & Placement Officer</p>
            <p className="tpo-role">Administrator</p>
          </div>
          
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={`nav-item ${activeTab === 'branches' ? 'active' : ''}`}
              onClick={() => setActiveTab('branches')}
            >
              🏢 Branches
            </button>
            <button 
              className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('leaderboard')}
            >
              🏆 Leaderboard
            </button>
            <button 
              className={`nav-item ${activeTab === 'performance' ? 'active' : ''}`}
              onClick={() => setActiveTab('performance')}
            >
              📈 Performance
            </button>
            <button 
              className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => setActiveTab('reports')}
            >
              📋 Reports
            </button>
          </nav>
        </div>

        <div className="main-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <h2 className="section-title">TPO Overview</h2>
              
              <div className="stats-grid">
                <StatCard 
                  icon="👥"
                  title="Total Students"
                  value={overallStats.total}
                  color="#4CAF50"
                  gradient="linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
                />
                <StatCard 
                  icon="🏢"
                  title="Departments"
                  value={overallStats.branches}
                  color="#2196F3"
                  gradient="linear-gradient(135deg, #2196F3 0%, #1976D2 100%)"
                />
                <StatCard 
                  icon="📚"
                  title="SY Students"
                  value={overallStats.sy}
                  color="#FF9800"
                  gradient="linear-gradient(135deg, #FF9800 0%, #F57C00 100%)"
                />
                <StatCard 
                  icon="🎯"
                  title="TY Students"
                  value={overallStats.ty}
                  color="#9C27B0"
                  gradient="linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)"
                />
                <StatCard 
                  icon="🎓"
                  title="BE Students"
                  value={overallStats.be}
                  color="#F44336"
                  gradient="linear-gradient(135deg, #F44336 0%, #D32F2F 100%)"
                />
                <StatCard 
                  icon="📈"
                  title="Avg Performance"
                  value="78%"
                  color="#00BCD4"
                  gradient="linear-gradient(135deg, #00BCD4 0%, #0097A7 100%)"
                />
              </div>

              <div className="quick-actions">
                <h3>Quick Actions</h3>
                <div className="action-buttons">
                  <button className="action-btn primary">
                    📊 Generate Report
                  </button>
                  <button className="action-btn secondary">
                    📧 Send Notification
                  </button>
                  <button className="action-btn secondary">
                    📋 Export Data
                  </button>
                  <button className="action-btn secondary">
                    🎯 Set Targets
                  </button>
                </div>
              </div>

              <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  <div className="activity-item">
                    <span className="activity-icon">✅</span>
                    <div className="activity-content">
                      <p>New student registered in CSE department</p>
                      <span className="activity-time">2 hours ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">🏆</span>
                    <div className="activity-content">
                      <p>Top performer identified from AIDS branch</p>
                      <span className="activity-time">1 day ago</span>
                    </div>
                  </div>
                  <div className="activity-item">
                    <span className="activity-icon">📈</span>
                    <div className="activity-content">
                      <p>Performance report generated for all departments</p>
                      <span className="activity-time">2 days ago</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'branches' && (
            <div className="branches-section">
              <div className="section-header">
                <h2 className="section-title">Branch-wise Students</h2>
                <div className="filter-controls">
                  <select 
                    value={selectedClass} 
                    onChange={(e) => setSelectedClass(e.target.value)}
                    className="filter-select"
                  >
                    <option value="all">All Classes</option>
                    {CLASSES.map(cls => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="branches-grid">
                {BRANCHES.map(branch => {
                  const branchStudents = students.filter(s => s.branch === branch);
                  const filteredStudents = selectedClass === 'all' 
                    ? branchStudents 
                    : branchStudents.filter(s => s.class === selectedClass);
                  
                  return (
                    <BranchCard 
                      key={branch}
                      branch={branch}
                      stats={getBranchStats(branch)}
                      students={filteredStudents}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="leaderboard-section">
              <h2 className="section-title">Overall Leaderboard</h2>
              
              <div className="leaderboard-container">
                {leaderboardData.map((item, index) => (
                  <LeaderboardCard 
                    key={index}
                    rank={item.rank}
                    student={item.student}
                    performance={item.performance}
                  />
                ))}
              </div>

              <div className="leaderboard-stats">
                <h3>Leaderboard Statistics</h3>
                <div className="stats-grid">
                  <div className="stat-item">
                    <span className="stat-value">{leaderboardData.length}</span>
                    <span className="stat-label">Top Performers</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">85%</span>
                    <span className="stat-label">Average Score</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-value">CSE</span>
                    <span className="stat-label">Top Department</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="performance-section">
              <h2 className="section-title">Performance Analytics</h2>
              
              <div className="performance-grid">
                <PerformanceChart 
                  data={performanceData.branchData}
                  title="Branch-wise Performance"
                />
                <PerformanceChart 
                  data={performanceData.classData}
                  title="Class-wise Performance"
                />
              </div>

              <div className="performance-metrics">
                <h3>Key Performance Indicators</h3>
                <div className="metrics-grid">
                  <div className="metric-card">
                    <h4>Overall Performance</h4>
                    <div className="metric-value">78%</div>
                    <div className="metric-trend positive">+5% from last month</div>
                  </div>
                  <div className="metric-card">
                    <h4>Problem Solving Rate</h4>
                    <div className="metric-value">85%</div>
                    <div className="metric-trend positive">+3% from last month</div>
                  </div>
                  <div className="metric-card">
                    <h4>Average Score</h4>
                    <div className="metric-value">72%</div>
                    <div className="metric-trend positive">+2% from last month</div>
                  </div>
                  <div className="metric-card">
                    <h4>Participation Rate</h4>
                    <div className="metric-value">92%</div>
                    <div className="metric-trend positive">+1% from last month</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'reports' && (
            <div className="reports-section">
              <h2 className="section-title">Reports & Analytics</h2>
              
              <div className="reports-grid">
                <div className="report-card">
                  <div className="report-icon">📊</div>
                  <h3>Complete Student Directory</h3>
                  <p>All registered students with detailed information</p>
                  <button className="report-btn">Generate Report</button>
                </div>

                <div className="report-card">
                  <div className="report-icon">🏢</div>
                  <h3>Branch-wise Report</h3>
                  <p>Detailed analysis by department</p>
                  <button className="report-btn">Generate Report</button>
                </div>

                <div className="report-card">
                  <div className="report-icon">📈</div>
                  <h3>Performance Analytics</h3>
                  <p>Comprehensive performance insights</p>
                  <button className="report-btn">Generate Report</button>
                </div>

                <div className="report-card">
                  <div className="report-icon">🏆</div>
                  <h3>Leaderboard Report</h3>
                  <p>Top performers and rankings</p>
                  <button className="report-btn">Generate Report</button>
                </div>

                <div className="report-card">
                  <div className="report-icon">📧</div>
                  <h3>Communication List</h3>
                  <p>Email addresses for notifications</p>
                  <button className="report-btn">Generate Report</button>
                </div>

                <div className="report-card">
                  <div className="report-icon">🎯</div>
                  <h3>Target Analysis</h3>
                  <p>Performance against targets</p>
                  <button className="report-btn">Generate Report</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}