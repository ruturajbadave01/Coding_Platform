import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

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

    const STAR_COUNT = 80;
    const stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
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
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(stars[i].x, stars[i].y);
            ctx.lineTo(stars[j].x, stars[j].y);
            ctx.strokeStyle = 'rgba(255,255,255,0.15)';
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

const DEPARTMENTS = [
  'CSE',
  'AIDS',
  'ENTC',
  'MECHANICAL',
  'ELECTRICAL',
  'CIVIL',
];

export default function Login() {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [form, setForm] = useState({
    email: '',
    password: '',
    department: DEPARTMENTS[0],
    tpoUsername: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleRoleChange(e) {
    setRole(e.target.value);
    setErrors({});
    setSubmitted(false);
  }

  function validate() {
    const newErrors = {};
    if (role === 'student') {
      if (!form.email.trim()) newErrors.email = 'Email is required';
      if (!form.password) newErrors.password = 'Password is required';
    } else if (role === 'department') {
      if (!form.department) newErrors.department = 'Department is required';
      if (!form.password) newErrors.password = 'Password is required';
    } else if (role === 'tpo') {
      if (!form.tpoUsername.trim()) newErrors.tpoUsername = 'Username is required';
      if (!form.password) newErrors.password = 'Password is required';
    }
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      if (role === 'student') {
        fetch('http://localhost:5000/api/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: form.email, password: form.password }),
        })
          .then(res => res.json())
          .then(data => {
            if (data.message) {
              localStorage.setItem('studentLoggedIn', 'true');
              setTimeout(() => {
                navigate('/student-dashboard');
              }, 1000);
            } else {
              setErrors({ api: data.error || 'Login failed' });
              setSubmitted(false);
            }
          })
          .catch(() => {
            setErrors({ api: 'Network error' });
            setSubmitted(false);
          });
      } else if (role === 'department') {
        fetch('http://localhost:5000/api/department-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ department: form.department, password: form.password }),
        })
          .then(res => res.json())
          .then(data => {
            if (data.message) {
              localStorage.setItem('adminLoggedIn', 'true');
              localStorage.setItem('adminDepartment', form.department);
              setTimeout(() => {
                navigate('/admin-dashboard');
              }, 1000);
            } else {
              setErrors({ api: data.error || 'Login failed' });
              setSubmitted(false);
            }
          })
          .catch(() => {
            setErrors({ api: 'Network error' });
            setSubmitted(false);
          });
      } else if (role === 'tpo') {
        fetch('http://localhost:5000/api/tpo-login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ tpoUsername: form.tpoUsername, password: form.password }),
        })
          .then(res => res.json())
          .then(data => {
            if (data.message) {
              localStorage.setItem('tpoLoggedIn', 'true');
              setTimeout(() => {
                navigate('/tpo-dashboard');
              }, 1000);
            } else {
              setErrors({ api: data.error || 'Login failed' });
              setSubmitted(false);
            }
          })
          .catch(() => {
            setErrors({ api: 'Network error' });
            setSubmitted(false);
          });
      }
    }
  }

  return (
    <div className="login-bg">
      <StarBackground />
      <form className="login-form" onSubmit={handleSubmit} autoComplete="off">
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1em' }}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/register" className="nav-link">Register</Link>
        </div>
        <h2>Login</h2>
        <div className="form-group">
          <label>Login as</label>
          <select name="role" value={role} onChange={handleRoleChange} className="role-select">
            <option value="student">Student</option>
            <option value="department">Department</option>
            <option value="tpo">TPO</option>
          </select>
        </div>
        {role === 'student' && (
          <>
            <div className="form-group">
              <label>Email Address</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} />
              {errors.email && <span className="error">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
          </>
        )}
        {role === 'department' && (
          <>
            <div className="form-group">
              <label>Department</label>
              <select name="department" value={form.department} onChange={handleChange}>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
              {errors.department && <span className="error">{errors.department}</span>}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
          </>
        )}
        {role === 'tpo' && (
          <>
            <div className="form-group">
              <label>TPO Username</label>
              <input name="tpoUsername" value={form.tpoUsername} onChange={handleChange} />
              {errors.tpoUsername && <span className="error">{errors.tpoUsername}</span>}
            </div>
            <div className="form-group">
              <label>Password</label>
              <input name="password" type="password" value={form.password} onChange={handleChange} />
              {errors.password && <span className="error">{errors.password}</span>}
            </div>
          </>
        )}
        <button className="login-btn" type="submit">Login</button>
        {errors.api && <div className="error">{errors.api}</div>}
        {submitted && <div className="success-msg">Login successful!</div>}
      </form>
    </div>
  );
}
