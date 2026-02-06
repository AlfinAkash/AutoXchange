import React, { useEffect, useState } from 'react';
import BASE_URL from '../../config/Config';
import Cookies from 'js-cookie';

const ListOfUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${BASE_URL}/auth/all`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      const data = await res.json();
      console.log('Fetched users:', data);

      if (res.ok) {
        const userList = Array.isArray(data) ? data : data.users || [];
        setUsers(userList);
      } else {
        setError(data.message || 'Failed to fetch users');
      }
    } catch (err) {
      setError('Server error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;

    try {
      const res = await fetch(`${BASE_URL}/auth/delete-user/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json();
      console.log('Delete response:', data);

      if (res.ok) {
        alert("Successfully deleted");
        setUsers(prev => prev.filter(user => user._id !== id));
      } else {
        alert(data.message || 'Failed to delete user');
      }
    } catch (err) {
      alert('Server error while deleting');
    }
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">List of Staffs</h3>
        <button className="btn btn-outline-primary btn-sm" onClick={fetchUsers}>
          <i className="bi bi-arrow-clockwise me-1"></i> Refresh
        </button>
      </div>

      {loading && (
        <div className="text-center my-4">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      )}
      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && users.filter(u => u.role !== "admin").length === 0 && (
        <div className="alert alert-warning">No staff users found.</div>
      )}

      {!loading && users.length > 0 && (
        <div className="table-responsive">
          <table className="table table-striped table-hover table-bordered">
            <thead className="table-dark text-center align-middle">
              <tr>
                <th>S.No</th>
                <th>Username</th>
                <th>Email</th>
                <th>Role</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody className="text-center align-middle">
              {users
                .filter(user => user.role !== "admin")
                .map((user, index) => (
                  <tr key={user._id || index}>
                    <td>{index + 1}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge bg-info text-dark">{user.role}</span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => handleDelete(user._id)}
                      >
                        <i className="bi bi-trash me-1"></i> Delete
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ListOfUsers;
