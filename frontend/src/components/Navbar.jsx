// src/components/Navbar.jsx - Top navigation bar
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner">
        <Link to="/dashboard" className="navbar-brand">
          ⚡ EmpAnalytica
        </Link>

        <div className="navbar-links">
          {user ? (
            <>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginRight: '0.5rem' }}>
                👋 {user.name}
                <span className="badge badge-primary" style={{ marginLeft: '0.5rem' }}>
                  {user.role?.toUpperCase()}
                </span>
              </span>
              <button className="btn btn-secondary btn-sm" onClick={handleLogout} id="logout-btn">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
