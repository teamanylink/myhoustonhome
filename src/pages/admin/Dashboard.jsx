import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Building, MapPin, FileText, Users, Plus, TrendingUp } from 'lucide-react';
import apiService from '../../services/apiService';

const Dashboard = () => {
  const { sidebarCollapsed, Header } = useOutletContext();
  const [stats, setStats] = useState({
    communities: 0,
    listings: 0,
    contacts: 0,
    properties: 0
  });
  const [recentContacts, setRecentContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [communities, listings, contacts] = await Promise.all([
          apiService.getCommunities(),
          apiService.getListings(),
          apiService.getContacts()
        ]);

        setStats({
          communities: communities.length,
          listings: listings.length,
          contacts: contacts.length,
          properties: listings.length // For now, same as listings
        });

        // Get recent contacts (last 5)
        const sortedContacts = contacts
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
          .slice(0, 5);
        setRecentContacts(sortedContacts);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const statCards = [
    {
      title: 'Total Communities',
      value: stats.communities,
      icon: Building,
      color: 'bg-blue-500',
      description: 'Active communities'
    },
    {
      title: 'Total Properties',
      value: stats.properties,
      icon: MapPin,
      color: 'bg-green-500',
      description: 'Available properties'
    },
    {
      title: 'Active Listings',
      value: stats.listings,
      icon: FileText,
      color: 'bg-purple-500',
      description: 'Current listings'
    },
    {
      title: 'Contact Inquiries',
      value: stats.contacts,
      icon: Users,
      color: 'bg-orange-500',
      description: 'Total inquiries'
    }
  ];

  if (loading) {
    return (
      <div className="p-6">
        <Header 
          title="Dashboard" 
          description="Overview of your admin panel"
          sidebarCollapsed={sidebarCollapsed}
        />
        <div className="animate-pulse space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header 
        title="Dashboard" 
        description="Overview of your admin panel"
        action={
          <div className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Quick Add</span>
          </div>
        }
        sidebarCollapsed={sidebarCollapsed}
      />

      <div className="p-6 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-gray-600">
                    {stat.title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${stat.color}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                  <p className="text-xs text-gray-500 mt-1">{stat.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Contacts */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Recent Contact Inquiries
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentContacts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No recent contacts</p>
              ) : (
                <div className="space-y-3">
                  {recentContacts.map((contact, index) => (
                    <div key={contact.id || index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{contact.name || 'Anonymous'}</p>
                        <p className="text-sm text-gray-500">{contact.email}</p>
                        <p className="text-xs text-gray-400">
                          {contact.createdAt ? new Date(contact.createdAt).toLocaleDateString() : 'Recently'}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Building className="w-4 h-4 mr-2" />
                Add New Community
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <MapPin className="w-4 h-4 mr-2" />
                Create Property Listing
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Manage Listings
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="w-4 h-4 mr-2" />
                View Contact Inquiries
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 