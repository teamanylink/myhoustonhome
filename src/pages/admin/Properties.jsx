import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Plus, Edit, Trash2, MapPin, Home, DollarSign, Bed, Bath, Square } from 'lucide-react';
import apiService from '../../services/apiService';

const Properties = () => {
  const { sidebarCollapsed, Header } = useOutletContext();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      // Using listings data as properties for now
      const data = await apiService.getListings();
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
        await apiService.deleteListing(id);
        setProperties(properties.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting property:', error);
        alert('Failed to delete property');
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
          title="Properties" 
          description="Manage property inventory"
          sidebarCollapsed={sidebarCollapsed}
        />
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header 
        title="Properties" 
        description={`Manage your ${properties.length} properties`}
        action={
          <div className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Add Property</span>
          </div>
        }
        sidebarCollapsed={sidebarCollapsed}
      />

      <div className="p-6">
        {properties.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Properties Yet</h3>
              <p className="text-gray-500 mb-6">Start building your property inventory.</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Property
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property) => (
              <Card key={property.id} className="hover:shadow-lg transition-shadow overflow-hidden">
                {/* Property Image */}
                <div className="h-48 bg-gray-200 relative overflow-hidden">
                  {property.imageUrl ? (
                    <img 
                      src={property.imageUrl} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Home className="w-12 h-12 text-gray-400" />
                    </div>
                  )}
                  
                  {/* Status Badge */}
                  {property.status && (
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        property.status === 'available' 
                          ? 'bg-green-500 text-white' 
                          : property.status === 'sold'
                          ? 'bg-red-500 text-white'
                          : 'bg-yellow-500 text-white'
                      }`}>
                        {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                      </span>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="absolute top-3 left-3 flex space-x-2">
                    <Button variant="ghost" size="sm" className="bg-white/80 hover:bg-white">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleDelete(property.id)}
                      className="bg-white/80 hover:bg-red-50 text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <CardContent className="p-4">
                  {/* Property Title */}
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                    {property.title || property.address || 'Untitled Property'}
                  </h3>

                  {/* Location */}
                  {property.address && (
                    <div className="flex items-center space-x-1 text-gray-500 mb-3">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm line-clamp-1">{property.address}</span>
                    </div>
                  )}

                  {/* Property Details */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                    {property.bedrooms && (
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Bed className="w-4 h-4" />
                        <span>{property.bedrooms}</span>
                      </div>
                    )}
                    {property.bathrooms && (
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Bath className="w-4 h-4" />
                        <span>{property.bathrooms}</span>
                      </div>
                    )}
                    {property.sqft && (
                      <div className="flex items-center space-x-1 text-gray-600">
                        <Square className="w-4 h-4" />
                        <span>{property.sqft.toLocaleString()}</span>
                      </div>
                    )}
                  </div>

                  {/* Price */}
                  {property.price && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="text-lg font-bold text-gray-900">{formatPrice(property.price)}</span>
                      </div>
                    </div>
                  )}

                  {/* Community Tag */}
                  {property.communityName && (
                    <div className="mt-3">
                      <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
                        {property.communityName}
                      </span>
                    </div>
                  )}

                  {/* Description */}
                  {property.description && (
                    <p className="text-sm text-gray-600 mt-3 line-clamp-2">
                      {property.description}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Properties; 