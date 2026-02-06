import React, { useState } from 'react';
import BASE_URL from '../../config/Config';
import ListOfUsers from './ListOfUsers';

const CreateUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'staff',
  });

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${BASE_URL}/auth/create-user`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Staff account created successfully.');
        setFormData({ username: '', email: '', password: '', role: 'staff' });
      } else {
        setError(data.message || 'Failed to create staff.');
      }
    } catch (err) {
      setError('Server error. Try again.');
    }

    setLoading(false);
  };

  return (
    <div className="container py-5">
      {/* Top: Create Form */}
      <div className="row justify-content-center mb-5">
        <div className="col-md-6">
          <div className="card shadow-lg p-4">
            <h3 className="text-center mb-4">Create Staff Account</h3>

            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  name="username"
                  className="form-control"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder="Enter staff username"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Enter staff email"
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter password"
                />
              </div>

              <div className="mb-4">
                <label className="form-label">Role</label>
                <input
                  type="text"
                  name="role"
                  className="form-control"
                  value={formData.role}
                  readOnly
                />
              </div>

              <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                {loading ? 'Creating...' : 'Create Staff'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom: List of Users */}
      <div className="row">
        <div className="col-12">
          <ListOfUsers />
        </div>
      </div>
    </div>
  );
};

export default CreateUser;
