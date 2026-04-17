import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import collegeLogo from '../assets/college-logo.jpeg';
import { jsPDF } from 'jspdf';
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
      <div className="header-logo-section">
        <img src={collegeLogo} alt="SKN College Logo" className="header-college-logo" />
        <div className="logo">SKN <span>CODEMATE</span></div>
      </div>
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


export default function TPODashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedBranch, setSelectedBranch] = useState('all');
  const [selectedClass, setSelectedClass] = useState('all');
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const BRANCHES = ['CSE', 'AIDS', 'ENTC', 'MECHANICAL', 'ELECTRICAL', 'CIVIL'];
  const CLASSES = ['SY', 'TY', 'BE'];

  useEffect(() => {
    // Check if TPO is logged in
    const isLoggedIn = localStorage.getItem('tpoLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    // Handle back navigation within dashboard
    const handlePopState = () => {
      const stillLoggedIn = localStorage.getItem('tpoLoggedIn') === 'true';
      if (!stillLoggedIn) {
        navigate('/login');
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

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [navigate]);

  // Fetch leaderboard data with real-time updates
  useEffect(() => {
    const fetchLeaderboard = () => {
      setLeaderboardLoading(true);
      fetch('http://localhost:5000/api/leaderboard?limit=50')
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setLeaderboard(data);
            setLastUpdate(new Date());
          }
        })
        .catch(err => {
          console.error('Error fetching leaderboard:', err);
        })
        .finally(() => {
          setLeaderboardLoading(false);
        });
    };

    // Initial fetch
    fetchLeaderboard();
    
    // Set up auto-refresh every 10 seconds
    const interval = setInterval(fetchLeaderboard, 10000);
    
    return () => clearInterval(interval);
  }, []);

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
    // Use real leaderboard data from API
    return leaderboard.map((item, index) => ({
      rank: item.rank,
      student: {
        first_name: item.name.split(' ')[0] || '',
        last_name: item.name.split(' ').slice(1).join(' ') || '',
        email: item.email,
        class: item.class,
        branch: item.branch
      },
      performance: {
        score: Math.min(100, Math.max(0, Math.floor((item.solved / Math.max(item.points / 100, 1)) * 10))), // Calculate accuracy
        problemsSolved: item.solved,
        points: item.points
      }
    }));
  };

  const overallStats = getOverallStats();
  const leaderboardData = getLeaderboardData();

  // Calculate real-time leaderboard statistics
  const getLeaderboardStats = () => {
    if (leaderboard.length === 0) {
      return {
        topPerformers: 0,
        topDepartment: 'N/A'
      };
    }

    // Find top department by total points
    const departmentStats = {};
    leaderboard.forEach(item => {
      if (!departmentStats[item.branch]) {
        departmentStats[item.branch] = { totalPoints: 0, count: 0 };
      }
      departmentStats[item.branch].totalPoints += item.points;
      departmentStats[item.branch].count += 1;
    });

    const topDepartment = Object.entries(departmentStats)
      .map(([branch, stats]) => ({
        branch,
        totalPoints: stats.totalPoints
      }))
      .sort((a, b) => b.totalPoints - a.totalPoints)[0]?.branch || 'N/A';

    return {
      topPerformers: leaderboard.length,
      topDepartment
    };
  };

  const leaderboardStats = getLeaderboardStats();

  // Handle tab changes with proper history management
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    // Push new state to browser history
    window.history.pushState({ tab: tabName }, '', window.location.pathname);
  };

  // PDF Download Functions
  const downloadOverallLeaderboardPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Overall Leaderboard Report', 20, 20);
    
    // Date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Table headers
    doc.setFontSize(12);
    doc.text('Rank', 20, 50);
    doc.text('Student Name', 40, 50);
    doc.text('Department', 100, 50);
    doc.text('Class', 140, 50);
    doc.text('Problems Solved', 160, 50);
    doc.text('Points', 200, 50);
    
    // Table data
    let yPosition = 60;
    leaderboard.forEach((item, index) => {
      if (yPosition > 280) {
        doc.addPage();
        yPosition = 20;
        // Repeat headers on new page
        doc.text('Rank', 20, yPosition);
        doc.text('Student Name', 40, yPosition);
        doc.text('Department', 100, yPosition);
        doc.text('Class', 140, yPosition);
        doc.text('Problems Solved', 160, yPosition);
        doc.text('Points', 200, yPosition);
        yPosition = 30;
      }
      
      doc.setFontSize(10);
      doc.text((index + 1).toString(), 20, yPosition);
      doc.text(item.name, 40, yPosition);
      doc.text(item.branch, 100, yPosition);
      doc.text(item.class, 140, yPosition);
      doc.text(item.solved.toString(), 160, yPosition);
      doc.text(item.points.toString(), 200, yPosition);
      yPosition += 10;
    });
    
    // Statistics
    yPosition += 20;
    doc.setFontSize(14);
    doc.text('Statistics', 20, yPosition);
    yPosition += 10;
    doc.setFontSize(10);
    doc.text(`Total Students: ${leaderboardStats.topPerformers}`, 20, yPosition);
    yPosition += 10;
    doc.text(`Top Department: ${leaderboardStats.topDepartment}`, 20, yPosition);
    
    doc.save('Overall_Leaderboard_Report.pdf');
  };

  const downloadBranchwiseLeaderboardPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text('Branch-wise Leaderboard Report', 20, 20);
    
    // Date
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 20, 30);
    
    // Group by branch
    const branchGroups = {};
    leaderboard.forEach(item => {
      if (!branchGroups[item.branch]) {
        branchGroups[item.branch] = [];
      }
      branchGroups[item.branch].push(item);
    });
    
    let yPosition = 50;
    Object.keys(branchGroups).forEach(branch => {
      if (yPosition > 250) {
        doc.addPage();
        yPosition = 20;
      }
      
      // Branch header
      doc.setFontSize(14);
      doc.text(`${branch} Department`, 20, yPosition);
      yPosition += 10;
      
      // Table headers
      doc.setFontSize(10);
      doc.text('Rank', 20, yPosition);
      doc.text('Student Name', 40, yPosition);
      doc.text('Class', 100, yPosition);
      doc.text('Problems Solved', 120, yPosition);
      doc.text('Points', 160, yPosition);
      yPosition += 10;
      
      // Branch students
      branchGroups[branch].forEach((item, index) => {
        if (yPosition > 280) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.text((index + 1).toString(), 20, yPosition);
        doc.text(item.name, 40, yPosition);
        doc.text(item.class, 100, yPosition);
        doc.text(item.solved.toString(), 120, yPosition);
        doc.text(item.points.toString(), 160, yPosition);
        yPosition += 10;
      });
      
      yPosition += 15;
    });
    
    doc.save('Branchwise_Leaderboard_Report.pdf');
  };

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
              onClick={() => handleTabChange('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={`nav-item ${activeTab === 'branches' ? 'active' : ''}`}
              onClick={() => handleTabChange('branches')}
            >
              🏢 Branches
            </button>
            <button 
              className={`nav-item ${activeTab === 'leaderboard' ? 'active' : ''}`}
              onClick={() => handleTabChange('leaderboard')}
            >
              🏆 Leaderboard
            </button>
            <button 
              className={`nav-item ${activeTab === 'reports' ? 'active' : ''}`}
              onClick={() => handleTabChange('reports')}
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
              <div className="section-header">
                <h2 className="section-title">Overall Leaderboard</h2>
                <div className="last-update">
                  <span className="update-indicator">🔄</span>
                  <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
                </div>
              </div>
              
              {leaderboardLoading ? (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading leaderboard data...</p>
                </div>
              ) : (
                <>
                  <div className="leaderboard-container">
                    {leaderboardData.map((item, index) => (
                      <LeaderboardCard 
                        key={`${item.student.email}-${index}`}
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
                        <span className="stat-value">{leaderboardStats.topPerformers}</span>
                        <span className="stat-label">Top Performers</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{leaderboardStats.topDepartment}</span>
                        <span className="stat-label">Top Department</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}


          {activeTab === 'reports' && (
            <div className="reports-section">
              <h2 className="section-title">Download Reports</h2>
              
              <div className="reports-grid">
                <div className="report-card">
                  <div className="report-icon">🏆</div>
                  <h3>Overall Leaderboard</h3>
                  <p>Complete leaderboard with all students ranked by performance</p>
                  <button className="report-btn" onClick={downloadOverallLeaderboardPDF}>Download PDF</button>
                </div>

                <div className="report-card">
                  <div className="report-icon">🏢</div>
                  <h3>Branch-wise Leaderboard</h3>
                  <p>Leaderboard organized by department/branch</p>
                  <button className="report-btn" onClick={downloadBranchwiseLeaderboardPDF}>Download PDF</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}