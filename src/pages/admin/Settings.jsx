import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

const Settings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'MyHoustonHome',
      siteDescription: 'Premium real estate in Houston',
      contactEmail: 'contact@myhoustonhome.com',
      contactPhone: '(713) 555-0123'
    },
    appearance: {
      primaryColor: '#007AFF',
      logoUrl: '',
      favicon: ''
    },
    seo: {
      metaTitle: 'MyHoustonHome - Premium Real Estate',
      metaDescription: 'Find your dream home in Houston\'s best communities',
      metaKeywords: 'Houston real estate, homes for sale, communities'
    }
  });
  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordErrors, setPasswordErrors] = useState({});

  const handleSave = async (section) => {
    setLoading(true);
    setSaveStatus('');
    
    try {
      // In a real app, you'd save to a backend
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      setSaveStatus('Settings saved successfully!');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('Error saving settings');
      console.error('Error saving settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    // Validate password form
    const errors = {};
    if (!passwordData.currentPassword) errors.currentPassword = 'Current password is required';
    if (!passwordData.newPassword) errors.newPassword = 'New password is required';
    if (passwordData.newPassword.length < 8) {
      errors.newPassword = 'New password must be at least 8 characters';
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    if (Object.keys(errors).length > 0) {
      setPasswordErrors(errors);
      return;
    }

    setLoading(true);
    setPasswordErrors({});
    
    try {
      await apiService.request('/admin/change-password', 'POST', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setSaveStatus('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setPasswordErrors({ submit: error.message || 'Failed to change password' });
    } finally {
      setLoading(false);
    }
  };

  // Helper function to get SVG icons
  const getTabIcon = (iconType) => {
    const iconProps = {
      width: "16",
      height: "16",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2"
    };

    switch (iconType) {
      case 'settings':
        return (
          <svg {...iconProps}>
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        );
      case 'appearance':
        return (
          <svg {...iconProps}>
            <circle cx="12" cy="12" r="7"/>
            <polyline points="12,9 12,12 13.5,13.5"/>
            <path d="M16.24 7.76a6 6 0 0 1 0 8.49m-8.48-.01a6 6 0 0 1 0-8.49"/>
          </svg>
        );
      case 'seo':
        return (
          <svg {...iconProps}>
            <circle cx="11" cy="11" r="8"/>
            <path d="M21 21l-4.35-4.35"/>
          </svg>
        );
      case 'password':
        return (
          <svg {...iconProps}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
            <circle cx="12" cy="16" r="1"/>
            <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const tabs = [
    { id: 'general', name: 'General', icon: 'settings' },
    { id: 'appearance', name: 'Appearance', icon: 'appearance' },
    { id: 'seo', name: 'SEO', icon: 'seo' },
    { id: 'password', name: 'Password', icon: 'password' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-title-1 font-bold text-primary">Settings</h1>
        <p className="text-body text-secondary">Manage your website configuration</p>
      </div>

      {/* Tabs */}
      <div className="tab-container">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
                            <span className="mr-2">{getTabIcon(tab.icon)}</span>
            {tab.name}
          </button>
        ))}
      </div>

      {/* Save Status */}
      {saveStatus && (
        <div className={`p-4 rounded-xl ${
          saveStatus.includes('Error') 
            ? 'bg-error-color bg-opacity-10 border border-error-color border-opacity-20' 
            : 'bg-success-color bg-opacity-10 border border-success-color border-opacity-20'
        }`}>
          <p className={`text-sm ${saveStatus.includes('Error') ? 'text-error' : 'text-success-color'}`}>
            {saveStatus}
          </p>
        </div>
      )}

      {/* Tab Content */}
      <div className="admin-card">
        <div className="admin-card-content">
          {activeTab === 'general' && (
            <div className="space-y-6">
              <h2 className="text-title-2 font-semibold text-primary">General Settings</h2>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Site Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.general.siteName}
                    onChange={(e) => handleInputChange('general', 'siteName', e.target.value)}
                    placeholder="Enter site name"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={settings.general.contactEmail}
                    onChange={(e) => handleInputChange('general', 'contactEmail', e.target.value)}
                    placeholder="Enter contact email"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={settings.general.contactPhone}
                    onChange={(e) => handleInputChange('general', 'contactPhone', e.target.value)}
                    placeholder="Enter contact phone"
                  />
                </div>

                <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                  <label className="form-label">Site Description</label>
                  <textarea
                    className="form-textarea"
                    value={settings.general.siteDescription}
                    onChange={(e) => handleInputChange('general', 'siteDescription', e.target.value)}
                    placeholder="Enter site description"
                    rows={3}
                  />
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => handleSave('general')}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save General Settings'}
              </button>
            </div>
          )}

          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <h2 className="text-title-2 font-semibold text-primary">Appearance Settings</h2>
              
              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      className="w-12 h-12 rounded-lg border border-separator cursor-pointer"
                      value={settings.appearance.primaryColor}
                      onChange={(e) => handleInputChange('appearance', 'primaryColor', e.target.value)}
                    />
                    <input
                      type="text"
                      className="form-input flex-1"
                      value={settings.appearance.primaryColor}
                      onChange={(e) => handleInputChange('appearance', 'primaryColor', e.target.value)}
                      placeholder="#007AFF"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Logo URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={settings.appearance.logoUrl}
                    onChange={(e) => handleInputChange('appearance', 'logoUrl', e.target.value)}
                    placeholder="https://example.com/logo.png"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Favicon URL</label>
                  <input
                    type="url"
                    className="form-input"
                    value={settings.appearance.favicon}
                    onChange={(e) => handleInputChange('appearance', 'favicon', e.target.value)}
                    placeholder="https://example.com/favicon.ico"
                  />
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => handleSave('appearance')}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save Appearance Settings'}
              </button>
            </div>
          )}

          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h2 className="text-title-2 font-semibold text-primary">SEO Settings</h2>
              
              <div className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Meta Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.seo.metaTitle}
                    onChange={(e) => handleInputChange('seo', 'metaTitle', e.target.value)}
                    placeholder="Enter meta title"
                  />
                  <p className="text-sm text-tertiary mt-1">Recommended: 50-60 characters</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Meta Description</label>
                  <textarea
                    className="form-textarea"
                    value={settings.seo.metaDescription}
                    onChange={(e) => handleInputChange('seo', 'metaDescription', e.target.value)}
                    placeholder="Enter meta description"
                    rows={3}
                  />
                  <p className="text-sm text-tertiary mt-1">Recommended: 150-160 characters</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Meta Keywords</label>
                  <input
                    type="text"
                    className="form-input"
                    value={settings.seo.metaKeywords}
                    onChange={(e) => handleInputChange('seo', 'metaKeywords', e.target.value)}
                    placeholder="keyword1, keyword2, keyword3"
                  />
                  <p className="text-sm text-tertiary mt-1">Separate keywords with commas</p>
                </div>
              </div>

              <button
                className="btn btn-primary"
                onClick={() => handleSave('seo')}
                disabled={loading}
              >
                {loading ? 'Saving...' : 'Save SEO Settings'}
              </button>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="space-y-6">
              <h2 className="text-title-2 font-semibold text-primary">Change Password</h2>
              
              <form onSubmit={handlePasswordChange} className="space-y-4">
                <div className="form-group">
                  <label className="form-label">Current Password</label>
                  <input
                    type="password"
                    className={`form-input ${passwordErrors.currentPassword ? 'border-error' : ''}`}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter your current password"
                  />
                  {passwordErrors.currentPassword && (
                    <p className="text-error text-sm mt-1">{passwordErrors.currentPassword}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className={`form-input ${passwordErrors.newPassword ? 'border-error' : ''}`}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter your new password"
                  />
                  {passwordErrors.newPassword && (
                    <p className="text-error text-sm mt-1">{passwordErrors.newPassword}</p>
                  )}
                  <p className="text-sm text-tertiary mt-1">Minimum 8 characters</p>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className={`form-input ${passwordErrors.confirmPassword ? 'border-error' : ''}`}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm your new password"
                  />
                  {passwordErrors.confirmPassword && (
                    <p className="text-error text-sm mt-1">{passwordErrors.confirmPassword}</p>
                  )}
                </div>

                {passwordErrors.submit && (
                  <div className="p-4 rounded-xl bg-error-color bg-opacity-10 border border-error-color border-opacity-20">
                    <p className="text-error text-sm">{passwordErrors.submit}</p>
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? 'Changing Password...' : 'Change Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings; 