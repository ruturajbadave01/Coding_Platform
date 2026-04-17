import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import TPODashboard from './components/TPODashboard';
import Footer from './components/Footer';
import { validateSession, forceLogout } from './utils/sessionManager';
import './App.css';

// Protected Route Component
function StudentProtectedRoute({ children }) {
  const location = useLocation();
  
  // Check if session is valid
  if (!validateSession('student')) {
    // Clear any invalid session data
    forceLogout();
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// Admin Protected Route Component
function AdminProtectedRoute({ children }) {
  const location = useLocation();
  
  // Check if session is valid
  if (!validateSession('admin')) {
    // Clear any invalid session data
    forceLogout();
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

// TPO Protected Route Component
function TPOProtectedRoute({ children }) {
  const location = useLocation();
  
  // Check if session is valid
  if (!validateSession('tpo')) {
    // Clear any invalid session data
    forceLogout();
    return <Navigate to="/login" replace />;
  }
  
  return children;
}

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/student-dashboard"
            element={
              <StudentProtectedRoute>
                <StudentDashboard />
              </StudentProtectedRoute>
            }
          />
          <Route
            path="/admin-dashboard"
            element={
              <AdminProtectedRoute>
                <AdminDashboard />
              </AdminProtectedRoute>
            }
          />
          <Route
            path="/tpo-dashboard"
            element={
              <TPOProtectedRoute>
                <TPODashboard />
              </TPOProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </Router>
  );
}

// Don't clear login status on app load - this allows users to stay logged in after refresh

export default App;
