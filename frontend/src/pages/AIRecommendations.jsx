// src/pages/AIRecommendations.jsx - AI-powered recommendations hub
import { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../utils/api';
import toast from 'react-hot-toast';

const AIRecommendations = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [rankingResult, setRankingResult] = useState('');
  const [trainingResult, setTrainingResult] = useState('');
  const [deptAnalysis, setDeptAnalysis] = useState('');
  const [selectedDept, setSelectedDept] = useState('');
  const [loading, setLoading] = useState({ recommend: false, rank: false, training: false, dept: false });
  const [activeTab, setActiveTab] = useState('recommend');

  useEffect(() => {
    api.get('/employees').then(({ data }) => setEmployees(data.data || [])).catch(() => {});
  }, []);

  const setLoad = (key, val) => setLoading((p) => ({ ...p, [key]: val }));

  const handleRecommend = async () => {
    if (!selectedEmployee) { toast.error('Please select an employee'); return; }
    setLoad('recommend', true); setRecommendation('');
    try {
      const { data } = await api.post('/ai/recommend', { employeeId: selectedEmployee });
      setRecommendation(data.data.recommendation);
      toast.success('Recommendation generated! 🤖');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI request failed');
    } finally { setLoad('recommend', false); }
  };

  const handleRank = async () => {
    setLoad('rank', true); setRankingResult('');
    try {
      const { data } = await api.post('/ai/rank');
      setRankingResult(data.data.rankingAnalysis);
      toast.success('Rankings generated! 🏆');
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI ranking failed');
    } finally { setLoad('rank', false); }
  };

  const handleTraining = async () => {
    if (!selectedEmployee) { toast.error('Please select an employee'); return; }
    setLoad('training', true); setTrainingResult('');
    try {
      const { data } = await api.post('/ai/training', { employeeId: selectedEmployee });
      setTrainingResult(data.data.trainingSuggestions);
      toast.success('Training plan generated! 📚');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Training suggestion failed');
    } finally { setLoad('training', false); }
  };

  const handleDeptAnalysis = async () => {
    setLoad('dept', true); setDeptAnalysis('');
    try {
      const { data } = await api.post('/ai/department-analysis', { department: selectedDept || undefined });
      setDeptAnalysis(data.data.analysis);
      toast.success('Department analysis ready! 🏢');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Analysis failed');
    } finally { setLoad('dept', false); }
  };

  const DEPARTMENTS = ['', 'Development', 'Design', 'Marketing', 'HR', 'Finance', 'Operations', 'Sales', 'QA'];

  const tabs = [
    { id: 'recommend', label: '🤖 Recommend', desc: 'Get promotion & feedback for an employee' },
    { id: 'rank', label: '🏆 Rank All', desc: 'AI-powered employee ranking' },
    { id: 'training', label: '📚 Training', desc: 'Personalized training suggestions' },
    { id: 'dept', label: '🏢 Department', desc: 'Department-level AI analysis' }
  ];

  const AIResultBox = ({ content, loading: isLoading }) => {
    if (isLoading) return (
      <div className="ai-box"><div className="loading-overlay" style={{ padding: '2rem' }}>
        <div className="spinner" />
        <p style={{ color: 'var(--primary-light)' }}>🤖 AI is thinking...</p>
      </div></div>
    );
    if (!content) return null;
    return (
      <div className="ai-box fade-in" style={{ marginTop: '1.5rem' }}>
        <div className="ai-content">{content}</div>
      </div>
    );
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content">
        <div className="page-header">
          <h1 className="page-title">🤖 AI Insights</h1>
          <p className="page-subtitle">OpenRouter-powered employee analytics and recommendations</p>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }} id="ai-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              id={`ai-tab-${tab.id}`}
              className={`btn ${activeTab === tab.id ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="card">
          {/* RECOMMENDATION TAB */}
          {activeTab === 'recommend' && (
            <div id="tab-recommend">
              <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Promotion & Performance Recommendation</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Select an employee to get AI-powered promotion recommendation, feedback, and skill assessment.
              </p>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
                  <label className="form-label" htmlFor="select-emp-recommend">Select Employee</label>
                  <select
                    id="select-emp-recommend" className="form-select"
                    value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    <option value="">Choose employee...</option>
                    {employees.map((e) => (
                      <option key={e._id} value={e._id}>
                        {e.name} — {e.department} (Score: {e.performanceScore})
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="btn btn-primary btn-lg" onClick={handleRecommend}
                  disabled={loading.recommend} id="generate-recommendation-btn"
                >
                  {loading.recommend ? '⏳ Analyzing...' : '🤖 Generate Recommendation'}
                </button>
              </div>
              <AIResultBox content={recommendation} loading={loading.recommend} />
            </div>
          )}

          {/* RANKING TAB */}
          {activeTab === 'rank' && (
            <div id="tab-rank">
              <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>AI Employee Ranking</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Rank all employees based on performance, experience, and skills using AI analysis.
              </p>
              <button
                className="btn btn-primary btn-lg" onClick={handleRank}
                disabled={loading.rank} id="generate-ranking-btn"
              >
                {loading.rank ? '⏳ Ranking...' : '🏆 Generate Rankings'}
              </button>

              {!loading.rank && employees.length > 0 && (
                <div style={{ marginTop: '1.5rem' }}>
                  <h3 style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    Current Performance Order ({employees.length} employees)
                  </h3>
                  <div className="table-wrapper">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Rank</th><th>Name</th><th>Department</th><th>Score</th><th>Experience</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[...employees].sort((a, b) => b.performanceScore - a.performanceScore).map((emp, i) => (
                          <tr key={emp._id}>
                            <td><div className={`rank-badge ${i === 0 ? 'rank-1' : i === 1 ? 'rank-2' : i === 2 ? 'rank-3' : 'rank-default'}`}>{i + 1}</div></td>
                            <td style={{ fontWeight: 600 }}>{emp.name}</td>
                            <td><span className="badge badge-primary">{emp.department}</span></td>
                            <td>
                              <span style={{ fontWeight: 700, color: emp.performanceScore >= 75 ? 'var(--success)' : emp.performanceScore >= 50 ? 'var(--warning)' : 'var(--danger)' }}>
                                {emp.performanceScore}
                              </span>
                            </td>
                            <td>{emp.experience}y</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              <AIResultBox content={rankingResult} loading={loading.rank} />
            </div>
          )}

          {/* TRAINING TAB */}
          {activeTab === 'training' && (
            <div id="tab-training">
              <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Training & Development Plan</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Get a personalized training roadmap for skill enhancement and career growth.
              </p>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
                  <label className="form-label" htmlFor="select-emp-training">Select Employee</label>
                  <select
                    id="select-emp-training" className="form-select"
                    value={selectedEmployee} onChange={(e) => setSelectedEmployee(e.target.value)}
                  >
                    <option value="">Choose employee...</option>
                    {employees.map((e) => (
                      <option key={e._id} value={e._id}>
                        {e.name} — {e.department}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="btn btn-primary btn-lg" onClick={handleTraining}
                  disabled={loading.training} id="generate-training-btn"
                >
                  {loading.training ? '⏳ Planning...' : '📚 Generate Training Plan'}
                </button>
              </div>
              <AIResultBox content={trainingResult} loading={loading.training} />
            </div>
          )}

          {/* DEPARTMENT TAB */}
          {activeTab === 'dept' && (
            <div id="tab-dept">
              <h2 style={{ marginBottom: '0.5rem', color: 'var(--text-primary)', fontSize: '1.1rem' }}>Department Analysis</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
                Get AI insights on department health, team dynamics, and hiring needs.
              </p>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
                  <label className="form-label" htmlFor="select-dept-analysis">Department (optional)</label>
                  <select
                    id="select-dept-analysis" className="form-select"
                    value={selectedDept} onChange={(e) => setSelectedDept(e.target.value)}
                  >
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d || 'All Departments'}</option>)}
                  </select>
                </div>
                <button
                  className="btn btn-primary btn-lg" onClick={handleDeptAnalysis}
                  disabled={loading.dept} id="generate-dept-btn"
                >
                  {loading.dept ? '⏳ Analyzing...' : '🏢 Analyze Department'}
                </button>
              </div>
              <AIResultBox content={deptAnalysis} loading={loading.dept} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AIRecommendations;
