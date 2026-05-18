// src/pages/AddEmployee.jsx - Dedicated Add Employee page
import Sidebar from '../components/Sidebar';
import EmployeeForm from '../components/EmployeeForm';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddEmployee = () => {
  const navigate = useNavigate();

  const handleSuccess = (employee) => {
    // After adding, ask if they want to view or add another
    const goToList = window.confirm('Employee added! Go to employee list?');
    if (goToList) navigate('/employees');
  };

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content">
        <div className="page-header">
          <h1 className="page-title">➕ Add Employee</h1>
          <p className="page-subtitle">Register a new employee in the system</p>
        </div>

        <div style={{ maxWidth: '700px' }}>
          <div className="card">
            {/* Form tip banner */}
            <div style={{
              padding: '0.875rem 1rem', borderRadius: 'var(--radius)',
              background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
              marginBottom: '1.75rem', fontSize: '0.82rem', color: 'var(--text-secondary)',
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              💡 Enter skills as comma-separated values (e.g. React, Node.js, MongoDB)
            </div>

            <EmployeeForm onSuccess={handleSuccess} />
          </div>

          {/* Sample data card */}
          <div className="card" style={{ marginTop: '1.5rem' }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
              📋 Sample Employee Data
            </h3>
            <pre style={{
              background: 'var(--bg-input)', padding: '1rem', borderRadius: 'var(--radius)',
              fontSize: '0.78rem', color: 'var(--text-secondary)', overflowX: 'auto',
              border: '1px solid var(--border)', lineHeight: 1.7
            }}>
{`{
  "name": "Aman Verma",
  "email": "aman@gmail.com",
  "department": "Development",
  "skills": ["React", "Node.js", "MongoDB"],
  "performanceScore": 85,
  "experience": 3
}`}
            </pre>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AddEmployee;
