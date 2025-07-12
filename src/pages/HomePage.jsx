import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DataService, UIUtils } from '../services/dataService';

const HomePage = () => {
  const [communities, setCommunities] = useState([]);
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    minPrice: '',
    maxPrice: '',
    bedrooms: '',
    bathrooms: '',
    type: 'all',
    communityId: ''
  });
  const [sortBy, setSortBy] = useState('price-asc');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAndSortListings();
  }, [listings, searchQuery, filters, sortBy]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [communitiesData, listingsData] = await Promise.all([
        DataService.getCommunities(),
        DataService.getListings()
      ]);
      setCommunities(communitiesData);
      setListings(listingsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAndSortListings = () => {
    let filtered = DataService.searchListings(searchQuery, filters);
    filtered = DataService.sortListings(filtered, sortBy);
    setFilteredListings(filtered);
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const clearFilters = () => {
    setSearchQuery('');
    setFilters({
      minPrice: '',
      maxPrice: '',
      bedrooms: '',
      bathrooms: '',
      type: 'all',
      communityId: ''
    });
    setSortBy('price-asc');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <motion.section 
        className="hero hero-enhanced"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="container">
          <div className="hero-content">
            <h1 className="hero-title">
              Find Your Dream Home in Houston
            </h1>
            <p className="hero-subtitle">
              Discover luxury communities and exceptional homes across the greater Houston area
            </p>
            
            {/* Enhanced Search Bar */}
            <div className="search-container">
              <div className="search-bar">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
                <input
                  type="text"
                  placeholder="Search by city, address, or community..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="search-clear"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <line x1="18" y1="6" x2="6" y2="18"></line>
                      <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                  </button>
                )}
              </div>
              
              <button 
                onClick={() => document.getElementById('filters-section').scrollIntoView({ behavior: 'smooth' })}
                className="btn btn-primary search-btn"
              >
                Search Properties
              </button>
            </div>

            <div className="stats-row">
              <div className="stat-item">
                <span className="stat-number">{communities.length}</span>
                <span className="stat-label">Communities</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{listings.length}</span>
                <span className="stat-label">Properties</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">
                  {communities.reduce((acc, community) => acc + community.builders.length, 0)}
                </span>
                <span className="stat-label">Builders</span>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Filters Section */}
      <section id="filters-section" className="filters-section">
        <div className="container">
          <div className="filters-container">
            <div className="filters-grid">
              <div className="filter-group">
                <label className="filter-label">Property Type</label>
                <select 
                  value={filters.type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Types</option>
                  <option value="house">House</option>
                  <option value="townhome">Townhome</option>
                  <option value="condo">Condo</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Community</label>
                <select 
                  value={filters.communityId}
                  onChange={(e) => handleFilterChange('communityId', e.target.value)}
                  className="filter-select"
                >
                  <option value="">All Communities</option>
                  {communities.map(community => (
                    <option key={community.id} value={community.id}>
                      {community.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Min Price</label>
                <input
                  type="number"
                  placeholder="$0"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Max Price</label>
                <input
                  type="number"
                  placeholder="No limit"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  className="filter-input"
                />
              </div>

              <div className="filter-group">
                <label className="filter-label">Bedrooms</label>
                <select 
                  value={filters.bedrooms}
                  onChange={(e) => handleFilterChange('bedrooms', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                  <option value="5">5+</option>
                </select>
              </div>

              <div className="filter-group">
                <label className="filter-label">Bathrooms</label>
                <select 
                  value={filters.bathrooms}
                  onChange={(e) => handleFilterChange('bathrooms', e.target.value)}
                  className="filter-select"
                >
                  <option value="">Any</option>
                  <option value="1">1+</option>
                  <option value="2">2+</option>
                  <option value="3">3+</option>
                  <option value="4">4+</option>
                </select>
              </div>
            </div>

            <div className="filters-actions">
              <div className="sort-group">
                <label className="filter-label">Sort by</label>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="filter-select"
                >
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="sqft-desc">Largest Homes</option>
                  <option value="bedrooms-desc">Most Bedrooms</option>
                  <option value="newest">Newest Listed</option>
                </select>
              </div>
              
              <button 
                onClick={clearFilters}
                className="btn btn-ghost clear-filters-btn"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Search Results */}
      <section className="search-results-section">
        <div className="container">
          <div className="results-header">
            <h2 className="results-title">
              {filteredListings.length} Properties Found
            </h2>
            <p className="results-subtitle">
              {searchQuery && `Results for "${searchQuery}"`}
            </p>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading properties...</p>
            </div>
          ) : filteredListings.length > 0 ? (
            <motion.div 
              className="listings-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredListings.map((listing) => (
                <motion.div key={listing.id} variants={itemVariants}>
                  <EnhancedListingCard listing={listing} communities={communities} />
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
              <h3 className="empty-state-title">No Properties Found</h3>
              <p className="empty-state-text">
                Try adjusting your search criteria or browse all communities below.
              </p>
              <button 
                onClick={clearFilters}
                className="btn btn-primary"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Communities Section */}
      {communities.length > 0 && (
        <section className="communities-section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Featured Communities</h2>
              <p className="section-subtitle">
                Explore master-planned communities designed for modern living
              </p>
            </div>

            <motion.div 
              className="communities-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {communities.map((community) => (
                <motion.div key={community.id} variants={itemVariants}>
                  <CommunityCard community={community} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Call to Action */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2 className="cta-title">Ready to Find Your Dream Home?</h2>
            <p className="cta-subtitle">
              Our expert agents are here to help you navigate the Houston real estate market
            </p>
            <div className="cta-actions">
              <Link to="/admin" className="btn btn-primary">
                List Your Property
              </Link>
              <button className="btn btn-secondary">
                Contact an Agent
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const EnhancedListingCard = ({ listing, communities }) => {
  const community = communities.find(c => c.id === listing.communityId);
  
  // Default image if none provided
  const defaultImage = 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80';
  const image = listing.images && listing.images.length > 0 ? listing.images[0] : defaultImage;
  
  return (
    <motion.div 
      className="listing-card enhanced"
      whileHover={{ 
        y: -4,
        boxShadow: "0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)"
      }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/listing/${listing.id}`} className="listing-card-link">
        <div className="listing-image-container">
          <img 
            src={image} 
            alt={listing.title}
            className="listing-image"
          />
          <div className="listing-price-tag">
            {UIUtils.formatPrice(listing.price)}
          </div>
          {listing.status === 'sold' && (
            <div className="listing-status-badge sold">SOLD</div>
          )}
          {listing.status === 'pending' && (
            <div className="listing-status-badge pending">PENDING</div>
          )}
        </div>
        
        <div className="listing-content">
          <div className="listing-header">
            <h3 className="listing-title">{listing.title}</h3>
            <p className="listing-address">{listing.address}</p>
            {community && (
              <p className="listing-community">{community.name}</p>
            )}
          </div>
          
          <div className="listing-stats">
            <div className="stat">
              <span className="stat-value">{listing.bedrooms}</span>
              <span className="stat-label">bed{listing.bedrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="stat">
              <span className="stat-value">{listing.bathrooms}</span>
              <span className="stat-label">bath{listing.bathrooms !== 1 ? 's' : ''}</span>
            </div>
            <div className="stat">
              <span className="stat-value">{listing.sqft?.toLocaleString()}</span>
              <span className="stat-label">sq ft</span>
            </div>
          </div>

          <div className="listing-footer">
            <div className="listing-type">
              {UIUtils.capitalizeFirst(listing.type)}
            </div>
            <div className="listing-date">
              Listed {UIUtils.formatDate(listing.createdAt)}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const CommunityCard = ({ community }) => {
  return (
    <motion.div 
      className="community-card enhanced"
      whileHover={{ 
        y: -4,
        boxShadow: "0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)"
      }}
      transition={{ duration: 0.2 }}
    >
      <Link to={`/community/${community.id}`} className="community-card-link">
        <div className="community-content">
          <div className="community-header">
            <h3 className="community-name" style={{ color: community.theme.primaryColor }}>
              {community.name}
            </h3>
            <p className="community-location">{community.location}</p>
          </div>
          
          <p className="community-description">
            {community.description}
          </p>
          
          <div className="community-details">
            <div className="community-price">{community.priceRange}</div>
            <div className="community-badges">
              <span className="badge">
                {community.amenities.length} amenities
              </span>
              <span className="badge">
                {community.builders.length} builders
              </span>
            </div>
          </div>
          
          <div className="community-cta">
            <span>Explore Community</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="9,18 15,12 9,6"></polyline>
            </svg>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default HomePage; 