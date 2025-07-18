import { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { DataService } from '../services/apiService';
import { UIUtils, NotificationService } from '../services/utils';

// Simple data models for the admin interface
class Community {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.name = data.name || '';
    this.description = data.description || '';
    this.location = data.location || '';
    this.priceRange = data.priceRange || '';
    this.image = data.image || '/images/communities/default.jpg';
    this.amenities = data.amenities || [];
    this.builders = data.builders || [];
    this.homes = data.homes || [];
    this.theme = data.theme || {
      primaryColor: '#007AFF',
      borderRadius: '12px',
      borderRadiusLarge: '16px'
    };
    this.sections = data.sections || {
      hero: { 
        visible: true, 
        title: '', 
        subtitle: '',
        backgroundType: 'image',
        backgroundColor: '#ffffff',
        backgroundImage: '',
        backgroundVideo: '',
        backgroundOpacity: 1.0,
        overlayColor: '#ffffff',
        overlayOpacity: 0.85
      },
      about: { visible: true, content: '' },
      homes: { visible: true, title: 'Available Homes' },
      builders: { visible: true, title: 'Our Builders' }
    };
    this.schools = data.schools || [];
    this.references = data.references || [];
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}

class Listing {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.title = data.title || '';
    this.description = data.description || '';
    this.price = data.price || 0;
    this.address = data.address || '';
    this.bedrooms = data.bedrooms || 0;
    this.bathrooms = data.bathrooms || 0;
    this.sqft = data.sqft || 0;
    this.communityId = data.communityId || null;
    this.type = data.type || 'HOUSE';
    this.status = data.status || 'AVAILABLE';
    this.images = data.images || [];
    this.features = data.features || [];
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAdmin, setCurrentAdmin] = useState(null);
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [activeTab, setActiveTab] = useState('communities');
  const [communities, setCommunities] = useState([]);
  const [listings, setListings] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [adminUsers, setAdminUsers] = useState([]);

  useEffect(() => {
    const verifyAuthentication = async () => {
      try {
        if (DataService.isAuthenticated()) {
          const admin = await DataService.verifyAuthentication();
          setCurrentAdmin(admin.admin);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error('Authentication verification failed:', error);
        DataService.logout();
        setIsAuthenticated(false);
        setCurrentAdmin(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifyAuthentication();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;
    refreshData();
  }, [isAuthenticated]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    
    try {
      const response = await DataService.login(loginForm.email, loginForm.password);
      setCurrentAdmin(response.admin);
      setIsAuthenticated(true);
      setLoginForm({ email: '', password: '' });
    } catch (error) {
      setLoginError(error.message || 'Login failed');
    }
  };

  const handleLogout = () => {
    DataService.logout();
    setIsAuthenticated(false);
    setCurrentAdmin(null);
    setLoginForm({ email: '', password: '' });
  };

  const refreshAdminUsers = async () => {
    if (currentAdmin?.role === 'super_admin') {
      try {
        const users = await DataService.getAdminUsers();
        setAdminUsers(users);
      } catch (error) {
        console.error('Error loading admin users:', error);
      }
    }
  };

  const refreshData = async () => {
    try {
      const [communitiesData, listingsData, contactsData] = await Promise.all([
        DataService.getAdminCommunities(),
        DataService.getAdminListings(),
        DataService.getAdminContacts()
      ]);
      setCommunities(communitiesData || []);
      setListings(listingsData || []);
      setContacts(contactsData || []);
      await refreshAdminUsers();
    } catch (error) {
      console.error('Error refreshing data:', error);
      if (error.message.includes('Authentication expired')) {
        handleLogout();
      }
      // Fallback will be handled automatically by the DataService
    }
  };

  // Show loading spinner while verifying authentication
  if (isLoading) {
    return (
      <div className="admin-page">
        <div className="container section">
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <div className="loading-spinner"></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
              Verifying authentication...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="admin-page">
        <div className="container section">
          <div style={{ 
            maxWidth: '400px', 
            margin: '0 auto', 
            padding: '3rem',
            background: 'var(--surface-color)',
            borderRadius: 'var(--radius-2xl)',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <h1 className="text-title-2 font-bold text-center mb-6">Admin Login</h1>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                  className="form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="form-group">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                  className="form-input"
                  placeholder="Enter your password"
                  required
                />
              </div>
              {loginError && (
                <div style={{ 
                  color: 'var(--error-color)', 
                  fontSize: 'var(--text-sm)',
                  textAlign: 'center',
                  padding: 'var(--spacing-2)'
                }}>
                  {loginError}
                </div>
              )}
              <button type="submit" className="btn btn-primary w-full">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'communities', label: 'Communities', count: communities.length },
    { id: 'listings', label: 'Listings', count: listings.length },
    { id: 'contacts', label: 'Contacts', count: contacts.length },
    ...(currentAdmin?.role === 'super_admin' ? [
      { id: 'admins', label: 'Admin Users', count: adminUsers.length }
    ] : [])
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
                Welcome back, {currentAdmin?.email}
              </p>
            </div>
            <div className="flex gap-2">
              {currentAdmin?.role === 'super_admin' && (
                <button
                  className="btn btn-ghost"
                  onClick={() => setActiveTab('admins')}
                >
                  Manage Admins
                </button>
              )}
              <button
                className="btn btn-ghost"
                onClick={handleLogout}
              >
                Logout
              </button>
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
            {activeTab === 'admins' && currentAdmin?.role === 'super_admin' && (
              <AdminUsersTab adminUsers={adminUsers} currentAdmin={currentAdmin} onRefresh={refreshAdminUsers} />
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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this community?')) {
      try {
        await DataService.deleteCommunity(id);
        onRefresh();
        NotificationService.show('Community deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting community:', error);
        NotificationService.show('Error deleting community', 'error');
      }
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

      <div className="grid grid-cols-3">
        {communities.map((community) => (
          <motion.div
            key={community.id}
            className="card"
            whileHover={{ scale: 1.02 }}
          >
            {/* Community Image */}
            <div style={{ width: '100%', height: 180, overflow: 'hidden', flexShrink: 0 }}>
              <img 
                src={community.image} 
                alt={community.name}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover',
                  borderRadius: '20px 20px 0 0'
                }}
              />
            </div>
            {/* Card content below image */}
            <div className="card-content">
              <div className="space-y-3 flex-1">
                <div>
                  <h3 className="text-title-3 font-bold text-primary mb-1">
                    {community.name}
                  </h3>
                  <p className="text-callout text-secondary font-medium">{community.location}</p>
                </div>
                <p className="text-body text-tertiary line-clamp-2 leading-relaxed">
                  {community.description}
                </p>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => handleEdit(community)}
                  className="btn-ghost flex-1"
                >
                  Edit
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(community.id);
                  }}
                  className="btn-ghost text-error"
                >
                  Delete
                </button>
              </div>
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

      <div className="grid grid-cols-2">
        {listings.map((listing) => {
          const community = communities.find(c => c.id === listing.communityId);
          return (
            <motion.div
              key={listing.id}
              className="card"
              whileHover={{ scale: 1.02 }}
            >
              <div className="card-content">
                <div className="space-y-4 flex-1">
                  <div>
                    <h3 className="text-title-3 font-bold text-primary mb-2">{listing.title}</h3>
                    <p className="text-callout text-secondary font-medium">{listing.address}</p>
                    {community && (
                      <p className="text-footnote font-semibold mt-1" style={{ color: community.theme.primaryColor }}>
                        {community.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-3 mt-auto">
                    <div className="text-title-2 font-bold text-primary">
                      {UIUtils.formatPrice(listing.price)}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-footnote text-secondary bg-secondary px-3 py-1 rounded-full">
                        {listing.bedrooms} bed
                      </span>
                      <span className="text-footnote text-secondary bg-secondary px-3 py-1 rounded-full">
                        {listing.bathrooms} bath
                      </span>
                      <span className="text-footnote text-secondary bg-secondary px-3 py-1 rounded-full">
                        {listing.sqft.toLocaleString()} sqft
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleEdit(listing)}
                      className="btn-ghost flex-1"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(listing.id);
                      }}
                      className="btn-ghost text-error"
                    >
                      Delete
                    </button>
                  </div>
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
  const handleDelete = async (index) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        const contactToDelete = contacts[index];
        await DataService.deleteAdminContact(contactToDelete.id);
        onRefresh();
        NotificationService.show('Contact deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting contact:', error);
        NotificationService.show(error.message || 'Error deleting contact', 'error');
      }
    }
  };

  const handleClearAll = async () => {
    if (window.confirm('Are you sure you want to delete all contacts?')) {
      try {
        await DataService.clearAllContacts();
        onRefresh();
        NotificationService.show('All contacts deleted successfully', 'success');
      } catch (error) {
        console.error('Error clearing contacts:', error);
        NotificationService.show('Error clearing contacts', 'error');
      }
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

      <div className="grid grid-cols-2">
        {contacts.map((contact, index) => (
          <motion.div
            key={index}
            className="card"
            whileHover={{ scale: 1.02 }}
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
        hero: { 
          visible: true, 
          title: '', 
          subtitle: '',
          backgroundType: 'image',
          backgroundColor: '#ffffff',
          backgroundImage: '',
          backgroundVideo: '',
          backgroundOpacity: 1.0,
          overlayColor: '#ffffff',
          overlayOpacity: 0.85
        },
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const listingData = new Listing({
        ...formData,
        price: parseInt(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        sqft: parseInt(formData.sqft)
      });
      await DataService.saveListing(listingData);
      NotificationService.show(
        listing ? 'Listing updated successfully!' : 'Listing created successfully!',
        'success'
      );
      onSave();
    } catch (error) {
      console.error('Error saving listing:', error);
      NotificationService.show('Error saving listing', 'error');
    }
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

// Admin Users Tab (Super Admin Only)
const AdminUsersTab = ({ adminUsers, currentAdmin, onRefresh }) => {
  const [showForm, setShowForm] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  const handleDeleteAdmin = async (id) => {
    if (window.confirm('Are you sure you want to delete this admin user?')) {
      try {
        await DataService.deleteAdminUser(id);
        onRefresh();
        NotificationService.show('Admin user deleted successfully', 'success');
      } catch (error) {
        console.error('Error deleting admin user:', error);
        NotificationService.show(error.message || 'Error deleting admin user', 'error');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-title-2 font-bold">Admin Users</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowPasswordForm(true)}
            className="btn btn-secondary"
          >
            Change Password
          </button>
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-primary"
          >
            Add Admin User
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {adminUsers.map((admin) => (
          <div
            key={admin.id}
            className="card"
            style={{ padding: 'var(--spacing-6)' }}
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-title-3 font-bold text-primary">
                  {admin.email}
                  {admin.id === currentAdmin.id && (
                    <span style={{ 
                      marginLeft: '0.5rem', 
                      fontSize: 'var(--text-sm)', 
                      color: 'var(--text-secondary)' 
                    }}>
                      (You)
                    </span>
                  )}
                </h3>
                <p className="text-body text-secondary">
                  Role: {admin.role === 'super_admin' ? 'Super Admin' : 'Admin'}
                </p>
                <p className="text-footnote text-tertiary">
                  Created: {new Date(admin.createdAt).toLocaleDateString()}
                </p>
              </div>
              {admin.id !== currentAdmin.id && (
                <button
                  onClick={() => handleDeleteAdmin(admin.id)}
                  className="btn-ghost text-error"
                >
                  Delete
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {adminUsers.length === 0 && (
        <div className="empty-state">
          <div className="empty-state-icon">👥</div>
          <p className="text-body mb-4">No admin users found.</p>
        </div>
      )}

      {showForm && (
        <AdminUserForm
          onClose={() => setShowForm(false)}
          onSave={() => {
            onRefresh();
            setShowForm(false);
          }}
        />
      )}

      {showPasswordForm && (
        <PasswordChangeForm
          onClose={() => setShowPasswordForm(false)}
        />
      )}
    </div>
  );
};

// Admin User Form Component
const AdminUserForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'admin'
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await DataService.createAdminUser(formData.email, formData.password, formData.role);
      NotificationService.show('Admin user created successfully!', 'success');
      onSave();
    } catch (error) {
      setError(error.message || 'Failed to create admin user');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="text-title-2 font-bold">Add Admin User</h3>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="form-input"
              minLength="8"
              required
            />
            <small style={{ color: 'var(--text-secondary)' }}>
              Minimum 8 characters
            </small>
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="form-select"
            >
              <option value="admin">Admin</option>
              <option value="super_admin">Super Admin</option>
            </select>
          </div>

          {error && (
            <div style={{ color: 'var(--error-color)', fontSize: 'var(--text-sm)' }}>
              {error}
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Create Admin User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Password Change Form Component
const PasswordChangeForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      return;
    }

    try {
      await DataService.changePassword(formData.currentPassword, formData.newPassword);
      NotificationService.show('Password changed successfully!', 'success');
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to change password');
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="text-title-2 font-bold">Change Password</h3>
          <button onClick={onClose} className="modal-close">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Current Password</label>
            <input
              type="password"
              value={formData.currentPassword}
              onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">New Password</label>
            <input
              type="password"
              value={formData.newPassword}
              onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
              className="form-input"
              minLength="8"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Confirm New Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              className="form-input"
              minLength="8"
              required
            />
          </div>

          {error && (
            <div style={{ color: 'var(--error-color)', fontSize: 'var(--text-sm)' }}>
              {error}
            </div>
          )}

          <div className="flex gap-2 justify-end">
            <button type="button" onClick={onClose} className="btn btn-ghost">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary">
              Change Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminPage; 