import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import apiService from '../../services/apiService';
import { UIUtils } from '../../services/utils';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [listingsData, communitiesData] = await Promise.all([
        apiService.getListings(),
        apiService.getCommunities()
      ]);
      setListings(listingsData);
      setCommunities(communitiesData);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, event) => {
    event.stopPropagation();
    
    const listing = listings.find(l => l.id === id);
    if (window.confirm(`Are you sure you want to delete "${listing?.title}"? This action cannot be undone.`)) {
      try {
        await apiService.deleteListing(id);
        setListings(listings.filter(l => l.id !== id));
        showNotification('Listing deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting listing:', error);
        showNotification('Failed to delete listing', 'error');
      }
    }
  };

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setShowForm(true);
  };

  const handleAddNew = () => {
    setEditingListing(null);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingListing(null);
  };

  const handleSave = () => {
    fetchData();
    handleCloseForm();
    showNotification(
      editingListing ? 'Listing updated successfully' : 'Listing created successfully',
      'success'
    );
  };

  const showNotification = (message, type) => {
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

  const filteredListings = listings.filter(listing => {
    const matchesSearch = listing.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         listing.address?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || listing.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: listings.length,
    AVAILABLE: listings.filter(l => l.status === 'AVAILABLE').length,
    PENDING: listings.filter(l => l.status === 'PENDING').length,
    SOLD: listings.filter(l => l.status === 'SOLD').length
  };

  if (loading) {
    return (
      <div className="admin-loading">
        <div className="loading-spinner"></div>
        <p>Loading listings...</p>
      </div>
    );
  }

  return (
    <div className="admin-page-container">
      {/* Page Header */}
      <div className="admin-page-header">
        <div className="admin-page-title">
          <h1>Property Listings</h1>
          <p>Manage your property inventory and availability</p>
        </div>
        <button onClick={handleAddNew} className="btn-primary">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          Add Listing
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
            placeholder="Search listings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-tabs">
          {Object.entries(statusCounts).map(([status, count]) => (
            <button
              key={status}
              className={`filter-tab ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'all' ? 'All' : status} ({count})
            </button>
          ))}
        </div>
      </div>

      {/* Listings Grid */}
      {filteredListings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏠</div>
          <h3>No listings found</h3>
          <p>
            {searchTerm || filterStatus !== 'all'
              ? `No listings match your current filters. Try adjusting your search or filter criteria.`
              : "Get started by adding your first property listing."
            }
          </p>
          {!searchTerm && filterStatus === 'all' && (
            <button onClick={handleAddNew} className="btn-primary">
              Create First Listing
            </button>
          )}
        </div>
      ) : (
        <motion.div 
          className="listings-grid"
          layout
        >
          <AnimatePresence>
            {filteredListings.map((listing) => {
              const community = communities.find(c => c.id === listing.communityId);
              return (
                <motion.div
                  key={listing.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <ListingCard 
                    listing={listing} 
                    community={community}
                    onEdit={() => handleEdit(listing)}
                    onDelete={(e) => handleDelete(listing.id, e)}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showForm && (
          <ListingFormModal
            listing={editingListing}
            communities={communities}
            onClose={handleCloseForm}
            onSave={handleSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// Modern Listing Card Component
const ListingCard = ({ listing, community, onEdit, onDelete }) => {
  const [isHovered, setIsHovered] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'AVAILABLE': return '#10B981';
      case 'PENDING': return '#F59E0B';
      case 'SOLD': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'AVAILABLE': return 'Available Now';
      case 'PENDING': return 'Pending Sale';
      case 'SOLD': return 'Sold';
      default: return status;
    }
  };

  return (
    <motion.div 
      className="listing-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onEdit}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Image Section */}
      <div className="listing-card-image">
        <div 
          className="image-placeholder"
          style={{ 
            background: `linear-gradient(135deg, ${community?.theme?.primaryColor || '#3b82f6'}15 0%, ${community?.theme?.primaryColor || '#3b82f6'}25 100%)`
          }}
        >
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M3 9.5L12 4l9 5.5v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-10z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
        </div>
        
        {/* Status Badge */}
        <div 
          className="status-badge"
          style={{ backgroundColor: getStatusColor(listing.status) }}
        >
          {getStatusLabel(listing.status)}
        </div>

        {/* Price Badge */}
        <div className="price-badge">
          {UIUtils.formatPrice(listing.price)}
        </div>
        
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
                title="Edit listing"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
              </button>
              <button
                onClick={onDelete}
                className="action-btn action-btn-delete"
                title="Delete listing"
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
      <div className="listing-card-content">
        <div className="listing-card-header">
          <h3 className="listing-title">{listing.title}</h3>
          <p className="listing-address">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {listing.address}
          </p>
          {community && (
            <p className="listing-community" style={{ color: community.theme?.primaryColor || '#3b82f6' }}>
              {community.name}
            </p>
          )}
        </div>

        <div className="listing-features">
          <span className="feature-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9.5L12 4l9 5.5v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1v-10z"/>
            </svg>
            {listing.bedrooms} bed
          </span>
          <span className="feature-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 20v-4a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v4"/>
              <path d="M3 20h18"/>
            </svg>
            {listing.bathrooms} bath
          </span>
          <span className="feature-badge">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <path d="M9 9h6v6H9z"/>
            </svg>
            {listing.sqft?.toLocaleString()} sqft
          </span>
        </div>

        <div className="listing-card-footer">
          <div className="listing-type">
            {listing.type || 'HOUSE'}
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
const ListingFormModal = ({ listing, communities, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    communityId: '',
    type: 'HOUSE',
    status: 'AVAILABLE',
    images: [],
    features: [],
    ...listing
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (listing) {
        await apiService.updateListing(listing.id, formData);
      } else {
        await apiService.createListing(formData);
      }
      onSave();
    } catch (error) {
      setError(error.message || 'Failed to save listing');
    } finally {
      setLoading(false);
    }
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
        className="modal-container listing-modal"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="modal-header">
          <h2>{listing ? 'Edit Property Listing' : 'Create New Listing'}</h2>
          <button onClick={onClose} className="modal-close">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Modal Content */}
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-sections">
            {/* Basic Information */}
            <div className="form-section">
              <h3 className="form-section-title">Property Details</h3>
              
              <div className="form-row">
                <div className="form-field">
                  <label>Property Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="e.g., Beautiful 4BR Home in Riverstone"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Community *</label>
                  <select
                    value={formData.communityId}
                    onChange={(e) => setFormData({ ...formData, communityId: e.target.value })}
                    required
                  >
                    <option value="">Select a community</option>
                    {communities.map(community => (
                      <option key={community.id} value={community.id}>
                        {community.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label>Address *</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full property address"
                  required
                />
              </div>

              <div className="form-field">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  placeholder="Describe the property features, updates, and highlights..."
                />
              </div>
            </div>

            {/* Property Specifications */}
            <div className="form-section">
              <h3 className="form-section-title">Specifications</h3>
              
              <div className="form-row">
                <div className="form-field">
                  <label>Price *</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                    placeholder="0"
                    min="0"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Property Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  >
                    <option value="HOUSE">House</option>
                    <option value="TOWNHOME">Townhome</option>
                    <option value="CONDO">Condo</option>
                    <option value="LOT">Lot</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label>Bedrooms *</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: parseInt(e.target.value) || 0 })}
                    min="0"
                    max="20"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Bathrooms *</label>
                  <input
                    type="number"
                    step="0.5"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: parseFloat(e.target.value) || 0 })}
                    min="0"
                    max="20"
                    required
                  />
                </div>

                <div className="form-field">
                  <label>Square Feet *</label>
                  <input
                    type="number"
                    value={formData.sqft}
                    onChange={(e) => setFormData({ ...formData, sqft: parseInt(e.target.value) || 0 })}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-field">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="PENDING">Pending</option>
                  <option value="SOLD">Sold</option>
                </select>
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
                  {listing ? 'Updating...' : 'Creating...'}
                </>
              ) : (
                listing ? 'Update Listing' : 'Create Listing'
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default Listings; 