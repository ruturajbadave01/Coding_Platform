// Session management utility
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds
let sessionTimer = null;

// Initialize session management
export function initializeSession() {
  // Reset timer on any user activity
  const resetTimer = () => {
    if (sessionTimer) {
      clearTimeout(sessionTimer);
    }
    sessionTimer = setTimeout(logout, SESSION_TIMEOUT);
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem('studentLoggedIn');
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('tpoLoggedIn');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('adminDepartment');
    
    // Redirect to login page
    window.location.href = '/login';
  };

  // Add event listeners for user activity
  const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click'];
  events.forEach(event => {
    document.addEventListener(event, resetTimer, true);
  });

  // Start the timer
  resetTimer();

  // Return cleanup function
  return () => {
    if (sessionTimer) {
      clearTimeout(sessionTimer);
    }
    events.forEach(event => {
      document.removeEventListener(event, resetTimer, true);
    });
  };
}

// Check if user is logged in
export function isLoggedIn() {
  const studentLoggedIn = localStorage.getItem('studentLoggedIn') === 'true';
  const adminLoggedIn = localStorage.getItem('adminLoggedIn') === 'true';
  const tpoLoggedIn = localStorage.getItem('tpoLoggedIn') === 'true';
  const userEmail = localStorage.getItem('userEmail');

  return (studentLoggedIn && userEmail) || adminLoggedIn || tpoLoggedIn;
}

// Get user role
export function getUserRole() {
  if (localStorage.getItem('studentLoggedIn') === 'true') {
    return 'student';
  } else if (localStorage.getItem('adminLoggedIn') === 'true') {
    return 'admin';
  } else if (localStorage.getItem('tpoLoggedIn') === 'true') {
    return 'tpo';
  }
  return null;
}

// Manual logout
export function logout() {
  localStorage.removeItem('studentLoggedIn');
  localStorage.removeItem('adminLoggedIn');
  localStorage.removeItem('tpoLoggedIn');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('adminDepartment');
  
  // Redirect to login page
  window.location.href = '/login';
}
