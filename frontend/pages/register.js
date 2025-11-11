import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { register } from '../services/auth';
import { setAuthToken } from '../services/api';

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    confirmEmail: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    displayName: '',
    bio: '',
    dateOfBirth: '',
    websiteUrl: '',
  });
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.email !== formData.confirmEmail) {
      setError('Emails do not match.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setError('');
    setLoading(true);

    const data = new FormData();
    for (const key in formData) {
      data.append(key, formData[key]);
    }
    if (profilePicture) {
      data.append('profilePicture', profilePicture);
    }

    try {
      const { token, user } = await register(data);
      setAuthToken(token);
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_role', user.role);
        localStorage.setItem('user_email', user.email);
      }
      window.alert('Sign up successful! Please sign in.');
      router.push('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyles = "w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black";
  const buttonStyles = "w-full bg-black text-white px-4 py-2 rounded disabled:opacity-50 hover:bg-gray-800";
  const labelStyles = "block text-sm font-bold mb-1";

  return (
    <div className="max-w-md mx-auto mt-12 p-4">
      <h1 className="text-3xl font-bold text-center mb-8">Create an Account</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className={labelStyles}>Username*</label>
          <input id="username" type="text" name="username" className={inputStyles} value={formData.username} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="email" className={labelStyles}>Email*</label>
          <input id="email" type="email" name="email" className={inputStyles} value={formData.email} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="confirmEmail" className={labelStyles}>Confirm Email*</label>
          <input id="confirmEmail" type="email" name="confirmEmail" className={inputStyles} value={formData.confirmEmail} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="password" className={labelStyles}>Password*</label>
          <input id="password" type="password" name="password" className={inputStyles} value={formData.password} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="confirmPassword" className={labelStyles}>Confirm Password*</label>
          <input id="confirmPassword" type="password" name="confirmPassword" className={inputStyles} value={formData.confirmPassword} onChange={handleChange} required />
        </div>
        <div>
          <label htmlFor="firstName" className={labelStyles}>First Name</label>
          <input id="firstName" type="text" name="firstName" className={inputStyles} value={formData.firstName} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="lastName" className={labelStyles}>Last Name</label>
          <input id="lastName" type="text" name="lastName" className={inputStyles} value={formData.lastName} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="displayName" className={labelStyles}>Display Name</label>
          <input id="displayName" type="text" name="displayName" className={inputStyles} value={formData.displayName} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="bio" className={labelStyles}>Bio</label>
          <textarea id="bio" name="bio" className={inputStyles} value={formData.bio} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="dateOfBirth" className={labelStyles}>Date of Birth</label>
          <input id="dateOfBirth" type="date" name="dateOfBirth" className={inputStyles} value={formData.dateOfBirth} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="websiteUrl" className={labelStyles}>Website URL</label>
          <input id="websiteUrl" type="url" name="websiteUrl" className={inputStyles} value={formData.websiteUrl} onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="profilePicture" className={labelStyles}>Profile Picture</label>
          <input id="profilePicture" type="file" name="profilePicture" className={inputStyles} onChange={handleFileChange} />
        </div>
        <button disabled={loading} className={buttonStyles}>
          {loading ? 'Creating account...' : 'Sign Up'}
        </button>
      </form>
      {error && <div className="text-red-600 mt-4 text-center">{error}</div>}
      <div className="mt-6 text-center">
        <p>
          Already have an account?{' '}
          <Link href="/login" className="font-bold underline hover:text-gray-700">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
