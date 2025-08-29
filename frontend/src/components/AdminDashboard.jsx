import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import collegeLogo from '../assets/college-logo.jpeg';
import CreateContest from './CreateContest';
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
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminDepartment');
    navigate('/login');
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

function StudentCard({ student, index }) {
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
        <button className="action-btn view">View Details</button>
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

  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

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
  }, [department, navigate]);

  useEffect(() => {
    const fetchStudents = () => {
      fetch('http://localhost:5000/api/students')
        .then(res => res.json())
        .then(data => setStudents(data))
        .catch(() => setStudents([]));
    };
    fetchStudents();
    const interval = setInterval(fetchStudents, 5000); // refresh every 5 seconds
    return () => clearInterval(interval);
  }, []);

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
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button 
              className={`nav-item ${activeTab === 'students' ? 'active' : ''}`}
              onClick={() => setActiveTab('students')}
            >
              👥 Students
            </button>
            <button 
              className={`nav-item ${activeTab === 'create-contest' ? 'active' : ''}`}
              onClick={() => setActiveTab('create-contest')}
            >
              🏆 Create Contest
            </button>
            <button 
              className={`nav-item ${activeTab === 'analytics' ? 'active' : ''}`}
              onClick={() => setActiveTab('analytics')}
            >
              📈 Analytics
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
                </div>
              </div>

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
                <div className="header-actions">
                  <button className="export-btn">📊 Export</button>
                  <button className="add-btn">➕ Add Student</button>
                </div>
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
                    <StudentCard key={index} student={student} index={index} />
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="analytics-section">
              <h2 className="section-title">Analytics & Insights</h2>
              
              <div className="analytics-grid">
                <div className="analytics-card">
                  <h3>Class Distribution</h3>
                  <div className="chart-container">
                    <div className="pie-chart">
                      <div className="chart-segment sy" style={{ transform: `rotate(${(stats.sy / stats.total) * 360}deg)` }}>
                        <span>SY: {stats.sy}</span>
                      </div>
                      <div className="chart-segment ty" style={{ transform: `rotate(${(stats.ty / stats.total) * 360}deg)` }}>
                        <span>TY: {stats.ty}</span>
                      </div>
                      <div className="chart-segment be" style={{ transform: `rotate(${(stats.be / stats.total) * 360}deg)` }}>
                        <span>BE: {stats.be}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="analytics-card">
                  <h3>Registration Trends</h3>
                  <div className="trend-chart">
                    <div className="trend-bar" style={{ height: '60%' }}></div>
                    <div className="trend-bar" style={{ height: '80%' }}></div>
                    <div className="trend-bar" style={{ height: '45%' }}></div>
                    <div className="trend-bar" style={{ height: '90%' }}></div>
                    <div className="trend-bar" style={{ height: '75%' }}></div>
                    <div className="trend-bar" style={{ height: '85%' }}></div>
                  </div>
                  <p>Monthly registrations</p>
                </div>

                <div className="analytics-card">
                  <h3>Department Performance</h3>
                  <div className="performance-metrics">
                    <div className="metric">
                      <span className="metric-label">Total Students</span>
                      <span className="metric-value">{stats.total}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Active Students</span>
                      <span className="metric-value">{Math.floor(stats.total * 0.85)}</span>
                    </div>
                    <div className="metric">
                      <span className="metric-label">Completion Rate</span>
                      <span className="metric-value">85%</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'create-contest' && (
            <CreateContest />
          )}

          {activeTab === 'reports' && (
            <div className="reports-section">
              <h2 className="section-title">Reports & Documents</h2>
              
              <div className="reports-grid">
                <div className="report-card">
                  <div className="report-icon">📊</div>
                  <h3>Student Directory</h3>
                  <p>Complete list of all registered students</p>
                  <button className="report-btn">Generate Report</button>
                </div>

                <div className="report-card">
                  <div className="report-icon">📈</div>
                  <h3>Analytics Report</h3>
                  <p>Detailed analytics and insights</p>
                  <button className="report-btn">Generate Report</button>
                </div>

                <div className="report-card">
                  <div className="report-icon">📋</div>
                  <h3>Class-wise Report</h3>
                  <p>Students grouped by class</p>
                  <button className="report-btn">Generate Report</button>
                </div>

                <div className="report-card">
                  <div className="report-icon">📧</div>
                  <h3>Communication List</h3>
                  <p>Email addresses for notifications</p>
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