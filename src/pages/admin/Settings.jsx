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

  const tabs = [
    { id: 'general', name: 'General', icon: '⚙️' },
    { id: 'appearance', name: 'Appearance', icon: '🎨' },
    { id: 'seo', name: 'SEO', icon: '🔍' }
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
            <span className="mr-2">{tab.icon}</span>
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
        </div>
      </div>
    </div>
  );
};

export default Settings; 