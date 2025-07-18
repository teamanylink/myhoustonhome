import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

const Properties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      const data = await apiService.getProperties();
      setProperties(data);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      try {
        await apiService.deleteProperty(id);
        setProperties(properties.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-large-title mb-4">Loading properties...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-title-1 font-bold text-primary">Properties</h1>
          <p className="text-body text-secondary">Manage your property inventory</p>
        </div>
        <button className="btn btn-primary">
          <span className="mr-2">🏠</span>
          Add Property
        </button>
      </div>

      {/* Properties List */}
      {properties.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏠</div>
          <p className="text-body mb-4">No properties yet.</p>
          <button className="btn btn-primary">
            Add your first property
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {properties.map((property) => (
            <div key={property.id} className="admin-card">
              <div className="admin-card-content">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-title-3 font-semibold text-primary">{property.title}</h3>
                    <p className="text-body text-secondary">{property.address}</p>
                    {property.community && (
                      <p className="text-footnote font-semibold mt-1 text-primary">
                        {property.community}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="text-title-2 font-bold text-primary">
                      ${property.price?.toLocaleString() || 'Price not set'}
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-footnote text-secondary bg-secondary px-3 py-1 rounded-full">
                        🛏️ {property.bedrooms || 0} bed
                      </span>
                      <span className="text-footnote text-secondary bg-secondary px-3 py-1 rounded-full">
                        🚿 {property.bathrooms || 0} bath
                      </span>
                      <span className="text-footnote text-secondary bg-secondary px-3 py-1 rounded-full">
                        📐 {property.sqft?.toLocaleString() || 0} sqft
                      </span>
                    </div>
                  </div>

                  <div className="admin-actions">
                    <button className="admin-action-btn edit">
                      <span className="mr-1">✏️</span>
                      Edit
                    </button>
                    <button 
                      className="admin-action-btn delete"
                      onClick={() => handleDelete(property.id)}
                    >
                      <span className="mr-1">🗑️</span>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Properties; 