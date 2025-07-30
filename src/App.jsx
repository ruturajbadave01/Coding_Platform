import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Login from './components/Login';
import StudentDashboard from './components/StudentDashboard';
import AdminDashboard from './components/AdminDashboard';
import TPODashboard from './components/TPODashboard';
import './App.css';

// Protected Route Component
function StudentProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('studentLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" />;
}

// Admin Protected Route Component
function AdminProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" />;
}

// TPO Protected Route Component
function TPOProtectedRoute({ children }) {
  const isLoggedIn = localStorage.getItem('tpoLoggedIn') === 'true';
  return isLoggedIn ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
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
    </Router>
  );
}

// Clear login status on app load
localStorage.removeItem('studentLoggedIn');
localStorage.removeItem('adminLoggedIn');
localStorage.removeItem('tpoLoggedIn');

export default App;
