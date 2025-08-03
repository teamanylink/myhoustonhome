import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/apiService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCommunities: 0,
    totalListings: 0,
    totalProperties: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔄 Loading dashboard data...');
      
      // Fetch communities, listings, and properties
      const [communities, listings, properties] = await Promise.all([
        apiService.getCommunities(),
        apiService.getListings(),
        apiService.getProperties()
      ]);

      console.log('✅ Dashboard data loaded:', {
        communities: communities.length,
        listings: listings.length,
        properties: properties.length
      });

      // Update stats
      setStats({
        totalCommunities: communities.length,
        totalListings: listings.length,
        totalProperties: properties.length,
        recentActivity: [
          ...communities.slice(-3).map(c => ({ 
            type: 'Community', 
            name: c.name, 
            action: 'added',
            id: c.id 
          })),
          ...listings.slice(-3).map(l => ({ 
            type: 'Listing', 
            name: l.title, 
            action: 'added',
            id: l.id 
          })),
          ...properties.slice(-3).map(p => ({ 
            type: 'Property', 
            name: p.title || p.address, 
            action: 'added',
            id: p.id 
          }))
        ].slice(-5)
      });
      
      setLastUpdated(new Date());
      setError('');
      
    } catch (error) {
      console.error('❌ Error loading dashboard data:', error);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      console.log('✅ Dashboard loading complete, setting loading to false');
      setLoading(false);
    }
  };

  // Run on component mount
  useEffect(() => {
    fetchDashboardData();
  }, []); // Empty dependency array = only run once on mount

  const handleRefresh = async () => {
    console.log('🔄 Refreshing dashboard data...');
    await fetchDashboardData();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="section-header">
          <h1 className="section-title">Dashboard Overview</h1>
          <p className="section-subtitle">
            Welcome to your admin dashboard. Loading your content...
          </p>
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
          <p className="text-secondary">Loading your dashboard data...</p>
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
            <h1 className="section-title">Dashboard Overview</h1>
            <p className="section-subtitle">
              Welcome to your admin dashboard. Here's a quick overview of your content.
            </p>
            {lastUpdated && (
              <p className="text-sm text-tertiary mt-1">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </p>
            )}
          </div>
          <button
            onClick={handleRefresh}
            disabled={loading}
            className="btn btn-secondary"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Refreshing...
              </>
            ) : (
              <>
                <span className="mr-2">🔄</span>
                Refresh
              </>
            )}
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
                <p className="text-red-700 font-medium">Dashboard Error</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="admin-card">
          <div className="admin-card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm mb-1">Total Communities</p>
                <p className="text-large-title font-bold text-primary">{stats.totalCommunities}</p>
              </div>
              <div className="text-3xl">🏘️</div>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm mb-1">Total Listings</p>
                <p className="text-large-title font-bold text-primary">{stats.totalListings}</p>
              </div>
              <div className="text-3xl">📝</div>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm mb-1">Total Properties</p>
                <p className="text-large-title font-bold text-primary">{stats.totalProperties}</p>
              </div>
              <div className="text-3xl">🏠</div>
            </div>
          </div>
        </div>

        <div className="admin-card">
          <div className="admin-card-content">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-secondary text-sm mb-1">Total Content</p>
                <p className="text-large-title font-bold text-primary">
                  {stats.totalCommunities + stats.totalListings + stats.totalProperties}
                </p>
              </div>
              <div className="text-3xl">📊</div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-card">
        <div className="admin-card-content">
          <h2 className="text-title-2 mb-6">Recent Activity</h2>
          
          {stats.recentActivity.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <p>No recent activity</p>
              <p className="text-sm text-secondary mt-2">
                Start by adding some communities, listings, and properties!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentActivity.map((activity, index) => (
                <div key={`${activity.type}-${activity.id}-${index}`} className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                  <div className="text-xl">
                    {activity.type === 'Community' && '🏘️'}
                    {activity.type === 'Listing' && '📝'}
                    {activity.type === 'Property' && '🏠'}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-primary">{activity.name}</p>
                    <p className="text-sm text-secondary">{activity.type} {activity.action}</p>
                  </div>
                  <div className="text-sm text-tertiary">Recently</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-card">
        <div className="admin-card-content">
          <h2 className="text-title-2 mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link to="/admin/communities" className="btn btn-primary">
              <span className="mr-2">🏘️</span>
              Manage Communities
            </Link>
            <Link to="/admin/listings" className="btn btn-secondary">
              <span className="mr-2">📝</span>
              Manage Listings
            </Link>
            <Link to="/admin/properties" className="btn btn-outline">
              <span className="mr-2">🏠</span>
              Manage Properties
            </Link>
            <Link to="/admin/users" className="btn btn-outline">
              <span className="mr-2">👥</span>
              Admin Users
            </Link>
          </div>
        </div>
      </div>

      {/* Empty State for New Users */}
      {stats.totalCommunities === 0 && stats.totalListings === 0 && stats.totalProperties === 0 && !loading && (
        <div className="admin-card">
          <div className="admin-card-content text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-title-2 mb-4">Welcome to Your Dashboard!</h2>
            <p className="text-secondary mb-6">
              You're all set up! Start building your real estate platform by adding communities, listings, and properties.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/admin/communities" className="btn btn-primary">
                <span className="mr-2">🏘️</span>
                Add Your First Community
              </Link>
              <Link to="/admin/listings" className="btn btn-secondary">
                <span className="mr-2">📝</span>
                Add Your First Listing
              </Link>
              <Link to="/admin/properties" className="btn btn-outline">
                <span className="mr-2">🏠</span>
                Add Your First Property
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 