import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import api from '../../services/api';

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get('/users/me');
        setUser(response.data);
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

  return (
    <div className="max-w-2xl mx-auto mt-[0.15rem] p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">My Profile</h1>

      <div className="bg-white shadow-md rounded-lg p-6">
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
      </div>
    </div>
  );
}