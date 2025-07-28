import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/apiService';
import { DataService } from '../../services/apiService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCommunities: 0,
    totalListings: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState(null);
  const [partialData, setPartialData] = useState({
    communities: [],
    listings: []
  });

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  const loadDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      
      // Try to load cached data first for instant display
      const cachedCommunities = DataService.getCommunitiesFromLocalStorage();
      const cachedListings = DataService.getListingsFromLocalStorage();
      
      if (cachedCommunities.length > 0 || cachedListings.length > 0) {
        console.log('📦 Using cached data for instant display');
        setPartialData({ 
          communities: cachedCommunities, 
          listings: cachedListings 
        });
        
        setStats({
          totalCommunities: cachedCommunities.length,
          totalListings: cachedListings.length,
          recentActivity: [
            ...cachedCommunities.slice(-3).map(c => ({ type: 'Community', name: c.name, action: 'added' })),
            ...cachedListings.slice(-3).map(l => ({ type: 'Listing', name: l.title, action: 'added' }))
          ].slice(-5)
        });
        
        setLoading(false);
        console.log('📦 Cached data displayed, loading fresh data in background...');
      }
      
      // Add timeout to prevent infinite loading
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Request timeout')), 8000)
      );

      // Load fresh data in background
      const dataPromise = Promise.all([
        apiService.getCommunities().catch(err => {
          console.error('Error loading communities:', err);
          return cachedCommunities;
        }),
        apiService.getListings().catch(err => {
          console.error('Error loading listings:', err);
          return cachedListings;
        })
      ]);

      const [communities, listings] = await Promise.race([dataPromise, timeoutPromise]);

      console.log('✅ Fresh data loaded successfully:', {
        communities: communities.length,
        listings: listings.length
      });

      setPartialData({ communities, listings });
      
      setStats({
        totalCommunities: communities.length,
        totalListings: listings.length,
        recentActivity: [
          ...communities.slice(-3).map(c => ({ type: 'Community', name: c.name, action: 'added' })),
          ...listings.slice(-3).map(l => ({ type: 'Listing', name: l.title, action: 'added' }))
        ].slice(-5)
      });
      
      setLastUpdated(new Date());
      setError(''); // Clear any previous errors
      console.log('✅ Dashboard data updated successfully');
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      
      // Only show error if we don't have any cached data
      if (partialData.communities.length === 0 && partialData.listings.length === 0) {
        setError('Failed to load dashboard data. Please refresh the page.');
      } else {
        // We have cached data, so just log the error but don't show it to user
        console.log('⚠️ Background data refresh failed, but showing cached data');
        setError(''); // Clear any previous errors
      }
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array to prevent infinite loops

  if (loading) {
    return (
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
        <p className="text-secondary">Please wait while we fetch your data</p>
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
          </div>
          <button
            onClick={loadDashboardData}
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
      <div className="grid grid-cols-3 gap-6">
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
      </div>

      {/* Recent Activity */}
      <div className="admin-card">
        <div className="admin-card-content">
          <h2 className="text-title-2 mb-6">Recent Activity</h2>
          
          {stats.recentActivity.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📊</div>
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-secondary rounded-xl">
                  <div className="text-xl">
                    {activity.type === 'Community' && '🏘️'}
                    {activity.type === 'Listing' && '📝'}
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
          
          <div className="grid grid-cols-3 gap-4">
            <Link to="/admin/communities" className="btn btn-primary">
              Add Community
            </Link>
            <Link to="/admin/listings" className="btn btn-secondary">
              Add Listing
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 