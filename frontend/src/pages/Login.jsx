// src/pages/Login.jsx - HR/Admin Login Page
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card slide-in">
        <div className="auth-logo">
          <div className="auth-logo-icon">⚡</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to EmpAnalytica HR Portal</p>
        </div>

        <form onSubmit={handleSubmit} noValidate id="login-form">
          <div className="form-group">
            <label className="form-label" htmlFor="login-email">Email Address</label>
            <input
              id="login-email" name="email" type="email"
              className="form-input" placeholder="admin@company.com"
              value={form.email} onChange={handleChange} autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="login-password">Password</label>
            <input
              id="login-password" name="password" type="password"
              className="form-input" placeholder="Enter your password"
              value={form.password} onChange={handleChange} autoComplete="current-password"
            />
          </div>

          <button
            type="submit" className="btn btn-primary btn-lg btn-full"
            disabled={loading} id="login-submit-btn"
            style={{ marginTop: '0.5rem' }}
          >
            {loading ? '⏳ Signing in...' : '🔐 Sign In'}
          </button>
        </form>

        <div className="auth-divider">or</div>

        <p style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ color: 'var(--primary-light)', textDecoration: 'none', fontWeight: 600 }}>
            Create account →
          </Link>
        </p>

        {/* Demo credentials hint */}
        <div style={{
          marginTop: '1.5rem', padding: '0.875rem', borderRadius: 'var(--radius)',
          background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
          fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'center'
        }}>
          🔑 Register first to create your HR admin account
        </div>
      </div>
    </div>
  );
};

export default Login;
