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
      <div className="admin-card" style={{ 
        background: 'white',
        border: '1px solid #e5e7eb',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div className="admin-card-content" style={{ padding: '32px' }}>
          <div className="flex justify-between items-start">
            <div style={{ flex: 1 }}>
              <div className="flex items-center" style={{ marginBottom: '16px', gap: '12px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)'
                }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                </div>
                <div>
                  <h1 className="text-title-1" style={{ 
                    margin: 0,
                    color: 'var(--text-primary)'
                  }}>
                    Dashboard Overview
                  </h1>
                  <p className="text-body text-secondary" style={{ margin: '4px 0 0 0' }}>
                    Real-time insights and controls
                  </p>
                </div>
              </div>
              <p className="text-body text-secondary" style={{ 
                marginBottom: '16px',
                lineHeight: '1.6',
                maxWidth: '600px'
              }}>
                Welcome to your admin dashboard. Here's a comprehensive overview of your content and recent activity.
              </p>
              {lastUpdated && (
                <div style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '8px 16px',
                  background: 'rgba(34, 197, 94, 0.1)',
                  border: '1px solid rgba(34, 197, 94, 0.2)',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '500'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: 'var(--success-color)',
                    borderRadius: '50%',
                    animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
                  }}></div>
                  <span className="text-secondary">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
              )}
            </div>
            <div style={{ marginLeft: '24px' }}>
              <button
                onClick={handleRefresh}
                disabled={loading}
                className="btn btn-primary"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 24px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  boxShadow: loading ? 'none' : '0 2px 8px rgba(0, 122, 255, 0.2)',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? (
                  <>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTop: '2px solid white',
                      borderRadius: '50%',
                      animation: 'spin 1s linear infinite'
                    }}></div>
                    <span>Refreshing...</span>
                  </>
                ) : (
                  <>
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2"
                      style={{ transition: 'transform 0.2s ease' }}
                    >
                      <polyline points="23,4 23,10 17,10"/>
                      <polyline points="1,20 1,14 7,14"/>
                      <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4-4.64 4.36A9 9 0 0 1 3.51 15"/>
                    </svg>
                    <span>Refresh</span>
                  </>
                )}
              </button>
            </div>
          </div>
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
              <div className="admin-icon communities">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
              </div>
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
              <div className="admin-icon listings">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                  <polyline points="10,9 9,9 8,9"/>
                </svg>
              </div>
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
              <div className="admin-icon properties">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
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
              <div className="admin-icon analytics">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="admin-card">
        <div className="admin-card-content">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-title-2 text-primary">Recent Activity</h2>
            <div className="flex items-center gap-2 text-sm text-secondary">
              <span className="w-2 h-2 bg-success-color rounded-full animate-pulse"></span>
              Live updates
            </div>
          </div>
          
          {stats.recentActivity.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary">
                  <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-primary mb-2">No recent activity</h3>
              <p className="text-secondary mb-6 max-w-sm mx-auto">
                Start by adding some communities, listings, and properties to see your activity feed here.
              </p>
              <div className="flex justify-center gap-3">
                <button className="btn btn-primary btn-small">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                    <polyline points="9,22 9,12 15,12 15,22"/>
                  </svg>
                  Add Community
                </button>
                <button className="btn btn-secondary btn-small">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14,2 14,8 20,8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                  Add Listing
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-1">
              {stats.recentActivity.map((activity, index) => (
                <div 
                  key={`${activity.type}-${activity.id}-${index}`} 
                  className="recent-activity-item group"
                >
                  <div className="activity-icon">
                    <div className="icon-wrapper">
                      {activity.type === 'Community' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                          <polyline points="9,22 9,12 15,12 15,22"/>
                        </svg>
                      )}
                      {activity.type === 'Listing' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                          <polyline points="14,2 14,8 20,8"/>
                          <line x1="16" y1="13" x2="8" y2="13"/>
                          <line x1="16" y1="17" x2="8" y2="17"/>
                        </svg>
                      )}
                      {activity.type === 'Property' && (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                          <circle cx="12" cy="10" r="3"/>
                        </svg>
                      )}
                    </div>
                    <div className="activity-line"></div>
                  </div>
                  
                  <div className="activity-content">
                    <div className="activity-header">
                      <h4 className="activity-title">{activity.name}</h4>
                      <span className="activity-time">Just now</span>
                    </div>
                    <div className="activity-meta">
                      <span className="activity-type">{activity.type}</span>
                      <span className="activity-separator">•</span>
                      <span className="activity-action">{activity.action}</span>
                    </div>
                  </div>
                </div>
              ))}
              
              {/* Timeline end indicator */}
              <div className="flex items-center gap-4 pl-6 pt-4">
                <div className="w-3 h-3 bg-tertiary rounded-full"></div>
                <p className="text-sm text-tertiary font-medium">That's all for now</p>
              </div>
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
              Manage Communities
            </Link>
            <Link to="/admin/listings" className="btn btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
              </svg>
              Manage Listings
            </Link>
            <Link to="/admin/properties" className="btn btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              Manage Properties
            </Link>
            <Link to="/admin/users" className="btn btn-secondary">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
              Admin Users
            </Link>
          </div>
        </div>
      </div>

      {/* Empty State for New Users */}
      {stats.totalCommunities === 0 && stats.totalListings === 0 && stats.totalProperties === 0 && !loading && (
        <div className="admin-card">
          <div className="admin-card-content text-center">
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-full flex items-center justify-center">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success-color">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22,4 12,14.01 9,11.01"/>
              </svg>
            </div>
            <h2 className="text-title-2 mb-4">Welcome to Your Dashboard!</h2>
            <p className="text-secondary mb-6">
              You're all set up! Start building your real estate platform by adding communities, listings, and properties.
            </p>
            <div className="flex justify-center gap-4 flex-wrap">
              <Link to="/admin/communities" className="btn btn-primary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                  <polyline points="9,22 9,12 15,12 15,22"/>
                </svg>
                Add Your First Community
              </Link>
              <Link to="/admin/listings" className="btn btn-secondary">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
                Add Your First Listing
              </Link>
              <Link to="/admin/properties" className="btn btn-outline">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
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