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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-title-1 font-bold text-primary">Admin Users</h1>
          <p className="text-body text-secondary">Manage admin access to the system</p>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="btn btn-primary"
        >
          <span className="mr-2">➕</span>
          Add Admin
        </button>
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
      <div className="admin-card">
        <div className="admin-card-content">
          <h2 className="text-title-2 font-semibold text-primary mb-4">Current Admins</h2>
          
          {admins.length === 0 ? (
            <p className="text-secondary">No admin users found.</p>
          ) : (
            <div className="space-y-4">
              {admins.map((admin) => (
                <motion.div
                  key={admin.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-semibold">
                      {admin.email.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-primary">{admin.email}</p>
                      <div className="flex items-center space-x-2 text-sm text-secondary">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          admin.role === 'SUPER_ADMIN' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                        </span>
                        <span>•</span>
                        <span>Created {new Date(admin.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {admin.role !== 'SUPER_ADMIN' && (
                      <button
                        onClick={() => setShowDeleteConfirm(admin)}
                        className="btn btn-danger btn-sm"
                      >
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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-title-2 font-semibold text-primary mb-4">Add New Admin</h3>
            
            <form onSubmit={handleCreateAdmin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`input-field ${formErrors.email ? 'border-error' : ''}`}
                  placeholder="admin@example.com"
                />
                {formErrors.email && (
                  <p className="text-error text-sm mt-1">{formErrors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`input-field ${formErrors.password ? 'border-error' : ''}`}
                  placeholder="Minimum 8 characters"
                />
                {formErrors.password && (
                  <p className="text-error text-sm mt-1">{formErrors.password}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-primary mb-2">
                  Role
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => handleInputChange('role', e.target.value)}
                  className="input-field"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="SUPER_ADMIN">Super Admin</option>
                </select>
              </div>

              {formErrors.submit && (
                <p className="text-error text-sm">{formErrors.submit}</p>
              )}

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowCreateForm(false);
                    setFormData({ email: '', password: '', role: 'admin' });
                    setFormErrors({});
                  }}
                  className="btn btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary flex-1"
                >
                  Create Admin
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md mx-4"
          >
            <h3 className="text-title-2 font-semibold text-primary mb-4">Confirm Delete</h3>
            <p className="text-secondary mb-6">
              Are you sure you want to delete the admin user <strong>{showDeleteConfirm.email}</strong>? 
              This action cannot be undone.
            </p>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAdmin(showDeleteConfirm.id)}
                className="btn btn-danger flex-1"
              >
                Delete Admin
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminUsers; 