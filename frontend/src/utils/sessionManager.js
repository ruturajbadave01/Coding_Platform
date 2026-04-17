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

// Validate session for specific role
export function validateSession(requiredRole) {
  if (requiredRole === 'student') {
    const isLoggedIn = localStorage.getItem('studentLoggedIn') === 'true';
    const hasEmail = !!localStorage.getItem('userEmail');
    return isLoggedIn && hasEmail;
  }
  
  if (requiredRole === 'admin') {
    return localStorage.getItem('adminLoggedIn') === 'true';
  }
  
  if (requiredRole === 'tpo') {
    return localStorage.getItem('tpoLoggedIn') === 'true';
  }
  
  return false;
}

// Clear all session data
export function clearSession() {
  localStorage.removeItem('studentLoggedIn');
  localStorage.removeItem('adminLoggedIn');
  localStorage.removeItem('tpoLoggedIn');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('adminDepartment');
  localStorage.removeItem('tpoUsername');
  
  // Clear any session timer
  if (sessionTimer) {
    clearTimeout(sessionTimer);
    sessionTimer = null;
  }
}

// Manual logout with proper cleanup
export function logout() {
  clearSession();
  
  // Redirect to login page
  window.location.href = '/login';
}

// Force logout and prevent back navigation
export function forceLogout() {
  clearSession();
  
  // Replace current history entry to prevent back navigation
  window.history.replaceState(null, '', '/login');
  window.location.href = '/login';
}

// Check if user should be redirected away from login page
export function shouldRedirectFromLogin() {
  const isStudent = localStorage.getItem('studentLoggedIn') === 'true' && !!localStorage.getItem('userEmail');
  const isAdmin = localStorage.getItem('adminLoggedIn') === 'true';
  const isTpo = localStorage.getItem('tpoLoggedIn') === 'true';
  
  return {
    shouldRedirect: isStudent || isAdmin || isTpo,
    redirectTo: isStudent ? '/student-dashboard' : isAdmin ? '/admin-dashboard' : isTpo ? '/tpo-dashboard' : null
  };
}

// Prevent back navigation to login when user is logged in
export function preventBackToLogin(navigate) {
  const handlePopState = () => {
    const { shouldRedirect, redirectTo } = shouldRedirectFromLogin();
    if (shouldRedirect && redirectTo) {
      navigate(redirectTo, { replace: true });
    }
  };
  
  window.addEventListener('popstate', handlePopState);
  
  return () => {
    window.removeEventListener('popstate', handlePopState);
  };
}
