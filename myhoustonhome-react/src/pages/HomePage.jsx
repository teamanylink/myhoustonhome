import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DataService, UIUtils } from '../services/dataService';

const HomePage = () => {
  const [communities, setCommunities] = useState([]);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    setCommunities(DataService.getCommunities());
    setListings(DataService.getListings());
  }, []);

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
        className="hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
      >
        <div className="container">
          <h1 className="hero-title">
            Find Your Perfect Home in Houston
          </h1>
          <p className="hero-subtitle">
            Discover luxury communities and exceptional homes across the greater Houston area
          </p>
          <div className="hero-actions">
            <Link to="#communities" className="btn btn-primary">
              Explore Communities
            </Link>
            <Link to="#listings" className="btn btn-secondary">
              View All Homes
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Communities Section */}
      <section id="communities" className="section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Communities</h2>
            <p className="section-subtitle">
              Explore master-planned communities designed for modern living
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-3"
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

          {communities.length === 0 && (
            <div className="text-center space-y-4">
              <p className="text-secondary">No communities available yet.</p>
              <Link to="/admin" className="btn btn-primary">
                Add Your First Community
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Listings Section */}
      <section id="listings" className="section bg-secondary">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Latest Listings</h2>
            <p className="section-subtitle">
              Discover beautiful homes available now
            </p>
          </div>

          <motion.div 
            className="grid grid-cols-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {listings.slice(0, 6).map((listing) => (
              <motion.div key={listing.id} variants={itemVariants}>
                <ListingCard listing={listing} />
              </motion.div>
            ))}
          </motion.div>

          {listings.length === 0 && (
            <div className="text-center space-y-4">
              <p className="text-secondary">No listings available yet.</p>
              <Link to="/admin" className="btn btn-primary">
                Add Your First Listing
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

const CommunityCard = ({ community }) => {
  return (
    <motion.div 
      className="card"
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      }}
      whileTap={{ scale: 0.97 }}
    >
      <Link to={`/community/${community.id}`} className="block">
        <div className="card-content">
          <div className="space-y-4">
            <div>
              <h3 className="text-title-3 font-bold text-primary mb-2">
                {community.name}
              </h3>
              <p className="text-callout text-secondary font-medium">
                {community.location}
              </p>
            </div>
            
            <p className="text-body text-tertiary line-clamp-2 leading-relaxed">
              {community.description}
            </p>
            
            <div className="space-y-3">
              <div className="text-headline font-bold" style={{ color: community.theme.primaryColor }}>
                {community.priceRange}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-footnote text-secondary bg-secondary px-3 py-1 rounded-full">
                  {community.amenities.length} amenities
                </span>
                <span className="text-footnote text-secondary bg-secondary px-3 py-1 rounded-full">
                  {community.builders.length} builders
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

const ListingCard = ({ listing }) => {
  const community = DataService.getCommunity(listing.communityId);
  
  return (
    <motion.div 
      className="card"
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      }}
      whileTap={{ scale: 0.97 }}
    >
      <Link to={`/listing/${listing.id}`} className="block">
        <div className="card-content">
          <div className="space-y-4">
            <div>
              <h3 className="text-title-3 font-bold text-primary mb-2">
                {listing.title}
              </h3>
              <p className="text-callout text-secondary font-medium">
                {listing.address}
              </p>
              {community && (
                <p className="text-footnote font-semibold mt-1" style={{ color: community.theme.primaryColor }}>
                  {community.name}
                </p>
              )}
            </div>
            
            <div className="space-y-3">
              <div className="text-title-2 font-bold text-primary">
                {UIUtils.formatPrice(listing.price)}
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-footnote text-secondary bg-secondary px-3 py-1 rounded-full">
                  {listing.bedrooms} bed
                </span>
                <span className="text-footnote text-secondary bg-secondary px-3 py-1 rounded-full">
                  {listing.bathrooms} bath
                </span>
                <span className="text-footnote text-secondary bg-secondary px-3 py-1 rounded-full">
                  {listing.sqft.toLocaleString()} sqft
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default HomePage; 