import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DataService, Community, Listing, NotificationService, UIUtils } from '../services/dataService';

const AdminPage = () => {
  const [activeTab, setActiveTab] = useState('communities');
  const [communities, setCommunities] = useState([]);
  const [listings, setListings] = useState([]);
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    refreshData();
  }, []);

  const refreshData = () => {
    setCommunities(DataService.getCommunities());
    setListings(DataService.getListings());
    setContacts(DataService.getContacts());
  };

  const tabs = [
    { id: 'communities', label: 'Communities', count: communities.length },
    { id: 'listings', label: 'Listings', count: listings.length },
    { id: 'contacts', label: 'Contacts', count: contacts.length }
  ];

  return (
    <div className="admin-page">
      <div className="container section">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="section-header flex justify-between items-center">
            <div>
              <h1 className="section-title">Admin Portal</h1>
              <p className="section-subtitle">
                Manage your communities, listings, and customer contacts
              </p>
            </div>
            <button
              className="btn btn-secondary"
              onClick={() => {
                localStorage.removeItem('communities');
                localStorage.removeItem('listings');
                import('../services/dataService').then(ds => {
                  ds.DataService.initializeExampleData();
                  window.location.reload();
                });
              }}
            >
              Reset Example Data
            </button>
          </div>

          {/* Tabs */}
          <div className="flex justify-center">
            <div className="tab-container">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
                >
                  {tab.label}
                  <span className="tab-count">({tab.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'communities' && (
              <CommunitiesTab communities={communities} onRefresh={refreshData} />
            )}
            {activeTab === 'listings' && (
              <ListingsTab listings={listings} communities={communities} onRefresh={refreshData} />
            )}
            {activeTab === 'contacts' && (
              <ContactsTab contacts={contacts} onRefresh={refreshData} />
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

const CommunitiesTab = ({ communities, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState(null);

  const handleEdit = (community) => {
    setEditingCommunity(community);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this community?')) {
      DataService.deleteCommunity(id);
      onRefresh();
      NotificationService.show('Community deleted successfully', 'success');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingCommunity(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-title-2 font-bold">Communities</h2>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          Add Community
        </button>
      </div>

      <div className="flex flex-wrap gap-6 p-2 justify-start">
        {communities.map((community) => (
          <motion.div
            key={community.id}
            className="card cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => handleEdit(community)}
          >
            {/* Image placeholder at the top */}
            <div style={{ width: '100%', height: 180, background: '#E5E5EA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="40" height="40" fill="#B0B0B8" viewBox="0 0 24 24"><rect width="100%" height="100%" rx="10" fill="#E5E5EA"/><path d="M7 17l5-5 5 5" stroke="#B0B0B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="10" r="1" fill="#B0B0B8"/></svg>
            </div>
            {/* Card content below image */}
            <div className="card-content" style={{ padding: '20px' }}>
              <h3 className="text-title-3 font-semibold mb-1" style={{ color: '#111', fontSize: '1rem' }}>
                {community.name}
              </h3>
              <p className="text-callout text-secondary font-medium mb-1" style={{ fontSize: '0.95rem' }}>{community.location}</p>
              <p className="text-body text-tertiary mb-3 leading-relaxed" style={{ fontSize: '0.93rem' }}>
                {community.description.length > 100
                  ? community.description.slice(0, 100).trim() + '...'
                  : community.description}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      {communities.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">🏘️</div>
          <p className="text-body mb-4">No communities yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            Create your first community
          </button>
        </div>
      )}

      {showForm && (
        <CommunityForm
          community={editingCommunity}
          onClose={handleCloseForm}
          onSave={() => {
            onRefresh();
            handleCloseForm();
          }}
        />
      )}
    </div>
  );
};

const ListingsTab = ({ listings, communities, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [editingListing, setEditingListing] = useState(null);

  const handleEdit = (listing) => {
    setEditingListing(listing);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      DataService.deleteListing(id);
      onRefresh();
      NotificationService.show('Listing deleted successfully', 'success');
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingListing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-title-2 font-bold">Listings</h2>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary"
        >
          Add Listing
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {listings.map((listing) => {
          const community = communities.find(c => c.id === listing.communityId);
          return (
            <motion.div
              key={listing.id}
              className="card"
              whileHover={{ scale: 1.01 }}
            >
              <div className="card-content" style={{ cursor: 'pointer' }} onClick={() => handleEdit(listing)}>
                <h3 className="text-title-3 font-semibold mb-2">{listing.title}</h3>
                <p className="text-callout text-secondary mb-1">{listing.address}</p>
                {community && (
                  <p className="text-footnote mb-2" style={{ color: community.theme.primaryColor }}>
                    {community.name}
                  </p>
                )}
                <div className="flex items-center gap-4 text-sm text-secondary mb-2">
                  <span>{listing.bedrooms} bed</span>
                  <span>{listing.bathrooms} bath</span>
                  <span>{listing.sqft.toLocaleString()} sqft</span>
                </div>
                <div className="text-headline font-bold text-primary">
                  {UIUtils.formatPrice(listing.price)}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {listings.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary mb-4">No listings yet.</p>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            Create your first listing
          </button>
        </div>
      )}

      {showForm && (
        <ListingForm
          listing={editingListing}
          communities={communities}
          onClose={handleCloseForm}
          onSave={() => {
            onRefresh();
            handleCloseForm();
          }}
        />
      )}
    </div>
  );
};

const ContactsTab = ({ contacts, onRefresh }) => {
  const handleDelete = (index) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      DataService.deleteContact(index);
      onRefresh();
      NotificationService.show('Contact deleted successfully', 'success');
    }
  };

  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to delete all contacts?')) {
      DataService.clearAllContacts();
      onRefresh();
      NotificationService.show('All contacts deleted successfully', 'success');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-title-2 font-bold">Contact Submissions</h2>
        {contacts.length > 0 && (
          <button
            onClick={handleClearAll}
            className="btn btn-secondary"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 gap-4">
        {contacts.map((contact, index) => (
          <motion.div
            key={index}
            className="card"
            whileHover={{ scale: 1.01 }}
          >
            <div className="card-content">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-4 mb-3">
                    <h3 className="text-title-3 font-semibold">{contact.name}</h3>
                    <span className="text-footnote text-secondary">
                      {UIUtils.formatDate(contact.submittedAt)}
                    </span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-callout">
                      <span className="font-medium">Email:</span> {contact.email}
                    </p>
                    {contact.phone && (
                      <p className="text-callout">
                        <span className="font-medium">Phone:</span> {contact.phone}
                      </p>
                    )}
                    {contact.listingTitle && (
                      <p className="text-callout">
                        <span className="font-medium">Interested in:</span> {contact.listingTitle}
                      </p>
                    )}
                    <p className="text-body text-secondary bg-secondary rounded-lg p-3">
                      {contact.message}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(index)}
                  className="btn-ghost text-error p-2"
                >
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {contacts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-secondary">No contact submissions yet.</p>
        </div>
      )}
    </div>
  );
};

// Forms will continue in the next part due to length...
const CommunityForm = ({ community, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    community || {
      name: '',
      description: '',
      location: '',
      priceRange: '',
      amenities: [],
      builders: [],
      homes: [],
      theme: {
        primaryColor: '#007AFF',
        borderRadius: '12px',
        borderRadiusLarge: '16px'
      },
      sections: {
        hero: { visible: true, title: '', subtitle: '' },
        about: { visible: true, content: '' },
        homes: { visible: true, title: 'Available Homes' },
        builders: { visible: true, title: 'Our Builders' }
      }
    }
  );

  const [amenityInput, setAmenityInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const communityData = new Community(formData);
    DataService.saveCommunity(communityData);
    NotificationService.show(
      community ? 'Community updated successfully!' : 'Community created successfully!',
      'success'
    );
    onSave();
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const addAmenity = () => {
    if (amenityInput.trim()) {
      setFormData(prev => ({
        ...prev,
        amenities: [...prev.amenities, amenityInput.trim()]
      }));
      setAmenityInput('');
    }
  };

  const removeAmenity = (index) => {
    setFormData(prev => ({
      ...prev,
      amenities: prev.amenities.filter((_, i) => i !== index)
    }));
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="text-title-2 font-bold">
            {community ? 'Edit Community' : 'Add Community'}
          </h3>
          <button onClick={onClose} className="modal-close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="form-section">
            <h4 className="form-section-title">Basic Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Price Range</label>
              <input
                type="text"
                name="priceRange"
                value={formData.priceRange}
                onChange={handleChange}
                className="form-input"
                placeholder="e.g., $400K - $800K"
                required
              />
            </div>
          </div>

          <div className="form-section">
            <h4 className="form-section-title">Theme Settings</h4>
            <div className="form-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              <div className="form-group">
                <label className="form-label">Primary Color</label>
                <input
                  type="color"
                  name="theme.primaryColor"
                  value={formData.theme.primaryColor}
                  onChange={handleChange}
                  className="form-input"
                  style={{ height: '48px', maxWidth: '180px' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Border Radius</label>
                <input
                  type="text"
                  name="theme.borderRadius"
                  value={formData.theme.borderRadius}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="12px"
                  style={{ maxWidth: '220px' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Large Border Radius</label>
                <input
                  type="text"
                  name="theme.borderRadiusLarge"
                  value={formData.theme.borderRadiusLarge}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="16px"
                  style={{ maxWidth: '220px' }}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4 className="form-section-title">Amenities</h4>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={amenityInput}
                onChange={(e) => setAmenityInput(e.target.value)}
                className="form-input flex-1"
                placeholder="Add amenity"
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addAmenity())}
              />
              <button type="button" onClick={addAmenity} className="btn btn-secondary">
                Add
              </button>
            </div>
            <div className="flex flex-wrap gap-1">
              {formData.amenities.map((amenity, index) => (
                <span key={index} className="tag">
                  {amenity}
                  <button
                    type="button"
                    onClick={() => removeAmenity(index)}
                    className="tag-remove"
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn btn-primary flex-1">
              {community ? 'Update' : 'Create'} Community
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ListingForm = ({ listing, communities, onClose, onSave }) => {
  const [formData, setFormData] = useState(
    listing || {
      title: '',
      description: '',
      price: '',
      address: '',
      bedrooms: '',
      bathrooms: '',
      sqft: '',
      communityId: '',
      type: 'house',
      status: 'available'
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    const listingData = new Listing({
      ...formData,
      price: parseInt(formData.price),
      bedrooms: parseInt(formData.bedrooms),
      bathrooms: parseInt(formData.bathrooms),
      sqft: parseInt(formData.sqft)
    });
    DataService.saveListing(listingData);
    NotificationService.show(
      listing ? 'Listing updated successfully!' : 'Listing created successfully!',
      'success'
    );
    onSave();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <motion.div
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={onClose}
    >
      <motion.div
        className="modal-content"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="text-title-2 font-bold">
            {listing ? 'Edit Listing' : 'Add Listing'}
          </h3>
          <button onClick={onClose} className="modal-close">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="form-section">
            <h4 className="form-section-title">Basic Information</h4>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="form-textarea"
                rows="3"
              />
            </div>
          </div>

          <div className="form-section">
            <h4 className="form-section-title">Property Details</h4>
            <div className="form-grid">
              <div className="form-group">
                <label className="form-label">Bedrooms</label>
                <input
                  type="number"
                  name="bedrooms"
                  value={formData.bedrooms}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Bathrooms</label>
                <input
                  type="number"
                  name="bathrooms"
                  value={formData.bathrooms}
                  onChange={handleChange}
                  className="form-input"
                  step="0.5"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Square Feet</label>
                <input
                  type="number"
                  name="sqft"
                  value={formData.sqft}
                  onChange={handleChange}
                  className="form-input"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="form-group">
              <label className="form-label">Community</label>
              <select
                name="communityId"
                value={formData.communityId}
                onChange={handleChange}
                className="form-select"
              >
                <option value="">Select Community</option>
                {communities.map((community) => (
                  <option key={community.id} value={community.id}>
                    {community.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="form-select"
              >
                <option value="house">House</option>
                <option value="townhome">Townhome</option>
                <option value="condo">Condo</option>
                <option value="apartment">Apartment</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="form-select"
              >
                <option value="available">Available</option>
                <option value="pending">Pending</option>
                <option value="sold">Sold</option>
              </select>
            </div>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn btn-primary flex-1">
              {listing ? 'Update' : 'Create'} Listing
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AdminPage; 