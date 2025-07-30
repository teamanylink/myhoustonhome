import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DataService } from '../../services/apiService';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    squareFeet: '',
    description: '',
    propertyType: 'SINGLE_FAMILY',
    status: 'AVAILABLE'
  });

  useEffect(() => {
    loadProperties();
  }, []);

  const loadProperties = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await DataService.getAdminProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error loading properties:', error);
      setError('Failed to load properties. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        bedrooms: parseInt(formData.bedrooms) || 0,
        bathrooms: parseFloat(formData.bathrooms) || 0,
        squareFeet: parseInt(formData.squareFeet) || 0
      };

      if (editingProperty) {
        await DataService.saveProperty({ ...propertyData, id: editingProperty.id });
      } else {
        await DataService.saveProperty(propertyData);
      }

      await loadProperties();
      resetForm();
    } catch (error) {
      console.error('Error saving property:', error);
      setError('Failed to save property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (property) => {
    setEditingProperty(property);
    setFormData({
      title: property.title || '',
      address: property.address || '',
      city: property.city || '',
      state: property.state || '',
      zipCode: property.zipCode || '',
      price: property.price?.toString() || '',
      bedrooms: property.bedrooms?.toString() || '',
      bathrooms: property.bathrooms?.toString() || '',
      squareFeet: property.squareFeet?.toString() || '',
      description: property.description || '',
      propertyType: property.propertyType || 'SINGLE_FAMILY',
      status: property.status || 'AVAILABLE'
    });
    setShowAddForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      await DataService.deleteProperty(id);
      await loadProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      setError('Failed to delete property. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      price: '',
      bedrooms: '',
      bathrooms: '',
      squareFeet: '',
      description: '',
      propertyType: 'SINGLE_FAMILY',
      status: 'AVAILABLE'
    });
    setEditingProperty(null);
    setShowAddForm(false);
  };

  const filteredProperties = properties.filter(property =>
    property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.address?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    property.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading && properties.length === 0) {
    return (
      <div className="space-y-6">
        <div className="section-header">
          <h1 className="section-title">Properties</h1>
          <p className="section-subtitle">Manage your property listings</p>
        </div>
        
        <div className="text-center py-12">
          <div style={{ 
            width: '48px', 
            height: '48px', 
            border: '4px solid rgba(0, 122, 255, 0.1)', 
            borderLeftColor: 'var(--primary-color)', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite',
            margin: '0 auto 24px'
          }} />
          <p className="text-secondary">Loading properties...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="section-header">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="section-title">Properties</h1>
            <p className="section-subtitle">Manage your property listings</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="btn btn-primary"
          >
            <span className="mr-2">🏠</span>
            Add Property
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="admin-card bg-red-50 border border-red-200">
          <div className="admin-card-content">
            <div className="flex items-center gap-3">
              <div className="text-red-500 text-xl">⚠️</div>
              <div>
                <p className="text-red-700 font-medium">Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="admin-card">
          <div className="admin-card-content">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-title-2">
                {editingProperty ? 'Edit Property' : 'Add New Property'}
              </h2>
              <button
                onClick={resetForm}
                className="btn btn-outline"
              >
                ✕ Cancel
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="form-label">Property Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="form-input"
                    placeholder="Enter property title"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Property Type</label>
                  <select
                    value={formData.propertyType}
                    onChange={(e) => setFormData({ ...formData, propertyType: e.target.value })}
                    className="form-input"
                  >
                    <option value="SINGLE_FAMILY">Single Family</option>
                    <option value="TOWNHOUSE">Townhouse</option>
                    <option value="CONDO">Condo</option>
                    <option value="MULTI_FAMILY">Multi-Family</option>
                    <option value="LAND">Land</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="form-input"
                    placeholder="Enter street address"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="form-input"
                    placeholder="Enter city"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="form-input"
                    placeholder="Enter state"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">ZIP Code</label>
                  <input
                    type="text"
                    value={formData.zipCode}
                    onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                    className="form-input"
                    placeholder="Enter ZIP code"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="form-input"
                    placeholder="Enter price"
                    min="0"
                    step="1000"
                    required
                  />
                </div>

                <div>
                  <label className="form-label">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="form-input"
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="PENDING">Pending</option>
                    <option value="SOLD">Sold</option>
                    <option value="OFF_MARKET">Off Market</option>
                  </select>
                </div>

                <div>
                  <label className="form-label">Bedrooms</label>
                  <input
                    type="number"
                    value={formData.bedrooms}
                    onChange={(e) => setFormData({ ...formData, bedrooms: e.target.value })}
                    className="form-input"
                    placeholder="Number of bedrooms"
                    min="0"
                  />
                </div>

                <div>
                  <label className="form-label">Bathrooms</label>
                  <input
                    type="number"
                    value={formData.bathrooms}
                    onChange={(e) => setFormData({ ...formData, bathrooms: e.target.value })}
                    className="form-input"
                    placeholder="Number of bathrooms"
                    min="0"
                    step="0.5"
                  />
                </div>

                <div>
                  <label className="form-label">Square Feet</label>
                  <input
                    type="number"
                    value={formData.squareFeet}
                    onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
                    className="form-input"
                    placeholder="Square footage"
                    min="0"
                  />
                </div>
              </div>

              <div>
                <label className="form-label">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="form-input"
                  rows="4"
                  placeholder="Enter property description"
                />
              </div>

              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={resetForm}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Saving...' : (editingProperty ? 'Update Property' : 'Add Property')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="admin-card">
        <div className="admin-card-content">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search properties..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input w-full"
              />
            </div>
            <div className="text-sm text-secondary">
              {filteredProperties.length} of {properties.length} properties
            </div>
          </div>
        </div>
      </div>

      {/* Properties List */}
      <div className="admin-card">
        <div className="admin-card-content">
          {filteredProperties.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🏠</div>
              <p>No properties found</p>
              <p className="text-sm text-secondary mt-2">
                {searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first property'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <div key={property.id} className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium text-primary">{property.title || 'Untitled Property'}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        property.status === 'AVAILABLE' ? 'bg-green-100 text-green-800' :
                        property.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        property.status === 'SOLD' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {property.status.replace('_', ' ').toLowerCase()}
                      </span>
                    </div>
                    <p className="text-sm text-secondary mb-1">
                      {property.address}, {property.city}, {property.state} {property.zipCode}
                    </p>
                    <div className="flex items-center gap-4 text-sm text-tertiary">
                      {property.price && (
                        <span className="font-medium text-primary">{formatPrice(property.price)}</span>
                      )}
                      {property.bedrooms && <span>{property.bedrooms} beds</span>}
                      {property.bathrooms && <span>{property.bathrooms} baths</span>}
                      {property.squareFeet && <span>{property.squareFeet} sq ft</span>}
                      <span className="capitalize">{property.propertyType.replace('_', ' ').toLowerCase()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(property)}
                      className="btn btn-sm btn-outline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="btn btn-sm btn-danger"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Properties; 