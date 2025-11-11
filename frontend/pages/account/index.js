import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../../services/api';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [saving, setSaving] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/users/me');
        setUser(response.data);
        setFormData(response.data);
      } catch (err) {
        if (err.response?.status === 401) {
          router.push('/login');
        } else {
          setError('Failed to load profile');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    try {
      const response = await api.put('/users/me', formData);
      setUser(response.data);
      setIsEditing(false);
      // Update localStorage with new email if changed
      if (response.data.email !== user.email) {
        localStorage.setItem('user_email', response.data.email);
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setIsEditing(false);
    setError('');
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-[0.15rem] p-6">
        <div className="text-center">Loading profile...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-[0.15rem] p-6">
        <div className="text-center text-red-600">{error}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto mt-[0.15rem] p-6">
        <div className="text-center">Profile not found</div>
      </div>
    );
  }

  const inputStyles = "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black";
  const labelStyles = "block text-sm font-bold mb-1";

  return (
    <div className="max-w-2xl mx-auto mt-[0.15rem] p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
          >
            Edit Profile
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg p-6">
        {isEditing ? (
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className={labelStyles}>Username</label>
              <input
                id="username"
                name="username"
                type="text"
                className={inputStyles}
                value={formData.username || ''}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="email" className={labelStyles}>Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className={inputStyles}
                value={formData.email || ''}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="firstName" className={labelStyles}>First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className={inputStyles}
                value={formData.firstName || ''}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="lastName" className={labelStyles}>Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className={inputStyles}
                value={formData.lastName || ''}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="displayName" className={labelStyles}>Display Name</label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                className={inputStyles}
                value={formData.displayName || ''}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="bio" className={labelStyles}>Bio</label>
              <textarea
                id="bio"
                name="bio"
                className={inputStyles}
                rows="3"
                value={formData.bio || ''}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="dateOfBirth" className={labelStyles}>Date of Birth</label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                className={inputStyles}
                value={formData.dateOfBirth ? formData.dateOfBirth.split('T')[0] : ''}
                onChange={handleInputChange}
              />
            </div>

            <div>
              <label htmlFor="websiteUrl" className={labelStyles}>Website URL</label>
              <input
                id="websiteUrl"
                name="websiteUrl"
                type="url"
                className={inputStyles}
                value={formData.websiteUrl || ''}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex space-x-4 pt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-black text-white px-6 py-2 rounded hover:bg-gray-800 disabled:opacity-50"
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
              <p className="text-gray-900">{user.username || 'Not set'}</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email</label>
              <p className="text-gray-900">{user.email}</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
              <p className="text-gray-900">{user.firstName || 'Not set'}</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
              <p className="text-gray-900">{user.lastName || 'Not set'}</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Display Name</label>
              <p className="text-gray-900">{user.displayName || 'Not set'}</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Bio</label>
              <p className="text-gray-900">{user.bio || 'Not set'}</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Date of Birth</label>
              <p className="text-gray-900">{user.dateOfBirth ? new Date(user.dateOfBirth).toLocaleDateString() : 'Not set'}</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Website</label>
              <p className="text-gray-900">
                {user.websiteUrl ? (
                  <a href={user.websiteUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {user.websiteUrl}
                  </a>
                ) : 'Not set'}
              </p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Role</label>
              <p className="text-gray-900 capitalize">{user.role}</p>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Member Since</label>
              <p className="text-gray-900">{new Date(user.createdAt).toLocaleDateString()}</p>
            </div>

            {user.profilePictureUrl && (
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Profile Picture</label>
                <img
                  src={user.profilePictureUrl}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}