import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../../services/apiService';

const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCommunities();
  }, []);

  const fetchCommunities = async () => {
    try {
      const data = await apiService.getCommunities();
      setCommunities(data);
    } catch (error) {
      console.error('Error fetching communities:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, event) => {
    event.stopPropagation();
    
    const community = communities.find(c => c.id === id);
    if (window.confirm(`Are you sure you want to delete "${community?.name}"? This action cannot be undone.`)) {
      try {
        await apiService.deleteCommunity(id);
        setCommunities(communities.filter(c => c.id !== id));
        
        // Show success notification
        showNotification('Community deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting community:', error);
        showNotification('Failed to delete community', 'error');
      }
    }
  };

  const handleEdit = (community) => {
    setEditingCommunity(community);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingCommunity(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCommunity(null);
  };

  const handleSave = () => {
    fetchCommunities();
    handleCloseForm();
    showNotification(
      editingCommunity ? 'Community updated successfully' : 'Community created successfully',
      'success'
    );
  };

  const showNotification = (message, type) => {
    // Simple notification system
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: 16px 24px;
      border-radius: 12px;
      color: white;
      font-weight: 600;
      z-index: 10000;
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
      transform: translateX(100%);
      transition: transform 0.3s ease;
      background: ${type === 'success' ? '#10B981' : '#EF4444'};
    `;
    
    document.body.appendChild(notification);
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
  };

  const filteredCommunities = communities.filter(community =>
    community.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    community.location?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading communities...</p>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title">
          <h1>Communities</h1>
          <p>Manage your community listings and details</p>
        </div>
        <button onClick={handleAddNew} className="btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Community
        </button>
      </div>

      {/* Search and Filters */}
      <div className="admin-controls">
        <div className="search-container">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"></circle>
            <path d="m21 21-4.35-4.35"></path>
          </svg>
          <input
            type="text"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="stats-summary">
          <span className="stat">
            <strong>{communities.length}</strong> Total Communities
          </span>
          <span className="stat">
            <strong>{filteredCommunities.length}</strong> Showing
          </span>
        </div>
      </div>

      {/* Communities Grid */}
      {filteredCommunities.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏘️</div>
          <h3>No communities found</h3>
          <p>
            {searchTerm 
              ? `No communities match "${searchTerm}". Try adjusting your search.`
              : "Get started by creating your first community listing."
            }
          </p>
          {!searchTerm && (
            <button onClick={handleAddNew} className="btn-primary">
              Create First Community
            </button>
          )}
        </div>
      ) : (
        <motion.div 
          className="communities-grid"
          layout
        >
          <AnimatePresence>
            {filteredCommunities.map((community) => (
              <motion.div
                key={community.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                <CommunityCard 
                  community={community} 
                  onEdit={() => handleEdit(community)}
                  onDelete={(e) => handleDelete(community.id, e)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <CommunityFormModal
            community={editingCommunity}
            onClose={handleCloseForm}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Modern Community Card Component
const CommunityCard = ({ community, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div 
      className="community-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onEdit}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image Section */}
      <div className="community-card-image">
        <img 
          src={community.image || '/images/communities/default.jpg'} 
          alt={community.name}
          onError={(e) => {
            e.target.src = '/images/communities/default.jpg';
          }}
        />
        
        {/* Quick Actions Overlay */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="card-actions-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit();
                }}
                className="action-btn action-btn-edit"
                title="Edit community"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button
                onClick={onDelete}
                className="action-btn action-btn-delete"
                title="Delete community"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3,6 5,6 21,6"></polyline>
                  <path d="M19,6v14a2,2,0,0,1-2,2H7a2,2,0,0,1-2-2V6m3,0V4a2,2,0,0,1,2-2h4a2,2,0,0,1,2,2V6"></path>
                </svg>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Content Section */}
      <div className="community-card-content">
        <div className="community-card-header">
          <h3 className="community-name">{community.name}</h3>
          <p className="community-location">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {community.location}
          </p>
        </div>

        <p className="community-description">
          {community.description && community.description.length > 120 
            ? `${community.description.substring(0, 120)}...` 
            : community.description || 'No description available'}
        </p>

        <div className="community-card-footer">
          <div className="community-stats">
            <span className="stat-item">
              <strong>{community.totalHomes || 0}</strong> homes
            </span>
            <span className="stat-item price-range">
              {community.priceRange || 'Price on request'}
            </span>
          </div>
          
          <div className="edit-indicator">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6"></path>
            </svg>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Modern Form Modal Component
const CommunityFormModal = ({ community, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    priceRange: '',
    totalHomes: '',
    image: '',
    ...community
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const dataToSave = {
        ...formData,
        image: uploadedImage || formData.image
      };

      if (community) {
        await apiService.updateCommunity(community.id, dataToSave);
      } else {
        await apiService.createCommunity(dataToSave);
      }
      onSave();
    } catch (error) {
      setError(error.message || 'Failed to save community');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (file) => {
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const token = localStorage.getItem('adminToken');
          const response = await fetch('/api/upload', {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              filename: `${Date.now()}-${file.name}`,
              file: reader.result
            })
          });

          const data = await response.json();
          
          if (data.success) {
            setUploadedImage(data.url);
            setError('');
          } else {
            setError(data.error || 'Upload failed');
          }
        } catch (error) {
          setError('Upload failed');
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      setError('Upload failed');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleImageUpload(files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragActive(false);
  };

  const getCurrentImage = () => {
    return uploadedImage || formData.image || '/images/communities/default.jpg';
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-container"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <h2>{community ? 'Edit Community' : 'Create New Community'}</h2>
          <button onClick={onClose} className="modal-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            {/* Basic Information */}
            <div className="form-section">
              <h3 className="form-section-title">Basic Information</h3>
              
              <div className="form-row">
                <div className="form-field">
                  <label>Community Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter community name"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Northwest Houston, TX"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe the community features, amenities, and lifestyle..."
                  rows={4}
                  required
                />
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Price Range</label>
                  <input
                    type="text"
                    value={formData.priceRange}
                    onChange={(e) => setFormData({ ...formData, priceRange: e.target.value })}
                    placeholder="e.g., $300K - $500K"
                  />
                </div>

                <div className="form-field">
                  <label>Total Homes</label>
                  <input
                    type="number"
                    value={formData.totalHomes}
                    onChange={(e) => setFormData({ ...formData, totalHomes: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload */}
            <div className="form-section">
              <h3 className="form-section-title">Community Image</h3>
              
              <div className="image-upload-section">
                <div className="current-image">
                  <img src={getCurrentImage()} alt="Community preview" />
                </div>

                <div
                  className={`image-dropzone ${dragActive ? 'drag-active' : ''}`}
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                >
                  <div className="dropzone-content">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                      <circle cx="8.5" cy="8.5" r="1.5"></circle>
                      <polyline points="21,15 16,10 5,21"></polyline>
                    </svg>
                    <h4>Upload Community Image</h4>
                    <p>Drag & drop an image here, or click to browse</p>
                    <p className="file-types">Supports: JPG, PNG, WebP (Max 5MB)</p>
                  </div>
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      if (e.target.files && e.target.files[0]) {
                        handleImageUpload(e.target.files[0]);
                      }
                    }}
                    className="file-input"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="15" y1="9" x2="9" y2="15"></line>
                <line x1="9" y1="9" x2="15" y2="15"></line>
              </svg>
              {error}
            </div>
          )}

          {/* Modal Footer */}
          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? (
                <>
                  <div className="spinner"></div>
                  {community ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                community ? 'Update Community' : 'Create Community'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Communities; 