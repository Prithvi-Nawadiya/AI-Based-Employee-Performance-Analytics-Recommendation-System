// src/components/Sidebar.jsx - Left sidebar navigation
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const navItems = [
  { to: '/dashboard', icon: '📊', label: 'Dashboard' },
  { to: '/employees', icon: '👥', label: 'Employees' },
  { to: '/add-employee', icon: '➕', label: 'Add Employee' },
  { to: '/ai-recommendations', icon: '🤖', label: 'AI Insights' },
  { to: '/rankings', icon: '🏆', label: 'Rankings' },
];

const Sidebar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      {navItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
          id={`sidebar-${item.label.toLowerCase().replace(/\s+/g, '-')}`}
        >
          <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
          {item.label}
        </NavLink>
      ))}

      <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid var(--border)' }}>
        <button className="sidebar-item" onClick={handleLogout} id="sidebar-logout" style={{ color: 'var(--danger)' }}>
          <span>🚪</span> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
