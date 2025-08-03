import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import apiService from '../../services/apiService';

const AdminUsers = () => {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin'
  });
  const [formErrors, setFormErrors] = useState({});

  // Load admins on component mount
  useEffect(() => {
    loadAdmins();
  }, []);

  const loadAdmins = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAdminUsers();
      setAdmins(response);
      setError('');
    } catch (err) {
      setError('Failed to load admin users');
      console.error('Error loading admins:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAdmin = async (e) => {
    e.preventDefault();
    
    // Validate form
    const errors = {};
    if (!formData.email) errors.email = 'Email is required';
    if (!formData.password) errors.password = 'Password is required';
    if (formData.password && formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');
      
      await apiService.createAdminUser(formData.email, formData.password, formData.role);
      
      setSuccess(`Admin user ${formData.email} created successfully!`);
      setShowCreateForm(false);
      setFormData({ email: '', password: '', role: 'admin' });
      setFormErrors({});
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
      loadAdmins(); // Reload the list
    } catch (err) {
      console.error('Create admin error:', err);
      setFormErrors({ submit: err.message || 'Failed to create admin' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAdmin = async (adminId) => {
    try {
      await apiService.deleteAdminUser(adminId);
      setShowDeleteConfirm(null);
      loadAdmins(); // Reload the list
    } catch (err) {
      setError('Failed to delete admin');
      console.error('Error deleting admin:', err);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear field-specific errors
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="admin-card" style={{ 
        background: 'white',
        border: '1px solid #e5e7eb',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="admin-card-content" style={{ padding: '32px' }}>
          <div className="flex justify-between items-start">
            <div style={{ flex: 1 }}>
              <div className="flex items-center" style={{ marginBottom: '16px', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                    <circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-title-1" style={{ 
                    margin: 0,
                    color: 'var(--text-primary)'
                  }}>
                    Admin Users
                  </h1>
                  <p className="text-body text-secondary" style={{ margin: '4px 0 0 0' }}>
                    System access and permissions
                  </p>
                </div>
              </div>
              <p className="text-body text-secondary" style={{ 
                marginBottom: '0',
                lineHeight: '1.6',
                maxWidth: '600px'
              }}>
                Manage admin access to the system. Create, view, and remove administrator accounts with different permission levels.
              </p>
            </div>
            <div style={{ marginLeft: '24px' }}>
              <button
                onClick={() => setShowCreateForm(true)}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 8px rgba(0, 122, 255, 0.2)'
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="12" y1="5" x2="12" y2="19"/>
                  <line x1="5" y1="12" x2="19" y2="12"/>
                </svg>
                <span>Add Admin</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="admin-card bg-error-color bg-opacity-10 border border-error-color border-opacity-20">
          <p className="text-error">{error}</p>
        </div>
      )}

      {/* Success Display */}
      {success && (
        <div className="admin-card bg-green-100 border border-green-300">
          <p className="text-green-700">{success}</p>
        </div>
      )}

      {/* Admin Users List */}
      <div className="admin-card" style={{ 
        background: 'white',
        border: '1px solid #e5e7eb'
      }}>
        <div className="admin-card-content" style={{ padding: '32px' }}>
          <div className="flex items-center" style={{ marginBottom: '24px', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'var(--primary-color)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white'
            }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div>
              <h2 className="text-title-2" style={{ margin: 0, color: 'var(--text-primary)' }}>
                Current Admins
              </h2>
              <p className="text-body text-secondary" style={{ margin: '2px 0 0 0', fontSize: '14px' }}>
                {admins.length} active admin user{admins.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          
          {admins.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '48px 24px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                width: '64px',
                height: '64px',
                background: '#e2e8f0',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
                color: '#64748b'
              }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <p className="text-secondary" style={{ fontSize: '16px', fontWeight: '500' }}>
                No admin users found
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {admins.map((admin, index) => (
                <motion.div
                  key={admin.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '20px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f1f5f9';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div className="flex items-center" style={{ gap: '16px' }}>
                    <div style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '18px',
                      fontWeight: '600',
                      boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
                    }}>
                      {admin.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-body" style={{ 
                        margin: 0, 
                        fontWeight: '600', 
                        color: 'var(--text-primary)',
                        marginBottom: '4px'
                      }}>
                        {admin.email}
                      </p>
                      <div className="flex items-center" style={{ gap: '8px', fontSize: '13px' }}>
                        <span style={{
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          background: admin.role === 'SUPER_ADMIN' 
                            ? 'rgba(147, 51, 234, 0.1)' 
                            : 'rgba(59, 130, 246, 0.1)',
                          color: admin.role === 'SUPER_ADMIN' 
                            ? '#7c3aed' 
                            : 'var(--primary-color)',
                          border: admin.role === 'SUPER_ADMIN'
                            ? '1px solid rgba(147, 51, 234, 0.2)'
                            : '1px solid rgba(59, 130, 246, 0.2)'
                        }}>
                          {admin.role === 'SUPER_ADMIN' ? '👑 Super Admin' : '👤 Admin'}
                        </span>
                        <span className="text-tertiary" style={{ fontWeight: 'bold' }}>•</span>
                        <span className="text-secondary" style={{ fontWeight: '500' }}>
                          Created {new Date(admin.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center" style={{ gap: '8px' }}>
                    {admin.role !== 'SUPER_ADMIN' && (
                      <button
                        onClick={() => setShowDeleteConfirm(admin)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          padding: '8px 16px',
                          background: 'rgba(239, 68, 68, 0.1)',
                          color: '#dc2626',
                          border: '1px solid rgba(239, 68, 68, 0.2)',
                          borderRadius: '8px',
                          fontSize: '13px',
                          fontWeight: '600',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.background = '#fef2f2';
                          e.target.style.borderColor = '#fca5a5';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                          e.target.style.borderColor = 'rgba(239, 68, 68, 0.2)';
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="3,6 5,6 21,6"/>
                          <path d="M19,6V20a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6M8,6V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2V6"/>
                        </svg>
                        Delete
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Admin Modal */}
      {showCreateForm && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => {
            setShowCreateForm(false);
            setFormData({ email: '', password: '', role: 'admin' });
            setFormErrors({});
          }}
        >
          <motion.div
            className="modal-container"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '600px' }}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <h2>Create New Admin User</h2>
              <button 
                onClick={() => {
                  setShowCreateForm(false);
                  setFormData({ email: '', password: '', role: 'admin' });
                  setFormErrors({});
                }} 
                className="modal-close"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <form onSubmit={handleCreateAdmin} className="modal-form">
              <div className="form-sections">
                {/* Account Information */}
                <div className="form-section">
                  <h3 className="form-section-title">Account Information</h3>
                  
                  <div className="form-field">
                    <label>Email Address *</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="admin@example.com"
                      required
                      style={{
                        borderColor: formErrors.email ? 'var(--error-color)' : undefined
                      }}
                    />
                    {formErrors.email && (
                      <div className="error-message" style={{ marginTop: '8px' }}>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <line x1="15" y1="9" x2="9" y2="15"/>
                          <line x1="9" y1="9" x2="15" y2="15"/>
                        </svg>
                        {formErrors.email}
                      </div>
                    )}
                  </div>

                  <div className="form-row">
                    <div className="form-field">
                      <label>Password *</label>
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Minimum 8 characters"
                        required
                        style={{
                          borderColor: formErrors.password ? 'var(--error-color)' : undefined
                        }}
                      />
                      {formErrors.password && (
                        <div className="error-message" style={{ marginTop: '8px' }}>
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <line x1="15" y1="9" x2="9" y2="15"/>
                            <line x1="9" y1="9" x2="15" y2="15"/>
                          </svg>
                          {formErrors.password}
                        </div>
                      )}
                    </div>

                    <div className="form-field">
                      <label>Admin Role *</label>
                      <select
                        value={formData.role}
                        onChange={(e) => handleInputChange('role', e.target.value)}
                        required
                      >
                        <option value="ADMIN">Regular Admin</option>
                        <option value="SUPER_ADMIN">Super Admin</option>
                      </select>
                    </div>
                  </div>

                  {/* Role Description */}
                  <div style={{
                    padding: '16px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    marginTop: '16px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                      <div style={{
                        width: '20px',
                        height: '20px',
                        background: 'var(--primary-color)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '2px'
                      }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M9,12l2,2 4,-4"/>
                        </svg>
                      </div>
                      <div>
                        <p style={{ 
                          fontWeight: '600', 
                          color: 'var(--text-primary)', 
                          margin: '0 0 4px 0',
                          fontSize: '14px'
                        }}>
                          {formData.role === 'SUPER_ADMIN' ? 'Super Admin Permissions' : 'Regular Admin Permissions'}
                        </p>
                        <p style={{ 
                          color: 'var(--text-secondary)', 
                          margin: 0,
                          fontSize: '13px',
                          lineHeight: '1.4'
                        }}>
                          {formData.role === 'SUPER_ADMIN' 
                            ? 'Full system access including user management, system settings, and all content management features.'
                            : 'Access to content management (communities, listings, properties) but cannot manage other admin users.'
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  {formErrors.submit && (
                    <div className="error-message" style={{ marginTop: '16px' }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                      {formErrors.submit}
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormData({ email: '', password: '', role: 'admin' });
                    setFormErrors({});
                  }}
                  className="btn-secondary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: 'white',
                    color: '#64748b',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: loading ? '#94a3b8' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: loading ? 'none' : '0 2px 8px rgba(59, 130, 246, 0.2)'
                  }}
                >
                  {loading ? (
                    <>
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255, 255, 255, 0.3)',
                        borderTop: '2px solid white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                        <circle cx="12" cy="7" r="4"/>
                      </svg>
                      Create Admin User
                    </>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowDeleteConfirm(null)}
        >
          <motion.div
            className="modal-container"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '500px' }}
          >
            {/* Modal Header */}
            <div className="modal-header">
              <h2>Delete Admin User</h2>
              <button onClick={() => setShowDeleteConfirm(null)} className="modal-close">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="modal-form">
              <div className="form-sections">
                <div className="form-section">
                  <div style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '16px',
                    padding: '16px',
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: '12px'
                  }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: '#dc2626',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0
                    }}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="15" y1="9" x2="9" y2="15"/>
                        <line x1="9" y1="9" x2="15" y2="15"/>
                      </svg>
                    </div>
                    <div>
                      <h3 style={{
                        fontSize: '16px',
                        fontWeight: '600',
                        color: '#991b1b',
                        margin: '0 0 8px 0'
                      }}>
                        Permanent Action Warning
                      </h3>
                      <p style={{
                        color: '#7f1d1d',
                        margin: '0',
                        fontSize: '14px',
                        lineHeight: '1.5'
                      }}>
                        Are you sure you want to delete the admin user{' '}
                        <strong style={{ fontWeight: '700' }}>{showDeleteConfirm.email}</strong>?
                        <br /><br />
                        This action cannot be undone and will immediately revoke all access permissions for this user.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="modal-footer">
                <button
                  onClick={() => setShowDeleteConfirm(null)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: 'white',
                    color: '#64748b',
                    border: '2px solid #e2e8f0',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteAdmin(showDeleteConfirm.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '12px 24px',
                    background: '#dc2626',
                    color: 'white',
                    border: 'none',
                    borderRadius: '12px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: '0 2px 8px rgba(220, 38, 38, 0.2)'
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3,6 5,6 21,6"/>
                    <path d="M19,6V20a2,2 0 0,1 -2,2H7a2,2 0 0,1 -2,-2V6M8,6V4a2,2 0 0,1 2,-2h4a2,2 0 0,1 2,2V6"/>
                  </svg>
                  Delete Admin
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default AdminUsers; 