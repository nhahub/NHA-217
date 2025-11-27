import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile } from '../../api/users';
import { getInitialProfileForm, normalizeAddress } from '../../utils/profile';
import './Account.css';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState(getInitialProfileForm(user));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const breadcrumbItems = useMemo(() => ([
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Profile', path: '/profile' },
  ]), []);

  useEffect(() => {
    setFormData(getInitialProfileForm(user));
  }, [user]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getProfile();
        setFormData(getInitialProfileForm(profile));
        updateUser(profile);
      } catch (error) {
        toast.error(error.message || 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [updateUser]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      address: {
        ...normalizeAddress(prev.address),
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      const updatedProfile = await updateProfile(formData);
      updateUser(updatedProfile);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="account-page">
        <Breadcrumb items={breadcrumbItems} />
        <div className="account-container">
          <div className="loading">Loading profile...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="account-page">
      <Breadcrumb items={breadcrumbItems} />
      <div className="account-container">
        <h1 className="page-title">Profile</h1>
        <form className="account-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              value={formData.address.street}
              onChange={(e) => handleAddressChange('street', e.target.value)}
              placeholder="Street address"
            />
          </div>
          <div className="form-group">
            <label>City</label>
            <input
              type="text"
              value={formData.address.city}
              onChange={(e) => handleAddressChange('city', e.target.value)}
              placeholder="City"
            />
          </div>
          <div className="form-group">
            <label>State / Governorate</label>
            <input
              type="text"
              value={formData.address.state}
              onChange={(e) => handleAddressChange('state', e.target.value)}
              placeholder="State or governorate"
            />
          </div>
          <div className="form-group">
            <label>ZIP / Postal Code</label>
            <input
              type="text"
              value={formData.address.zipCode}
              onChange={(e) => handleAddressChange('zipCode', e.target.value)}
              placeholder="ZIP or postal code"
            />
          </div>
          <div className="form-group">
            <label>Country</label>
            <input
              type="text"
              value={formData.address.country}
              onChange={(e) => handleAddressChange('country', e.target.value)}
              placeholder="Country"
            />
          </div>

          <button type="submit" className="submit-btn" disabled={saving}>
            {saving ? 'Saving...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;

