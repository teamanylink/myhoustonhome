import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

const Communities = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this community?')) {
      try {
        await apiService.deleteCommunity(id);
        setCommunities(communities.filter(c => c.id !== id));
      } catch (error) {
        console.error('Error deleting community:', error);
        alert('Failed to delete community');
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-large-title mb-4">Loading communities...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-title-1 font-bold text-primary">Communities</h1>
          <p className="text-body text-secondary">Manage your community listings</p>
        </div>
        <button className="btn btn-primary">
          <span className="mr-2">➕</span>
          Add Community
        </button>
      </div>

      {/* Communities List */}
      {communities.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🏘️</div>
          <p className="text-body mb-4">No communities yet.</p>
          <button className="btn btn-primary">
            Create your first community
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {communities.map((community) => (
            <div key={community.id} className="admin-card">
              <div className="admin-card-content">
                <div className="flex items-start justify-between">
                  <div className="flex space-x-4 flex-1">
                    {/* Community Image */}
                    <div className="w-20 h-20 bg-secondary rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0">
                      {community.image ? (
                        <img 
                          src={community.image} 
                          alt={community.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl">🏘️</span>
                      )}
                    </div>

                    {/* Community Info */}
                    <div className="flex-1">
                      <h3 className="text-title-3 font-semibold text-primary">{community.name}</h3>
                      {community.description && (
                        <p className="text-body text-secondary mt-1 line-clamp-2">{community.description}</p>
                      )}
                      
                      <div className="flex items-center space-x-4 mt-3 text-sm text-tertiary">
                        {community.location && (
                          <div className="flex items-center space-x-1">
                            <span>📍</span>
                            <span>{community.location}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <span>🏠</span>
                          <span>{community.totalHomes || 0} homes</span>
                        </div>
                        {community.priceRange && (
                          <span className="font-medium text-primary">{community.priceRange}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button className="admin-action-btn edit">
                      <span className="mr-1">✏️</span>
                      Edit
                    </button>
                    <button 
                      className="admin-action-btn delete"
                      onClick={() => handleDelete(community.id)}
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

export default Communities; 