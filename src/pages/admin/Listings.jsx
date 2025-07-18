import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus, Edit, Trash2, MapPin, Home, DollarSign, Eye } from 'lucide-react';
import apiService from '../../services/apiService';

const Listings = () => {
  const { sidebarCollapsed, Header } = useOutletContext();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchListings();
  }, []);

  const fetchListings = async () => {
    try {
      const data = await apiService.getListings();
      setListings(data);
    } catch (error) {
      console.error('Error fetching listings:', error);
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
    if (!price) return 'Price not available';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return (
      <div className="p-6">
        <Header 
          title="Listings" 
          description="Manage property listings"
          sidebarCollapsed={sidebarCollapsed}
        />
        <div className="animate-pulse space-y-4">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-gray-200 rounded"></div>
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
        title="Listings" 
        description={`Manage your ${listings.length} property listings`}
        action={
          <div className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Listing</span>
          </div>
        }
        sidebarCollapsed={sidebarCollapsed}
      />

      <div className="p-6">
        {listings.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Listings Yet</h3>
              <p className="text-gray-500 mb-6">Start adding your property listings.</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Listing
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {listings.map((listing) => (
              <Card key={listing.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex space-x-4 flex-1">
                      {/* Listing Image */}
                      <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                        {listing.imageUrl ? (
                          <img 
                            src={listing.imageUrl} 
                            alt={listing.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Home className="w-8 h-8 text-gray-400" />
                        )}
                      </div>

                      {/* Listing Info */}
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {listing.title || listing.address || 'Untitled Listing'}
                          </h3>
                          <div className="flex items-center space-x-2">
                            {listing.status && (
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                listing.status === 'available' 
                                  ? 'bg-green-100 text-green-800' 
                                  : listing.status === 'sold'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {listing.status.charAt(0).toUpperCase() + listing.status.slice(1)}
                              </span>
                            )}
                          </div>
                        </div>

                        {listing.description && (
                          <p className="text-gray-600 mb-3 line-clamp-2">{listing.description}</p>
                        )}
                        
                        <div className="flex items-center space-x-6 text-sm text-gray-500">
                          {listing.address && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="w-4 h-4" />
                              <span>{listing.address}</span>
                            </div>
                          )}
                          {listing.price && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4" />
                              <span className="font-medium text-gray-900">{formatPrice(listing.price)}</span>
                            </div>
                          )}
                          {listing.bedrooms && (
                            <span>{listing.bedrooms} bed</span>
                          )}
                          {listing.bathrooms && (
                            <span>{listing.bathrooms} bath</span>
                          )}
                          {listing.sqft && (
                            <span>{listing.sqft.toLocaleString()} sqft</span>
                          )}
                        </div>

                        {listing.communityName && (
                          <div className="mt-2">
                            <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                              {listing.communityName}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="ghost" size="sm" title="View Details">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" title="Edit">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDelete(listing.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        title="Delete"
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

export default Listings; 