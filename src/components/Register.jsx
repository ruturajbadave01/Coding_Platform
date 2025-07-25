import React, { useState, useEffect, useRef } from 'react';
import './Register.css';

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

    const STAR_COUNT = 90;
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
            ctx.strokeStyle = 'rgba(255,255,255,0.13)';
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

const CLASSES = ['SY', 'TY', 'BE'];
const BRANCHES = [
  'CSE',
  'AIDS',
  'ENTC',
  'MECHANICAL',
  'ELECTRICAL',
  'CIVIL',
];

export default function Register() {
  const [form, setForm] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    prn: '',
    className: CLASSES[0],
    branch: BRANCHES[0],
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    const newErrors = {};
    if (!form.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!form.middleName.trim()) newErrors.middleName = 'Middle name is required';
    if (!form.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    if (!form.prn.trim()) newErrors.prn = 'PRN number is required';
    if (!/^\d{10,12}$/.test(form.prn.trim())) newErrors.prn = 'PRN number must be 10-12 digits';
    if (!form.className) newErrors.className = 'Class is required';
    if (!form.branch) newErrors.branch = 'Branch is required';
    if (!form.password) newErrors.password = 'Password is required';
    if (form.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    return newErrors;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      const payload = {
        first_name: form.firstName,
        middle_name: form.middleName,
        last_name: form.lastName,
        email: form.email,
        prn: form.prn,
        class: form.className,
        branch: form.branch,
        password: form.password,
      };
      fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.message) {
            setSubmitted(true);
            // Clear all fields
            setForm({
              firstName: '',
              middleName: '',
              lastName: '',
              email: '',
              prn: '',
              className: CLASSES[0],
              branch: BRANCHES[0],
              password: '',
              confirmPassword: '',
            });
          } else {
            setErrors({ api: data.error || "Registration failed" });
          }
        })
        .catch(() => setErrors({ api: "Network error" }));
    }
  }

  return (
    <div className="register-bg">
      <StarBackground />
      <form className="register-form" onSubmit={handleSubmit} autoComplete="off">
        <h2>Student Registration</h2>
        {submitted && <div className="success-msg">Registration successful!</div>}
        <div className="form-row">
          <div className="form-group">
            <label>First Name*</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} />
            {errors.firstName && <span className="error">{errors.firstName}</span>}
          </div>
          <div className="form-group">
            <label>Middle Name*</label>
            <input name="middleName" value={form.middleName} onChange={handleChange} />
            {errors.middleName && <span className="error">{errors.middleName}</span>}
          </div>
          <div className="form-group">
            <label>Last Name*</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} />
            {errors.lastName && <span className="error">{errors.lastName}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Email Address*</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} />
            {errors.email && <span className="error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label>PRN Number*</label>
            <input name="prn" value={form.prn} onChange={handleChange} placeholder="e.g. 2211198101" autoComplete="username" />
            {errors.prn && <span className="error">{errors.prn}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Class*</label>
            <select name="className" value={form.className} onChange={handleChange}>
              {CLASSES.map((cls) => (
                <option key={cls} value={cls}>{cls}</option>
              ))}
            </select>
            {errors.className && <span className="error">{errors.className}</span>}
          </div>
          <div className="form-group">
            <label>Branch*</label>
            <select name="branch" value={form.branch} onChange={handleChange}>
              {BRANCHES.map((br) => (
                <option key={br} value={br}>{br}</option>
              ))}
            </select>
            {errors.branch && <span className="error">{errors.branch}</span>}
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Password*</label>
            <input name="password" type="password" value={form.password} onChange={handleChange} autoComplete="new-password" />
            {errors.password && <span className="error">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label>Confirm Password*</label>
            <input name="confirmPassword" type="password" value={form.confirmPassword} onChange={handleChange} autoComplete="new-password" />
            {errors.confirmPassword && <span className="error">{errors.confirmPassword}</span>}
          </div>
        </div>
        {errors.api && <div className="error">{errors.api}</div>}
        <button className="register-btn" type="submit">Register</button>
      </form>
    </div>
  );
}

