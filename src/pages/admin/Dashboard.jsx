import React, { useState, useEffect } from 'react';
import apiService from '../../services/apiService';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalCommunities: 0,
    totalProperties: 0,
    totalListings: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [communities, properties, listings] = await Promise.all([
        apiService.getCommunities(),
        apiService.getProperties(),
        apiService.getListings()
      ]);

      setStats({
        totalCommunities: communities.length,
        totalProperties: properties.length,
        totalListings: listings.length,
        recentActivity: [
          ...communities.slice(-3).map(c => ({ type: 'Community', name: c.name, action: 'added' })),
          ...properties.slice(-3).map(p => ({ type: 'Property', name: p.title, action: 'added' })),
          ...listings.slice(-3).map(l => ({ type: 'Listing', name: l.title, action: 'added' }))
        ].slice(-5)
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-large-title mb-4">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="section-header">
        <h1 className="section-title">Dashboard Overview</h1>
        <p className="section-subtitle">
          Welcome to your admin dashboard. Here's a quick overview of your content.
        </p>
      </div>

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
                    {activity.type === 'Property' && '🏠'}
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
            <a href="/admin/communities" className="btn btn-primary">
              Add Community
            </a>
            <a href="/admin/properties" className="btn btn-secondary">
              Add Property
            </a>
            <a href="/admin/listings" className="btn btn-secondary">
              Add Listing
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 