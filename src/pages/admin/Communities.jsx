import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus, Edit, Trash2, MapPin, Building, Image } from 'lucide-react';
import apiService from '../../services/apiService';

const Communities = () => {
  const { sidebarCollapsed, Header } = useOutletContext();
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
      <div className="p-6">
        <Header 
          title="Communities" 
          description="Manage your housing communities"
          sidebarCollapsed={sidebarCollapsed}
        />
        <div className="animate-pulse space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-20 bg-gray-200 rounded"></div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header 
        title="Communities" 
        description={`Manage your ${communities.length} housing communities`}
        action={
          <div className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Community</span>
          </div>
        }
        sidebarCollapsed={sidebarCollapsed}
      />

      <div className="p-6">
        {communities.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Communities Yet</h3>
              <p className="text-gray-500 mb-6">Get started by creating your first community.</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Community
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {communities.map((community) => (
              <Card key={community.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4">
                      {/* Community Image */}
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {community.imageUrl ? (
                          <img 
                            src={community.imageUrl} 
                            alt={community.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Image className="w-8 h-8 text-gray-400" />
                        )}
                      </div>

                      {/* Community Info */}
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{community.name}</h3>
                        {community.description && (
                          <p className="text-gray-600 mt-1 line-clamp-2">{community.description}</p>
                        )}
                        
                        <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                          {community.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{community.location}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-1">
                            <Building className="w-4 h-4" />
                            <span>{community.totalHomes || 0} homes</span>
                          </div>
                          {community.priceRange && (
                            <span className="font-medium">{community.priceRange}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(community.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Communities; 