// src/components/EmployeeCard.jsx - Card for displaying employee info
import { useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const getScoreClass = (score) => {
  if (score >= 75) return 'score-high';
  if (score >= 50) return 'score-medium';
  return 'score-low';
};

const getProgressClass = (score) => {
  if (score >= 75) return 'progress-high';
  if (score >= 50) return 'progress-medium';
  return 'progress-low';
};

const getRankClass = (rank) => {
  if (rank === 1) return 'rank-1';
  if (rank === 2) return 'rank-2';
  if (rank === 3) return 'rank-3';
  return 'rank-default';
};

const EmployeeCard = ({ employee, rank, onDelete, onEdit, onAiRecommend }) => {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete ${employee.name}?`)) return;
    try {
      await api.delete(`/employees/${employee._id}`);
      toast.success('Employee deleted successfully');
      onDelete(employee._id);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete employee');
    }
  };

  const handleAiRecommend = async () => {
    setLoading(true);
    try {
      await onAiRecommend(employee._id);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card fade-in" id={`employee-card-${employee._id}`}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1rem' }}>
        {/* Rank */}
        <div className={`rank-badge ${getRankClass(rank)}`}>{rank}</div>

        {/* Avatar */}
        <div style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          background: 'var(--gradient-primary)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '1rem', color: 'white'
        }}>
          {employee.name.charAt(0).toUpperCase()}
        </div>

        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '0.15rem', color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {employee.name}
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {employee.email}
          </p>
        </div>

        {/* Score Ring */}
        <div className={`score-ring ${getScoreClass(employee.performanceScore)}`}>
          {employee.performanceScore}
        </div>
      </div>

      {/* Department & Experience */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
        <span className="badge badge-primary">{employee.department}</span>
        <span className="badge badge-cyan">{employee.experience}y exp</span>
        {employee.aiRecommendation && (
          <span className="badge badge-success">✦ AI Analyzed</span>
        )}
      </div>

      {/* Skills */}
      <div style={{ marginBottom: '0.75rem' }}>
        {employee.skills.slice(0, 4).map((skill, i) => (
          <span key={i} className="skill-tag">{skill}</span>
        ))}
        {employee.skills.length > 4 && (
          <span className="skill-tag">+{employee.skills.length - 4}</span>
        )}
      </div>

      {/* Performance Progress Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>Performance</span>
          <span>{employee.performanceScore}/100</span>
        </div>
        <div className="progress-bar">
          <div
            className={`progress-fill ${getProgressClass(employee.performanceScore)}`}
            style={{ width: `${employee.performanceScore}%` }}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
        <button
          className="btn btn-success btn-sm"
          onClick={handleAiRecommend}
          disabled={loading}
          id={`ai-btn-${employee._id}`}
        >
          {loading ? '⏳' : '🤖'} AI
        </button>
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onEdit(employee)}
          id={`edit-btn-${employee._id}`}
        >
          ✏️ Edit
        </button>
        <button
          className="btn btn-danger btn-sm"
          onClick={handleDelete}
          id={`delete-btn-${employee._id}`}
        >
          🗑️
        </button>
      </div>
    </div>
  );
};

export default EmployeeCard;
