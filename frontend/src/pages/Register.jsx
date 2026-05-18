// src/pages/Register.jsx - HR/Admin Registration Page
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'hr' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await register(form.name, form.email, form.password, form.role);
      toast.success('Account created successfully! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card slide-in">
        <div className="auth-logo">
          <div className="auth-logo-icon">🚀</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join EmpAnalytica as HR or Admin</p>
        </div>

        <form onSubmit={handleSubmit} noValidate id="register-form">
          <div className="form-group">
            <label className="form-label" htmlFor="reg-name">Full Name</label>
            <input
              id="reg-name" name="name" className="form-input"
              placeholder="John Doe"
              value={form.name} onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Email Address</label>
            <input
              id="reg-email" name="email" type="email" className="form-input"
              placeholder="admin@company.com"
              value={form.email} onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Password</label>
            <input
              id="reg-password" name="password" type="password" className="form-input"
              placeholder="Min. 6 characters"
              value={form.password} onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-role">Role</label>
            <select id="reg-role" name="role" className="form-select" value={form.role} onChange={handleChange}>
              <option value="hr">HR Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <button
            type="submit" className="btn btn-primary btn-lg btn-full"
            disabled={loading} id="register-submit-btn"
          >
            {loading ? '⏳ Creating...' : '✅ Create Account'}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
