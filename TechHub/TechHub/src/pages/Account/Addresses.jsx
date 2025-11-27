import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import { useAuth } from '../../context/AuthContext';
import { getProfile, updateProfile } from '../../api/users';
import { emptyAddress, normalizeAddress } from '../../utils/profile';
import './Account.css';

const Addresses = () => {
  const { user, updateUser } = useAuth();
  const [address, setAddress] = useState(normalizeAddress(user?.address));
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const breadcrumbItems = useMemo(() => ([
    { label: 'Home', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Addresses', path: '/addresses' },
  ]), []);

  useEffect(() => {
    setAddress(normalizeAddress(user?.address));
  }, [user]);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profile = await getProfile();
        setAddress(normalizeAddress(profile.address));
        updateUser(profile);
      } catch (error) {
        toast.error(error.message || 'Failed to load addresses');
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [updateUser]);

  const handleChange = (field, value) => {
    setAddress((prev) => ({
      ...normalizeAddress(prev),
      [field]: value,
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedProfile = await updateProfile({
        ...user,
        address: address?.street ? address : emptyAddress,
      });
      updateUser(updatedProfile);
      toast.success('Address saved');
    } catch (error) {
      toast.error(error.message || 'Failed to save address');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="account-page">
      <Breadcrumb items={breadcrumbItems} />
      <div className="account-container">
        <h1 className="page-title">Addresses</h1>
        {loading ? (
          <div className="loading">Loading address...</div>
        ) : (
          <div className="addresses-list">
            <div className="address-card">
              <div className="address-header">
                <h3>Default Shipping Address</h3>
                <span className="default-badge">Default</span>
              </div>
              <div className="address-form">
                <div className="form-group">
                  <label>Street</label>
                  <input
                    type="text"
                    value={address.street}
                    onChange={(e) => handleChange('street', e.target.value)}
                    placeholder="Street address"
                  />
                </div>
                <div className="form-group">
                  <label>City</label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                    placeholder="City"
                  />
                </div>
                <div className="form-group">
                  <label>State / Governorate</label>
                  <input
                    type="text"
                    value={address.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                    placeholder="State or governorate"
                  />
                </div>
                <div className="form-group">
                  <label>ZIP / Postal Code</label>
                  <input
                    type="text"
                    value={address.zipCode}
                    onChange={(e) => handleChange('zipCode', e.target.value)}
                    placeholder="ZIP or postal code"
                  />
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input
                    type="text"
                    value={address.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                    placeholder="Country"
                  />
                </div>
              </div>
              <div className="address-actions">
                <button
                  className="edit-btn"
                  type="button"
                  onClick={handleSave}
                  disabled={saving}
                >
                  {saving ? 'Saving...' : 'Save Address'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Addresses;

