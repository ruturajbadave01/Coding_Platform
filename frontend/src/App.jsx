import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import TPODashboard from './components/TPODashboard';
import Footer from './components/Footer';
import './App.css';

// Protected Route Component
function StudentProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('studentLoggedIn') === 'true';
  const userEmail = localStorage.getItem('userEmail');
  return (isLoggedIn && userEmail) ? children : <Navigate to="/login" />;
}

// Admin Protected Route Component
function AdminProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  const userEmail = localStorage.getItem('userEmail');
  return (isLoggedIn && userEmail) ? children : <Navigate to="/login" />;
}

// TPO Protected Route Component
function TPOProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('tpoLoggedIn') === 'true';
  const userEmail = localStorage.getItem('userEmail');
  return (isLoggedIn && userEmail) ? children : <Navigate to="/login" />;
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
