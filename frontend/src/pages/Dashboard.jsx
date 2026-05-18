// src/pages/Dashboard.jsx - Analytics overview with stats and charts
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';

const StatCard = ({ icon, label, value, color, sub }) => (
  <div className="card stat-card">
    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{icon}</div>
    <div className="stat-value" style={{ backgroundImage: color }}>{value}</div>
    <div className="stat-label">{label}</div>
    {sub && <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{sub}</div>}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, avgScore: 0, departments: 0, aiAnalyzed: 0 });
  const [topEmployees, setTopEmployees] = useState([]);
  const [deptBreakdown, setDeptBreakdown] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await api.get('/employees');
        const employees = data.data || [];

        // Compute stats
        const total = employees.length;
        const avgScore = total
          ? (employees.reduce((s, e) => s + e.performanceScore, 0) / total).toFixed(1)
          : 0;
        const departments = [...new Set(employees.map((e) => e.department))].length;
        const aiAnalyzed = employees.filter((e) => e.aiRecommendation).length;

        setStats({ total, avgScore, departments, aiAnalyzed });
        setTopEmployees(employees.slice(0, 5));

        // Department breakdown
        const deptMap = {};
        employees.forEach((e) => {
          if (!deptMap[e.department]) deptMap[e.department] = { count: 0, totalScore: 0 };
          deptMap[e.department].count++;
          deptMap[e.department].totalScore += e.performanceScore;
        });
        const breakdown = Object.entries(deptMap).map(([dept, val]) => ({
          department: dept,
          count: val.count,
          avgScore: (val.totalScore / val.count).toFixed(1)
        })).sort((a, b) => b.avgScore - a.avgScore);
        setDeptBreakdown(breakdown);
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getScoreColor = (score) => {
    if (score >= 75) return 'var(--success)';
    if (score >= 50) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content">
        {/* Header */}
        <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">📊 Dashboard</h1>
            <p className="page-subtitle">Welcome back, {user?.name} • {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <Link to="/add-employee" className="btn btn-primary" id="dash-add-btn">➕ Add Employee</Link>
            <Link to="/ai-recommendations" className="btn btn-secondary" id="dash-ai-btn">🤖 AI Insights</Link>
          </div>
        </div>

        {loading ? (
          <div className="loading-overlay"><div className="spinner" /><p>Loading analytics...</p></div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid-4" style={{ marginBottom: '2rem' }}>
              <StatCard icon="👥" label="Total Employees" value={stats.total}
                color="linear-gradient(135deg, #6366f1, #818cf8)"
                sub="Active workforce" />
              <StatCard icon="📈" label="Avg Performance" value={`${stats.avgScore}%`}
                color="linear-gradient(135deg, #06b6d4, #67e8f9)"
                sub="Across all employees" />
              <StatCard icon="🏢" label="Departments" value={stats.departments}
                color="linear-gradient(135deg, #f59e0b, #fcd34d)"
                sub="Active divisions" />
              <StatCard icon="🤖" label="AI Analyzed" value={stats.aiAnalyzed}
                color="linear-gradient(135deg, #10b981, #6ee7b7)"
                sub="With AI recommendations" />
            </div>

            <div className="grid-2" style={{ marginBottom: '2rem' }}>
              {/* Top Performers */}
              <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                  <h3 style={{ color: 'var(--text-primary)' }}>🏆 Top Performers</h3>
                  <Link to="/rankings" className="btn btn-secondary btn-sm" id="dash-view-rankings">View All</Link>
                </div>
                {topEmployees.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">👤</div>
                    <p className="empty-state-title">No employees yet</p>
                    <Link to="/add-employee" className="btn btn-primary btn-sm" style={{ marginTop: '1rem' }}>Add First Employee</Link>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {topEmployees.map((emp, i) => (
                      <div key={emp._id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', borderRadius: 'var(--radius)', background: 'var(--bg-glass)' }}>
                        <div className={`rank-badge ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-default'}`}>{i + 1}</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{emp.name}</p>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{emp.department}</p>
                        </div>
                        <div style={{ fontWeight: 700, fontSize: '0.9rem', color: getScoreColor(emp.performanceScore) }}>
                          {emp.performanceScore}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Department Breakdown */}
              <div className="card">
                <h3 style={{ color: 'var(--text-primary)', marginBottom: '1.25rem' }}>🏢 Department Overview</h3>
                {deptBreakdown.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-state-icon">📂</div>
                    <p className="empty-state-title">No department data yet</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {deptBreakdown.map((dept) => (
                      <div key={dept.department}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 500 }}>{dept.department}</span>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {dept.count} emp • {dept.avgScore} avg
                          </span>
                        </div>
                        <div className="progress-bar">
                          <div
                            className={`progress-fill ${dept.avgScore >= 75 ? 'progress-high' : dept.avgScore >= 50 ? 'progress-medium' : 'progress-low'}`}
                            style={{ width: `${dept.avgScore}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="card">
              <h3 style={{ marginBottom: '1.25rem', color: 'var(--text-primary)' }}>⚡ Quick Actions</h3>
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <Link to="/add-employee" className="btn btn-primary" id="qa-add">➕ Add Employee</Link>
                <Link to="/employees" className="btn btn-secondary" id="qa-list">👥 View All</Link>
                <Link to="/ai-recommendations" className="btn btn-secondary" id="qa-ai">🤖 AI Analysis</Link>
                <Link to="/rankings" className="btn btn-secondary" id="qa-rank">🏆 Rankings</Link>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
