import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

const Listings = () => {
  const [listings, setListings] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this listing?')) {
      try {
        await apiService.deleteListing(id);
        setListings(listings.filter(l => l.id !== id));
      } catch (error) {
        console.error('Error deleting listing:', error);
        alert('Failed to delete listing');
      }
    }
  };

  const formatPrice = (price) => {
    if (!price) return 'Price not set';
    return `$${price.toLocaleString()}`;
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-large-title mb-4">Loading listings...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-title-1 font-bold text-primary">Listings</h1>
          <p className="text-body text-secondary">Manage your property listings</p>
        </div>
        <button className="btn btn-primary">
          <span className="mr-2">📝</span>
          Add Listing
        </button>
      </div>

      {/* Listings Grid */}
      {listings.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📝</div>
          <p className="text-body mb-4">No listings yet.</p>
          <button className="btn btn-primary">
            Create your first listing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {listings.map((listing) => {
            const community = communities.find(c => c.id === listing.communityId);
            return (
              <div key={listing.id} className="admin-card">
                <div className="admin-card-content">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-title-3 font-semibold text-primary">{listing.title}</h3>
                      <p className="text-body text-secondary">{listing.address}</p>
                      {community && (
                        <p className="text-footnote font-semibold mt-1" style={{ color: community.theme?.primaryColor || 'var(--primary-color)' }}>
                          {community.name}
                        </p>
                      )}
                    </div>
                    
                    <div className="space-y-3">
                      <div className="text-title-2 font-bold text-primary">
                        {formatPrice(listing.price)}
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-footnote text-secondary bg-secondary px-3 py-1 rounded-full">
                          🛏️ {listing.bedrooms} bed
                        </span>
                        <span className="text-footnote text-secondary bg-secondary px-3 py-1 rounded-full">
                          🚿 {listing.bathrooms} bath
                        </span>
                        <span className="text-footnote text-secondary bg-secondary px-3 py-1 rounded-full">
                          📐 {listing.sqft?.toLocaleString()} sqft
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
                        onClick={() => handleDelete(listing.id)}
                      >
                        <span className="mr-1">🗑️</span>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Listings; 