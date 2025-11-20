import React, { useEffect, useState } from 'react';

const Activities = () => {
  const [activities, setActivities] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ user: '', type: '', duration: '', date: '' });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const codespace = process.env.REACT_APP_CODESPACE_NAME;
  const apiUrl = codespace ? `https://${codespace}-8000.app.github.dev/api` : 'http://localhost:8000/api';

  const activityTypes = ['Running', 'Cycling', 'Swimming', 'Yoga', 'Gym', 'Walking', 'Other'];

  const fetchActivities = () => {
    fetch(`${apiUrl}/activities/`)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setActivities(results);
      })
      .catch(err => console.error('Error fetching activities:', err));
  };

  useEffect(() => {
    fetchActivities();
    
    // Fetch users for the activity form
    fetch(`${apiUrl}/users/`)
      .then(res => res.json())
      .then(data => {
        const results = data.results || data;
        setUsers(results);
      })
      .catch(err => console.error('Error fetching users:', err));
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
      const response = await fetch(`${apiUrl}/activities/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage('Activity added successfully!');
        setFormData({ user: '', type: '', duration: '', date: '' });
        setShowForm(false);
        fetchActivities(); // Refresh activity list
      } else {
        // Handle validation errors
        setErrors(data);
      }
    } catch (err) {
      console.error('Error adding activity:', err);
      setErrors({ general: 'Failed to add activity. Please try again.' });
    }
  };

  return (
    <div className="card p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="card-title mb-0">Activities</h2>
        <button 
          className="btn btn-primary"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : 'Add New Activity'}
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
            <h5 className="card-title">Add New Activity</h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="user" className="form-label">User *</label>
                <select
                  className={`form-select ${errors.user ? 'is-invalid' : ''}`}
                  id="user"
                  name="user"
                  value={formData.user}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a user...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.name}</option>
                  ))}
                </select>
                {errors.user && <div className="invalid-feedback">{errors.user}</div>}
              </div>
              
              <div className="mb-3">
                <label htmlFor="type" className="form-label">Activity Type *</label>
                <select
                  className={`form-select ${errors.type ? 'is-invalid' : ''}`}
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select activity type...</option>
                  {activityTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.type && <div className="invalid-feedback">{errors.type}</div>}
              </div>
              
              <div className="mb-3">
                <label htmlFor="duration" className="form-label">Duration (minutes) *</label>
                <input
                  type="number"
                  className={`form-control ${errors.duration ? 'is-invalid' : ''}`}
                  id="duration"
                  name="duration"
                  value={formData.duration}
                  onChange={handleInputChange}
                  min="1"
                  max="1440"
                  required
                />
                {errors.duration && <div className="invalid-feedback">{errors.duration}</div>}
              </div>
              
              <div className="mb-3">
                <label htmlFor="date" className="form-label">Date *</label>
                <input
                  type="date"
                  className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                  id="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  required
                />
                {errors.date && <div className="invalid-feedback">{errors.date}</div>}
              </div>

              {errors.general && (
                <div className="alert alert-danger">{errors.general}</div>
              )}

              <button type="submit" className="btn btn-success">Add Activity</button>
            </form>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-striped table-bordered">
          <thead className="table-primary">
            <tr>
              <th>Type</th>
              <th>Duration (min)</th>
              <th>Date</th>
              <th>User</th>
            </tr>
          </thead>
          <tbody>
            {activities.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center text-muted">No activities found</td>
              </tr>
            ) : (
              activities.map((activity, idx) => (
                <tr key={idx}>
                  <td>{activity.type}</td>
                  <td>{activity.duration}</td>
                  <td>{new Date(activity.date).toLocaleDateString()}</td>
                  <td>{activity.user_name}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Activities;
