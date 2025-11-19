import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api, { setAuthToken, getUserRole } from '@/services/api';

export default function UsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [authorized, setAuthorized] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  async function fetchUsers() {
    try {
      const token = localStorage.getItem('southline_token');
      if (token) {
        setAuthToken(token);
      }
      const { data } = await api.get('/api/users');
      setUsers(data);
    } catch (e) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const role = getUserRole();
    if (role && String(role).toLowerCase() === 'admin') {
      setAuthorized(true);
      fetchUsers();
    } else {
      setAuthorized(false);
      setLoading(false);
    }
    setCheckingAuth(false);
  }, []);

  async function handleRoleChange(id, role) {
    try {
      await api.put(`/users/${id}/role`, { role });
      fetchUsers(); // Refresh users list
    } catch (e) {
      setError('Failed to update user role');
    }
  }

  async function handleDelete(id) {
    try {
      const ok = window.confirm('Are you sure you want to delete this user?');
      if (!ok) return;
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (e) {
      setError('Failed to delete user');
    }
  }

  const tableHeaderStyles = "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider";
  const tableCellStyles = "px-6 py-4 whitespace-nowrap text-sm text-gray-900";

  if (checkingAuth) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center py-12">
          <p className="text-gray-600">Checking authorization...</p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center py-12">
          <p className="text-red-600">Access denied. Admin privileges required.</p>
        </div>
      </div>
    );
  }

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="border-b border-gray-200 pb-3 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="text-sm text-gray-600 mt-1">Manage user roles and permissions</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className={tableHeaderStyles}>User</th>
              <th className={tableHeaderStyles}>Role</th>
              <th className={tableHeaderStyles}>Joined</th>
              <th className={tableHeaderStyles}>Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map(user => (
              <tr key={user.id}>
                <td className={tableCellStyles}>{user.email}</td>
                <td className={tableCellStyles}>{user.role}</td>
                <td className={tableCellStyles}>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <div className="flex items-center gap-3">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user.id, e.target.value)}
                      className="border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Member">Member</option>
                      <option value="Contributor">Contributor</option>
                      <option value="Editor">Editor</option>
                      <option value="Admin">Admin</option>
                    </select>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}