import React, { useEffect, useState } from 'react';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', team: '' });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const codespace = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespace ? `https://${codespace}-8000.app.github.dev/api` : 'http://localhost:8000/api';

  const fetchUsers = () => {
    fetch(`${apiUrl}/users/`)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setUsers(results);
      })
      .catch(err => console.error('Error fetching users:', err));
  };

  useEffect(() => {
    fetchUsers();
    
    // Fetch teams for the registration form
    fetch(`${apiUrl}/teams/`)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setTeams(results);
      })
      .catch(err => console.error('Error fetching teams:', err));
  }, [apiUrl]);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error for this field
    setErrors({
      ...errors,
      [e.target.name]: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage('');

    try {
      const response = await fetch(`${apiUrl}/users/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('User registered successfully!');
        setFormData({ name: '', email: '', team: '' });
        setShowForm(false);
        fetchUsers(); // Refresh user list
      } else {
        // Handle validation errors
        setErrors(data);
      }
    } catch (err) {
      console.error('Error registering user:', err);
      setErrors({ general: 'Failed to register user. Please try again.' });
    }
  };

  return (
    <div className="card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="card-title mb-0">Users</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Register New User'}
        </button>
      </div>

      {successMessage && (
        <div className="alert alert-success alert-dismissible fade show" role="alert">
          {successMessage}
          <button type="button" className="btn-close" onClick={() => setSuccessMessage('')}></button>
        </div>
      )}

      {showForm && (
        <div className="card mb-4 bg-light">
          <div className="card-body">
            <h5 className="card-title">Register New User</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="name" className="form-label">Name *</label>
                <input
                  type="text"
                  className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
                {errors.name && <div className="invalid-feedback">{errors.name}</div>}
              </div>
              
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email *</label>
                <input
                  type="email"
                  className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
                {errors.email && <div className="invalid-feedback">{errors.email}</div>}
              </div>
              
              <div className="mb-3">
                <label htmlFor="team" className="form-label">Team *</label>
                <select
                  className={`form-select ${errors.team ? 'is-invalid' : ''}`}
                  id="team"
                  name="team"
                  value={formData.team}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a team...</option>
                  {teams.map(team => (
                    <option key={team.id} value={team.id}>{team.name}</option>
                  ))}
                </select>
                {errors.team && <div className="invalid-feedback">{errors.team}</div>}
              </div>

              {errors.general && (
                <div className="alert alert-danger">{errors.general}</div>
              )}

              <button type="submit" className="btn btn-success">Register User</button>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-primary">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Team</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={idx}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.team_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Users;
