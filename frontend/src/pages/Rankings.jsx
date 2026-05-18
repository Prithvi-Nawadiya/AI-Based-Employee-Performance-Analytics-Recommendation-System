// src/pages/Rankings.jsx - Employee rankings page
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import toast from 'react-hot-toast';

const getRatingBadge = (score) => {
  if (score >= 90) return { label: 'Outstanding', cls: 'badge-success' };
  if (score >= 75) return { label: 'Excellent', cls: 'badge-success' };
  if (score >= 60) return { label: 'Good', cls: 'badge-primary' };
  if (score >= 40) return { label: 'Average', cls: 'badge-warning' };
  return { label: 'Needs Improvement', cls: 'badge-danger' };
};

const Rankings = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiRanking, setAiRanking] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    api.get('/employees')
      .then(({ data }) => setEmployees(data.data || []))
      .catch(() => toast.error('Failed to load employees'))
      .finally(() => setLoading(false));
  }, []);

  const handleAiRank = async () => {
    setAiLoading(true);
    try {
      const { data } = await api.post('/ai/rank');
      setAiRanking(data.data.rankingAnalysis);
      toast.success('AI ranking complete! 🏆');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI ranking failed');
    } finally {
      setAiLoading(false);
    }
  };

  const sorted = [...employees].sort((a, b) => b.performanceScore - a.performanceScore);

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">🏆 Employee Rankings</h1>
            <p className="page-subtitle">Sorted by performance score — top performers first</p>
          </div>
          <button
            className="btn btn-primary" onClick={handleAiRank}
            disabled={aiLoading} id="ai-rank-btn"
          >
            {aiLoading ? '⏳ Analyzing...' : '🤖 AI Rank All'}
          </button>
        </div>

        {/* Top 3 Podium */}
        {!loading && sorted.length >= 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            {/* 2nd place */}
            <div className="card" style={{ textAlign: 'center', padding: '1.5rem', minWidth: '160px', flex: 1, maxWidth: '200px', order: 1 }}>
              <div style={{ fontSize: '2rem' }}>🥈</div>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, #c0c0c0, #a0a0a0)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.75rem auto', fontWeight: 700, color: '#000' }}>
                {sorted[1]?.name.charAt(0)}
              </div>
              <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{sorted[1]?.name}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{sorted[1]?.department}</p>
              <p style={{ fontWeight: 800, fontSize: '1.5rem', color: '#c0c0c0', marginTop: '0.25rem' }}>{sorted[1]?.performanceScore}</p>
            </div>

            {/* 1st place */}
            <div className="card" style={{
              textAlign: 'center', padding: '1.75rem', minWidth: '180px', flex: 1, maxWidth: '220px', order: 0,
              background: 'linear-gradient(145deg, rgba(255,215,0,0.08), rgba(255,165,0,0.05))',
              border: '1px solid rgba(255,215,0,0.3)',
              boxShadow: '0 0 30px rgba(255,215,0,0.1)'
            }}>
              <div style={{ fontSize: '2.5rem' }}>🥇</div>
              <div style={{ width: 60, height: 60, borderRadius: '50%', background: 'linear-gradient(135deg, #ffd700, #ffa500)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.75rem auto', fontWeight: 700, color: '#000', fontSize: '1.25rem', boxShadow: '0 4px 15px rgba(255,215,0,0.4)' }}>
                {sorted[0]?.name.charAt(0)}
              </div>
              <p style={{ fontWeight: 700 }}>{sorted[0]?.name}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{sorted[0]?.department}</p>
              <p style={{ fontWeight: 800, fontSize: '1.75rem', color: '#ffd700', marginTop: '0.25rem' }}>{sorted[0]?.performanceScore}</p>
            </div>

            {/* 3rd place */}
            <div className="card" style={{ textAlign: 'center', padding: '1.5rem', minWidth: '160px', flex: 1, maxWidth: '200px', order: 2 }}>
              <div style={{ fontSize: '2rem' }}>🥉</div>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: 'linear-gradient(135deg, #cd7f32, #a0522d)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0.75rem auto', fontWeight: 700, color: '#fff' }}>
                {sorted[2]?.name.charAt(0)}
              </div>
              <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{sorted[2]?.name}</p>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{sorted[2]?.department}</p>
              <p style={{ fontWeight: 800, fontSize: '1.5rem', color: '#cd7f32', marginTop: '0.25rem' }}>{sorted[2]?.performanceScore}</p>
            </div>
          </div>
        )}

        {/* Full Rankings Table */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ marginBottom: '1.25rem', color: 'var(--text-primary)' }}>📊 Complete Rankings</h3>
          {loading ? (
            <div className="loading-overlay"><div className="spinner" /></div>
          ) : sorted.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏆</div>
              <p className="empty-state-title">No employees to rank yet</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table className="table" id="rankings-table">
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Score</th>
                    <th>Experience</th>
                    <th>Skills</th>
                    <th>Rating</th>
                    <th>AI Status</th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((emp, i) => {
                    const rating = getRatingBadge(emp.performanceScore);
                    return (
                      <tr key={emp._id}>
                        <td>
                          <div className={`rank-badge ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-default'}`}>
                            {i + 1}
                          </div>
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gradient-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem', flexShrink: 0 }}>
                              {emp.name.charAt(0)}
                            </div>
                            <div>
                              <p style={{ fontWeight: 600 }}>{emp.name}</p>
                              <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{emp.email}</p>
                            </div>
                          </div>
                        </td>
                        <td><span className="badge badge-primary">{emp.department}</span></td>
                        <td>
                          <div>
                            <span style={{ fontWeight: 700, color: emp.performanceScore >= 75 ? 'var(--success)' : emp.performanceScore >= 50 ? 'var(--warning)' : 'var(--danger)', fontSize: '1rem' }}>
                              {emp.performanceScore}
                            </span>
                            <div className="progress-bar" style={{ width: '80px', marginTop: '4px' }}>
                              <div className={`progress-fill ${emp.performanceScore >= 75 ? 'progress-high' : emp.performanceScore >= 50 ? 'progress-medium' : 'progress-low'}`}
                                style={{ width: `${emp.performanceScore}%` }} />
                            </div>
                          </div>
                        </td>
                        <td><span className="badge badge-cyan">{emp.experience}y</span></td>
                        <td>
                          <div>{emp.skills.slice(0, 2).map((s, si) => <span key={si} className="skill-tag">{s}</span>)}
                            {emp.skills.length > 2 && <span className="skill-tag">+{emp.skills.length - 2}</span>}
                          </div>
                        </td>
                        <td><span className={`badge ${rating.cls}`}>{rating.label}</span></td>
                        <td>
                          {emp.aiRecommendation
                            ? <span className="badge badge-success">✦ Done</span>
                            : <span className="badge" style={{ opacity: 0.5 }}>Pending</span>}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* AI Ranking Analysis */}
        {aiLoading && (
          <div className="ai-box"><div className="loading-overlay" style={{ padding: '2rem' }}>
            <div className="spinner" />
            <p style={{ color: 'var(--primary-light)' }}>🤖 Generating AI ranking analysis...</p>
          </div></div>
        )}
        {aiRanking && !aiLoading && (
          <div className="ai-box fade-in">
            <h3 style={{ color: 'var(--primary-light)', marginBottom: '1rem', fontSize: '1rem' }}>🤖 AI Ranking Analysis</h3>
            <div className="ai-content">{aiRanking}</div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Rankings;
