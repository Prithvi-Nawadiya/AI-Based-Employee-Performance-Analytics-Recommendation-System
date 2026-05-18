// src/pages/Employees.jsx - Employee list with search & filter
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import EmployeeCard from '../components/EmployeeCard';
import EmployeeForm from '../components/EmployeeForm';
import api from '../utils/api';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['All', 'Development', 'Design', 'Marketing', 'HR', 'Finance', 'Operations', 'Sales', 'QA'];

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  const [minScore, setMinScore] = useState('');
  const [maxScore, setMaxScore] = useState('');
  const [editEmployee, setEditEmployee] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchName) params.append('name', searchName);
      if (filterDept !== 'All') params.append('department', filterDept);
      if (minScore) params.append('minScore', minScore);
      if (maxScore) params.append('maxScore', maxScore);

      const endpoint = params.toString() ? `/employees/search?${params}` : '/employees';
      const { data } = await api.get(endpoint);
      setEmployees(data.data || []);
    } catch (err) {
      toast.error('Failed to load employees');
    } finally {
      setLoading(false);
    }
  }, [searchName, filterDept, minScore, maxScore]);

  useEffect(() => {
    const timer = setTimeout(fetchEmployees, 400);
    return () => clearTimeout(timer);
  }, [fetchEmployees]);

  const handleDelete = (id) => setEmployees((prev) => prev.filter((e) => e._id !== id));

  const handleEditSuccess = (updated, isEdit) => {
    if (isEdit) {
      setEmployees((prev) => prev.map((e) => (e._id === updated._id ? updated : e)));
      setEditEmployee(null);
    } else {
      fetchEmployees();
    }
  };

  const handleAiRecommend = async (employeeId) => {
    setAiLoading(true);
    setAiResult(null);
    try {
      const { data } = await api.post('/ai/recommend', { employeeId });
      setAiResult(data.data);
      toast.success('AI recommendation ready! 🤖');
      // Update the employee in the list with the new recommendation
      setEmployees((prev) =>
        prev.map((e) =>
          e._id === employeeId ? { ...e, aiRecommendation: data.data.recommendation } : e
        )
      );
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI request failed');
    } finally {
      setAiLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchName('');
    setFilterDept('All');
    setMinScore('');
    setMaxScore('');
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content">
        {/* Header */}
        <div className="page-header" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 className="page-title">👥 Employees</h1>
            <p className="page-subtitle">{employees.length} employee{employees.length !== 1 ? 's' : ''} found</p>
          </div>
          <Link to="/add-employee" className="btn btn-primary" id="emp-page-add-btn">➕ Add Employee</Link>
        </div>

        {/* Search & Filter Bar */}
        <div className="search-bar" id="search-filter-section">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              id="search-name-input"
              className="search-input"
              placeholder="Search by name..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </div>

          <select
            id="filter-dept-select"
            className="form-select"
            style={{ minWidth: '160px', width: 'auto' }}
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
          >
            {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
          </select>

          <input
            id="filter-min-score"
            className="form-input"
            type="number" placeholder="Min score" min="0" max="100"
            style={{ width: '110px' }}
            value={minScore}
            onChange={(e) => setMinScore(e.target.value)}
          />
          <input
            id="filter-max-score"
            className="form-input"
            type="number" placeholder="Max score" min="0" max="100"
            style={{ width: '110px' }}
            value={maxScore}
            onChange={(e) => setMaxScore(e.target.value)}
          />

          {(searchName || filterDept !== 'All' || minScore || maxScore) && (
            <button className="btn btn-secondary btn-sm" onClick={clearFilters} id="clear-filters-btn">
              ✕ Clear
            </button>
          )}
        </div>

        {/* AI Result Panel */}
        {aiLoading && (
          <div className="ai-box" style={{ marginBottom: '1.5rem' }}>
            <div className="loading-overlay" style={{ padding: '1.5rem' }}>
              <div className="spinner" />
              <p style={{ color: 'var(--primary-light)' }}>🤖 Generating AI recommendation...</p>
            </div>
          </div>
        )}
        {aiResult && !aiLoading && (
          <div className="ai-box fade-in" style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ color: 'var(--primary-light)', fontSize: '1rem' }}>🤖 AI Recommendation</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                  For {aiResult.employee?.name} • {aiResult.employee?.department} • Score: {aiResult.employee?.performanceScore}
                </p>
              </div>
              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setAiResult(null)}
                id="close-ai-result"
              >✕</button>
            </div>
            <div className="ai-content">{aiResult.recommendation}</div>
          </div>
        )}

        {/* Employee Grid */}
        {loading ? (
          <div className="loading-overlay"><div className="spinner" /><p>Loading employees...</p></div>
        ) : employees.length === 0 ? (
          <div className="empty-state card">
            <div className="empty-state-icon">🔍</div>
            <p className="empty-state-title">No employees found</p>
            <p style={{ marginBottom: '1rem' }}>Try adjusting your search filters</p>
            <Link to="/add-employee" className="btn btn-primary btn-sm" id="empty-add-btn">Add Employee</Link>
          </div>
        ) : (
          <div className="grid-3">
            {employees.map((emp, index) => (
              <EmployeeCard
                key={emp._id}
                employee={emp}
                rank={index + 1}
                onDelete={handleDelete}
                onEdit={setEditEmployee}
                onAiRecommend={handleAiRecommend}
              />
            ))}
          </div>
        )}

        {/* Edit Employee Modal */}
        {editEmployee && (
          <div className="modal-backdrop" onClick={() => setEditEmployee(null)}>
            <div className="modal" onClick={(e) => e.stopPropagation()} id="edit-employee-modal">
              <div className="modal-header">
                <h2 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>✏️ Edit Employee</h2>
                <button className="modal-close" onClick={() => setEditEmployee(null)} id="close-edit-modal">✕</button>
              </div>
              <EmployeeForm
                employee={editEmployee}
                onSuccess={handleEditSuccess}
                onCancel={() => setEditEmployee(null)}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Employees;
