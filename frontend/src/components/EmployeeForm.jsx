// src/components/EmployeeForm.jsx - Reusable Add/Edit Employee form
import { useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

const DEPARTMENTS = ['Development', 'Design', 'Marketing', 'HR', 'Finance', 'Operations', 'Sales', 'QA'];

const defaultForm = {
  name: '', email: '', department: '', skills: '', performanceScore: '', experience: ''
};

const EmployeeForm = ({ employee, onSuccess, onCancel }) => {
  const [form, setForm] = useState(defaultForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const isEdit = Boolean(employee);

  useEffect(() => {
    if (employee) {
      setForm({
        name: employee.name || '',
        email: employee.email || '',
        department: employee.department || '',
        skills: Array.isArray(employee.skills) ? employee.skills.join(', ') : '',
        performanceScore: employee.performanceScore ?? '',
        experience: employee.experience ?? ''
      });
    }
  }, [employee]);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Valid email required';
    if (!form.department) e.department = 'Department is required';
    if (!form.skills.trim()) e.skills = 'At least one skill required';
    const score = Number(form.performanceScore);
    if (form.performanceScore === '' || isNaN(score) || score < 0 || score > 100)
      e.performanceScore = 'Score must be between 0–100';
    const exp = Number(form.experience);
    if (form.experience === '' || isNaN(exp) || exp < 0)
      e.experience = 'Experience must be ≥ 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setErrors((prev) => ({ ...prev, [e.target.name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        department: form.department,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
        performanceScore: Number(form.performanceScore),
        experience: Number(form.experience)
      };

      if (isEdit) {
        const { data } = await api.put(`/employees/${employee._id}`, payload);
        toast.success('Employee updated successfully!');
        onSuccess(data.data, true);
      } else {
        const { data } = await api.post('/employees', payload);
        toast.success('Employee added successfully!');
        onSuccess(data.data, false);
        setForm(defaultForm);
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Something went wrong';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate id="employee-form">
      <div className="grid-2">
        <div className="form-group">
          <label className="form-label" htmlFor="emp-name">Full Name</label>
          <input
            id="emp-name" name="name" className="form-input"
            placeholder="e.g. Aman Verma"
            value={form.name} onChange={handleChange}
          />
          {errors.name && <p className="form-error">{errors.name}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="emp-email">Email Address</label>
          <input
            id="emp-email" name="email" type="email" className="form-input"
            placeholder="aman@gmail.com"
            value={form.email} onChange={handleChange}
          />
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="emp-department">Department</label>
        <select
          id="emp-department" name="department" className="form-select"
          value={form.department} onChange={handleChange}
        >
          <option value="">Select Department</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
        {errors.department && <p className="form-error">{errors.department}</p>}
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="emp-skills">
          Skills <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>(comma-separated)</span>
        </label>
        <input
          id="emp-skills" name="skills" className="form-input"
          placeholder="React, Node.js, MongoDB, Python"
          value={form.skills} onChange={handleChange}
        />
        {errors.skills && <p className="form-error">{errors.skills}</p>}
        {form.skills && (
          <div style={{ marginTop: '0.5rem' }}>
            {form.skills.split(',').filter(s => s.trim()).map((s, i) => (
              <span key={i} className="skill-tag">{s.trim()}</span>
            ))}
          </div>
        )}
      </div>

      <div className="grid-2">
        <div className="form-group">
          <label className="form-label" htmlFor="emp-score">Performance Score (0–100)</label>
          <input
            id="emp-score" name="performanceScore" type="number" className="form-input"
            placeholder="85" min="0" max="100"
            value={form.performanceScore} onChange={handleChange}
          />
          {errors.performanceScore && <p className="form-error">{errors.performanceScore}</p>}
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="emp-experience">Years of Experience</label>
          <input
            id="emp-experience" name="experience" type="number" className="form-input"
            placeholder="3" min="0"
            value={form.experience} onChange={handleChange}
          />
          {errors.experience && <p className="form-error">{errors.experience}</p>}
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
        <button
          type="submit" className="btn btn-primary btn-lg"
          disabled={loading} id="submit-employee-btn"
          style={{ flex: 1, justifyContent: 'center' }}
        >
          {loading ? '⏳ Saving...' : isEdit ? '✅ Update Employee' : '➕ Add Employee'}
        </button>
        {onCancel && (
          <button type="button" className="btn btn-secondary btn-lg" onClick={onCancel} id="cancel-employee-btn">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

export default EmployeeForm;
