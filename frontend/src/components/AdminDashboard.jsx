import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import collegeLogo from '../assets/college-logo.jpeg';
import CreateContest from './CreateContest';
import { initializeSession, logout, validateSession } from '../utils/sessionManager';
import './AdminDashboard.css';

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

function Header({ department }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="admin-header">
      <div className="header-logo-section">
        <img src={collegeLogo} alt="SKN College Logo" className="header-college-logo" />
        <div className="logo">SKN <span>CODEMATE</span></div>
      </div>
      <div className="admin-info">
        <span className="department-badge">{department} Department</span>
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

function StudentCard({ student, index, onView }) {
  const getClassColor = (className) => {
    switch(className) {
      case 'SY': return '#4CAF50';
      case 'TY': return '#FF9800';
      case 'BE': return '#F44336';
      default: return '#4CAF50';
    }
  };

  return (
    <div className="student-card">
      <div className="student-header">
        <div className="student-avatar">👨‍🎓</div>
        <div className="student-info">
          <h3 className="student-name">
            {student.first_name} {student.middle_name} {student.last_name}
          </h3>
          <p className="student-email">{student.email}</p>
        </div>
        <div className="student-class" style={{ color: getClassColor(student.class) }}>
          {student.class}
        </div>
      </div>
      <div className="student-details">
        <div className="detail-item">
          <span className="detail-label">PRN:</span>
          <span className="detail-value">{student.prn}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Branch:</span>
          <span className="detail-value">{student.branch}</span>
        </div>
        <div className="detail-item">
          <span className="detail-label">Class:</span>
          <span className="detail-value">{student.class}</span>
        </div>
      </div>
      <div className="student-actions">
        <button className="action-btn view" onClick={() => onView && onView(student)}>View Details</button>
        <button className="action-btn edit">Edit</button>
      </div>
    </div>
  );
}

function SearchAndFilter({ searchTerm, setSearchTerm, filterClass, setFilterClass }) {
  return (
    <div className="search-filter-container">
      <div className="search-box">
        <input
          type="text"
          placeholder="Search students by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>
      <div className="filter-controls">
        <select 
          value={filterClass} 
          onChange={(e) => setFilterClass(e.target.value)}
          className="filter-select"
        >
          <option value="">All Classes</option>
          <option value="SY">SY</option>
          <option value="TY">TY</option>
          <option value="BE">BE</option>
        </select>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [activeTab, setActiveTab] = useState('overview');
  const [department] = useState(localStorage.getItem('adminDepartment') || 'CSE');
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedStats, setSelectedStats] = useState(null);
  // Contest report state
  const [contestId, setContestId] = useState('');
  const [departmentContests, setDepartmentContests] = useState([]);
  const [contestResults, setContestResults] = useState([]);
  const [contestSubmissions, setContestSubmissions] = useState([]);
  const [contestLoading, setContestLoading] = useState(false);
  const [contestError, setContestError] = useState('');
  
  // Certificate verification state
  const [certificateId, setCertificateId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationLoading, setVerificationLoading] = useState(false);
  const [verificationError, setVerificationError] = useState('');

  useEffect(() => {
    // Validate session and initialize session management
    if (!validateSession('admin')) {
      logout();
      return;
    }

    // Initialize session management
    initializeSession();

    // Handle back navigation within dashboard
    const handlePopState = () => {
      if (!validateSession('admin')) {
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

    // Fetch students for the department
    fetch(`http://localhost:5000/api/students/${department}`)
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setFilteredStudents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching students:', err);
        setLoading(false);
      });

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [department]);

  // Load department contests for quick selection in report tab
  useEffect(() => {
    fetch(`http://localhost:5000/api/contests/department/${department}`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setDepartmentContests(data);
        else setDepartmentContests([]);
      })
      .catch(() => setDepartmentContests([]));
  }, [department]);

  useEffect(() => {
    const fetchStudents = () => {
      fetch(`http://localhost:5000/api/students/${department}`)
        .then(res => res.json())
        .then(data => {
          setStudents(data);
        })
        .catch(() => setStudents([]));
    };
    fetchStudents();
    const interval = setInterval(fetchStudents, 5000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, [department]);

  useEffect(() => {
    let filtered = students;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(student => 
        student.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.prn.includes(searchTerm)
      );
    }

    // Filter by class
    if (filterClass) {
      filtered = filtered.filter(student => student.class === filterClass);
    }

    setFilteredStudents(filtered);
  }, [students, searchTerm, filterClass]);

  const getStats = () => {
    const totalStudents = students.length;
    const syStudents = students.filter(s => s.class === 'SY').length;
    const tyStudents = students.filter(s => s.class === 'TY').length;
    const beStudents = students.filter(s => s.class === 'BE').length;

    return {
      total: totalStudents,
      sy: syStudents,
      ty: tyStudents,
      be: beStudents
    };
  };

  const stats = getStats();

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setSelectedStats(null);
    setDetailsError('');
    setDetailsLoading(true);
    setDetailsOpen(true);
    const email = encodeURIComponent(student.email);
    fetch(`http://localhost:5000/api/student/${email}/stats`)
      .then(res => res.json())
      .then(data => {
        if (data && data.stats) {
          setSelectedStats(data.stats);
        } else {
          setDetailsError('Failed to load stats');
        }
      })
      .catch(() => setDetailsError('Failed to load stats'))
      .finally(() => setDetailsLoading(false));
  };

  // Handle tab changes with proper history management
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    // Push new state to browser history
    window.history.pushState({ tab: tabName }, '', window.location.pathname);
  };

  const handleVerifyCertificate = async () => {
    if (!certificateId.trim()) {
      setVerificationError('Please enter a certificate ID');
      return;
    }

    if (!/^\d{8}$/.test(certificateId)) {
      setVerificationError('Certificate ID must be exactly 8 digits');
      return;
    }

    setVerificationLoading(true);
    setVerificationError('');
    setVerificationResult(null);

    try {
      const response = await fetch(`http://localhost:5000/api/badges/verify/${certificateId}`);
      const data = await response.json();

      if (response.ok && data.success) {
        setVerificationResult({
          isValid: true,
          certificateId: data.badge.badgeId,
          studentName: data.badge.studentName,
          studentEmail: data.badge.studentEmail,
          badgeType: data.badge.badgeType === 'problems' ? 'Problem Solving' : 
                     data.badge.badgeType === 'streak' ? 'Coding Streak' : 
                     data.badge.badgeType === 'contest' ? 'Contest Achievement' : 'Achievement',
          badgeTier: data.badge.badgeTier,
          achievementValue: data.badge.achievementValue,
          issuedDate: new Date(data.badge.issuedDate).toLocaleDateString(),
          isVerified: data.badge.isVerified,
          verifiedAt: data.badge.verifiedAt ? new Date(data.badge.verifiedAt).toLocaleDateString() : null,
          verifiedBy: data.badge.verifiedBy,
          department: data.badge.department,
          description: data.badge.description
        });
      } else {
        setVerificationResult({
          isValid: false,
          certificateId: certificateId,
          error: data.error || 'Badge not found'
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      setVerificationError('Failed to verify certificate. Please try again.');
    } finally {
      setVerificationLoading(false);
    }
  };

  // Live refresh of selected student's stats while modal is open
  useEffect(() => {
    if (!detailsOpen || !selectedStudent || !selectedStudent.email) return;

    let abort = false;
    const fetchStats = () => {
      const email = encodeURIComponent(selectedStudent.email);
      fetch(`http://localhost:5000/api/student/${email}/stats`)
        .then(res => res.json())
        .then(data => {
          if (abort) return;
          if (data && data.stats) {
            setSelectedStats(data.stats);
            setDetailsError('');
          }
        })
        .catch(() => {
          if (abort) return;
          // keep previous stats, just note error silently
        });
    };

    // initial fetch and polling
    fetchStats();
    const interval = setInterval(fetchStats, 10000); // 10s

    // also react immediately to global statsUpdated signals
    const handleStorage = (e) => {
      if (e.key === 'statsUpdated') fetchStats();
    };
    const handleStatsEvent = () => fetchStats();
    window.addEventListener('storage', handleStorage);
    window.addEventListener('statsUpdated', handleStatsEvent);

    return () => {
      abort = true;
      clearInterval(interval);
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('statsUpdated', handleStatsEvent);
    };
  }, [detailsOpen, selectedStudent]);

  if (loading) {
    return (
      <div className="admin-dashboard-bg">
        <StarBackground />
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading students data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-bg">
      <StarBackground />
      <Header department={department} />
      
      <div className="dashboard-container">
        <div className="sidebar">
          <div className="admin-profile">
            <div className="profile-avatar">👨‍💼</div>
            <h3>Department Head</h3>
            <p className="admin-name">{department} Department</p>
            <p className="admin-role">Administrator</p>
          </div>
          
          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => handleTabChange('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => handleTabChange('students')}
            >
              👥 Students
            </button>
            <button 
              className={`nav-item ${activeTab === 'create-contest' ? 'active' : ''}`}
              onClick={() => handleTabChange('create-contest')}
            >
              🏆 Create Contest
            </button>
            <button 
              className={`nav-item ${activeTab === 'contest-report' ? 'active' : ''}`}
              onClick={() => handleTabChange('contest-report')}
            >
              📄 Contest Report
            </button>
            <button 
              className={`nav-item ${activeTab === 'verify' ? 'active' : ''}`}
              onClick={() => handleTabChange('verify')}
            >
              🔍 Verify Certificate
            </button>
          </nav>
        </div>

        <div className="main-content">
          {activeTab === 'overview' && (
            <div className="overview-section">
              <h2 className="section-title">Department Overview</h2>
              
              <div className="stats-grid">
                <StatCard 
                  icon="👥"
                  title="Total Students"
                  value={stats.total}
                  color="#4CAF50"
                  gradient="linear-gradient(135deg, #4CAF50 0%, #45a049 100%)"
                />
                <StatCard 
                  icon="🎓"
                  title="SY Students"
                  value={stats.sy}
                  color="#2196F3"
                  gradient="linear-gradient(135deg, #2196F3 0%, #1976D2 100%)"
                />
                <StatCard 
                  icon="📚"
                  title="TY Students"
                  value={stats.ty}
                  color="#FF9800"
                  gradient="linear-gradient(135deg, #FF9800 0%, #F57C00 100%)"
                />
                <StatCard 
                  icon="🎯"
                  title="BE Students"
                  value={stats.be}
                  color="#9C27B0"
                  gradient="linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%)"
                />
              </div>

              {/* Quick Actions removed as requested */}

              <div className="recent-registrations">
                <h3>Recent Registrations</h3>
                <div className="recent-list">
                  {students.slice(0, 5).map((student, index) => (
                    <div key={index} className="recent-item">
                      <div className="recent-avatar">👨‍🎓</div>
                      <div className="recent-info">
                        <p className="recent-name">
                          {student.first_name} {student.last_name}
                        </p>
                        <span className="recent-class">{student.class}</span>
                      </div>
                      <span className="recent-time">Today</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'students' && (
            <div className="students-section">
              <div className="section-header">
                <h2 className="section-title">Registered Students</h2>
              </div>

              <SearchAndFilter 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                filterClass={filterClass}
                setFilterClass={setFilterClass}
              />

              <div className="students-grid">
                {filteredStudents.length === 0 ? (
                  <div className="no-students">
                    <div className="no-students-icon">👥</div>
                    <h3>No students found</h3>
                    <p>No students match your search criteria</p>
                  </div>
                ) : (
                  filteredStudents.map((student, index) => (
                    <StudentCard key={index} student={student} index={index} onView={handleViewDetails} />
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'create-contest' && (
            <CreateContest />
          )}

          {activeTab === 'contest-report' && (
            <div className="reports-section">
              <h2 className="section-title">Contest Report</h2>
              <p className="section-subtitle">View per-student results for a contest</p>

              <div className="report-controls" style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16, flexWrap: 'wrap' }}>
                <select 
                  value={contestId}
                  onChange={(e) => setContestId(e.target.value)}
                  className="certificate-input"
                  style={{ maxWidth: 380 }}
                >
                  <option value="">Select a contest…</option>
                  {departmentContests.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title} • {new Date(c.start_date).toLocaleDateString()} • {c.problem_count || 0} problems
                    </option>
                  ))}
                </select>
                <button 
                  className="report-btn"
                  onClick={async () => {
                    if (!contestId) return;
                    setContestError('');
                    setContestLoading(true);
                    setContestResults([]);
                    setContestSubmissions([]);
                    try {
                      const sumRes = await fetch(`http://localhost:5000/api/contests/${contestId}/results`);
                      const sumJson = await sumRes.json();
                      setContestResults(Array.isArray(sumJson) ? sumJson : []);
                      // Raw submissions removed from report
                      setContestSubmissions([]);
                    } catch (e) {
                      setContestError('Failed to load contest report');
                    } finally {
                      setContestLoading(false);
                    }
                  }}
                  disabled={contestLoading}
                >
                  {contestLoading ? 'Loading…' : 'Load Report'}
                </button>
                {!contestId && (
                  <span style={{ color: '#bbb', fontSize: 12 }}>
                    Pick a contest to view reports.
                  </span>
                )}
                {contestResults.length > 0 ? (
                  <button
                    className="report-btn"
                    onClick={() => {
                      // Create a properly formatted PDF export
                      const contest = departmentContests.find(c => c.id === contestId);
                      const contestTitle = contest ? contest.title : 'Contest Report';
                      const contestDate = contest ? new Date(contest.start_date).toLocaleDateString() : '';
                      
                      const win = window.open('', '', 'height=800,width=1200');
                      win.document.write(`
                        <html>
                          <head>
                            <title>Contest Report - ${contestTitle}</title>
                            <style>
                              @page {
                                margin: 0.5in;
                                size: A4;
                              }
                              body {
                                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                                font-size: 12px;
                                line-height: 1.4;
                                color: #333;
                                margin: 0;
                                padding: 20px;
                                background: white;
                              }
                              .header {
                                text-align: center;
                                margin-bottom: 30px;
                                border-bottom: 2px solid #2563eb;
                                padding-bottom: 15px;
                              }
                              .header h1 {
                                margin: 0;
                                font-size: 24px;
                                color: #2563eb;
                                font-weight: bold;
                              }
                              .header .subtitle {
                                margin: 5px 0 0 0;
                                font-size: 14px;
                                color: #666;
                              }
                              .report-section {
                                margin-bottom: 30px;
                                page-break-inside: avoid;
                              }
                              .section-title {
                                font-size: 18px;
                                font-weight: bold;
                                color: #2563eb;
                                margin: 0 0 15px 0;
                                padding: 10px;
                                background: #f8fafc;
                                border-left: 4px solid #2563eb;
                              }
                              .table-container {
                                overflow: visible;
                                margin-bottom: 20px;
                              }
                              table {
                                width: 100%;
                                border-collapse: collapse;
                                margin-bottom: 20px;
                                font-size: 11px;
                              }
                              th {
                                background: #2563eb;
                                color: white;
                                padding: 8px 6px;
                                text-align: left;
                                font-weight: bold;
                                border: 1px solid #1d4ed8;
                              }
                              td {
                                padding: 6px;
                                border: 1px solid #e5e7eb;
                                vertical-align: top;
                              }
                              tr:nth-child(even) {
                                background: #f9fafb;
                              }
                              tr:hover {
                                background: #f3f4f6;
                              }
                              .student-name {
                                font-weight: bold;
                                color: #1f2937;
                              }
                              .student-email {
                                font-size: 10px;
                                color: #6b7280;
                                margin-top: 2px;
                              }
                              .points {
                                font-weight: bold;
                                color: #059669;
                              }
                              .correct {
                                color: #059669;
                                font-weight: bold;
                              }
                              .wrong {
                                color: #dc2626;
                                font-weight: bold;
                              }
                              .status-pass {
                                color: #059669;
                                font-weight: bold;
                              }
                              .status-fail {
                                color: #dc2626;
                                font-weight: bold;
                              }
                              .summary-stats {
                                display: flex;
                                justify-content: space-around;
                                margin: 20px 0;
                                padding: 15px;
                                background: #f8fafc;
                                border-radius: 8px;
                              }
                              .stat-item {
                                text-align: center;
                              }
                              .stat-value {
                                font-size: 18px;
                                font-weight: bold;
                                color: #2563eb;
                              }
                              .stat-label {
                                font-size: 12px;
                                color: #6b7280;
                                margin-top: 2px;
                              }
                              .footer {
                                margin-top: 30px;
                                text-align: center;
                                font-size: 10px;
                                color: #6b7280;
                                border-top: 1px solid #e5e7eb;
                                padding-top: 10px;
                              }
                            </style>
                          </head>
                          <body>
                            <div class="header">
                              <h1>Contest Report</h1>
                              <div class="subtitle">${contestTitle} • ${contestDate}</div>
                            </div>
                            
                            ${contestResults.length > 0 ? `
                              <div class="report-section">
                                <div class="section-title">📊 Contest Summary</div>
                                <div class="summary-stats">
                                  <div class="stat-item">
                                    <div class="stat-value">${contestResults.length}</div>
                                    <div class="stat-label">Total Students</div>
                                  </div>
                                </div>
                              </div>
                              
                              <div class="report-section">
                                <div class="section-title">👥 Student Results</div>
                                <div class="table-container">
                                  <table>
                                    <thead>
                                      <tr>
                                        <th style="width: 25%;">Student</th>
                                        <th style="width: 10%;">Points</th>
                                        <th style="width: 10%;">Correct</th>
                                        <th style="width: 10%;">Wrong</th>
                                        <th style="width: 12%;">Submissions</th>
                                        <th style="width: 15%;">Total Time</th>
                                        <th style="width: 18%;">Last Submission</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      ${contestResults.map((row, idx) => {
                                        const name = `${row.first_name || ''} ${row.last_name || ''}`.trim() || row.student_email;
                                        return `
                                          <tr>
                                            <td>
                                              <div class="student-name">${name}</div>
                                              <div class="student-email">${row.student_email}</div>
                                            </td>
                                            <td class="points">${row.points_earned || 0}</td>
                                            <td class="correct">${row.correct_count || 0}</td>
                                            <td class="wrong">${row.wrong_count || 0}</td>
                                            <td>${row.total_submissions || 0}</td>
                                            <td>${row.total_execution_ms ? (row.total_execution_ms / 1000).toFixed(2) + 's' : '-'}</td>
                                            <td>${row.last_submission_at ? new Date(row.last_submission_at).toLocaleString() : '-'}</td>
                                          </tr>
                                        `;
                                      }).join('')}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ` : ''}
                            
                            
                            
                            <div class="footer">
                              Generated on ${new Date().toLocaleString()} | Contest Management System
                            </div>
                          </body>
                        </html>
                      `);
                      win.document.close();
                      win.focus();
                      win.print();
                      win.close();
                    }}
                    disabled={contestLoading}
                  >
                    📄 Export PDF
                  </button>
                ) : null}
                {contestError && <span className="error-message">{contestError}</span>}
              </div>

              {contestResults.length > 0 && (
                <div className="report-card">
                  <div className="report-icon">👥</div>
                  <h3>Per-student Summary</h3>
                  <div className="students-table-wrapper">
                    <table className="students-table">
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>Points</th>
                          <th>Correct</th>
                          <th>Wrong</th>
                          <th>Total Submissions</th>
                          <th>Total Time (ms)</th>
                          <th>Last Submission</th>
                        </tr>
                      </thead>
                      <tbody>
                        {contestResults.map((row, idx) => {
                          const name = `${row.first_name || ''} ${row.last_name || ''}`.trim() || row.student_email;
                          return (
                            <tr key={idx}>
                              <td>{name}<div style={{ color: '#888', fontSize: 12 }}>{row.student_email}</div></td>
                              <td>{row.points_earned}</td>
                              <td>{row.correct_count}</td>
                              <td>{row.wrong_count}</td>
                              <td>{row.total_submissions}</td>
                              <td>{row.total_execution_ms}</td>
                              <td>{row.last_submission_at ? new Date(row.last_submission_at).toLocaleString() : '-'}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Raw submissions section removed as requested */}
            </div>
          )}

          {activeTab === 'verify' && (
            <div className="verification-section">
              <h2 className="section-title">Certificate Verification</h2>
              <p className="section-subtitle">Verify student achievement certificates using 8-digit certificate IDs</p>
              
              <div className="verification-container">
                <div className="verification-form">
                  <div className="form-group">
                    <label htmlFor="certificateId">Certificate ID</label>
                    <input
                      type="text"
                      id="certificateId"
                      placeholder="Enter 8-digit certificate ID (e.g., 12345678)"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      className="certificate-input"
                      maxLength="8"
                    />
                  </div>
                  
                  <button 
                    className="verify-btn"
                    onClick={handleVerifyCertificate}
                    disabled={verificationLoading}
                  >
                    {verificationLoading ? 'Verifying...' : '🔍 Verify Certificate'}
                  </button>
                  
                  {verificationError && (
                    <div className="error-message">{verificationError}</div>
                  )}
                </div>

                {verificationResult && (
                  <div className="verification-result">
                    <div className="result-header">
                      <h3>Verification Result</h3>
                      <div className={`status-badge ${verificationResult.isValid ? 'valid' : 'invalid'}`}>
                        {verificationResult.isValid ? '✅ Valid Certificate' : '❌ Invalid Certificate'}
                      </div>
                    </div>
                    
                    <div className="result-details">
                      <div className="detail-row">
                        <span className="detail-label">Certificate ID:</span>
                        <span className="detail-value">{verificationResult.certificateId}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Student Name:</span>
                        <span className="detail-value">{verificationResult.studentName}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Student Email:</span>
                        <span className="detail-value">{verificationResult.studentEmail}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Badge Type:</span>
                        <span className="detail-value">{verificationResult.badgeType}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Badge Tier:</span>
                        <span className="detail-value">{verificationResult.badgeTier}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Achievement Value:</span>
                        <span className="detail-value">{verificationResult.achievementValue}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Description:</span>
                        <span className="detail-value">{verificationResult.description}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Verification Status:</span>
                        <span className={`detail-value ${verificationResult.isVerified ? 'verified' : 'unverified'}`}>
                          {verificationResult.isVerified ? '✅ Verified' : '⏳ Pending Verification'}
                        </span>
                      </div>
                      {verificationResult.verifiedAt && (
                        <div className="detail-row">
                          <span className="detail-label">Verified On:</span>
                          <span className="detail-value">{verificationResult.verifiedAt}</span>
                        </div>
                      )}
                      {verificationResult.verifiedBy && (
                        <div className="detail-row">
                          <span className="detail-label">Verified By:</span>
                          <span className="detail-value">{verificationResult.verifiedBy}</span>
                        </div>
                      )}
                      <div className="detail-row">
                        <span className="detail-label">Issued Date:</span>
                        <span className="detail-value">{verificationResult.issuedDate}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Department:</span>
                        <span className="detail-value">{verificationResult.department}</span>
                      </div>
                    </div>
                    
                    <div className="result-actions">
                      <button 
                        className="action-btn secondary"
                        onClick={() => {
                          setVerificationResult(null);
                          setCertificateId('');
                        }}
                      >
                        Verify Another
                      </button>
                      {verificationResult.isValid && !verificationResult.isVerified && (
                        <button 
                          className="action-btn verify"
                          onClick={async () => {
                            try {
                              const response = await fetch(`http://localhost:5000/api/badges/verify/${verificationResult.certificateId}`, {
                                method: 'POST',
                                headers: {
                                  'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                  verifiedBy: 'Department Head',
                                  verificationNotes: 'Verified by department authority'
                                })
                              });
                              
                              if (response.ok) {
                                alert('✅ Badge verified successfully!');
                                // Refresh the verification result
                                handleVerifyCertificate();
                              } else {
                                alert('❌ Failed to verify badge. Please try again.');
                              }
                            } catch (error) {
                              console.error('Error verifying badge:', error);
                              alert('❌ Error verifying badge. Please try again.');
                            }
                          }}
                        >
                          ✅ Mark as Verified
                        </button>
                      )}
                      <button className="action-btn primary">
                        📄 Print Certificate
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {detailsOpen && (
        <div className="modal-overlay" onClick={() => setDetailsOpen(false)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Student Details</h3>
              <button className="modal-close" onClick={() => setDetailsOpen(false)}>×</button>
            </div>
            {!selectedStudent ? (
              <div>Loading...</div>
            ) : (
              <div className="modal-content">
                <div className="modal-row"><strong>Name:</strong> {selectedStudent.first_name} {selectedStudent.middle_name} {selectedStudent.last_name}</div>
                <div className="modal-row"><strong>Email:</strong> {selectedStudent.email}</div>
                <div className="modal-row"><strong>PRN:</strong> {selectedStudent.prn}</div>
                <div className="modal-row"><strong>Class:</strong> {selectedStudent.class}</div>
                <div className="modal-row"><strong>Branch:</strong> {selectedStudent.branch}</div>
                <hr />
                {detailsLoading ? (
                  <div>Loading stats…</div>
                ) : detailsError ? (
                  <div className="error">{detailsError}</div>
                ) : selectedStats ? (
                  <div className="stats-grid mini">
                    <div className="stat-card mini">
                      <div className="stat-content">
                        <h4>Problems Solved</h4>
                        <p className="stat-value">{selectedStats.totalSolved}</p>
                      </div>
                    </div>
                    <div className="stat-card mini">
                      <div className="stat-content">
                        <h4>Total Points</h4>
                        <p className="stat-value">{selectedStats.totalPoints}</p>
                      </div>
                    </div>
                    <div className="stat-card mini">
                      <div className="stat-content">
                        <h4>Current Streak</h4>
                        <p className="stat-value">{selectedStats.currentStreak}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>No stats available.</div>
                )}
              </div>
            )}
            <div className="modal-footer">
              <button className="action-btn" onClick={() => setDetailsOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}