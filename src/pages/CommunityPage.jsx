import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DataService, UIUtils } from '../services/dataService';

const CommunityPage = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const foundCommunity = DataService.getCommunity(id);
    if (foundCommunity) {
      setCommunity(foundCommunity);
      setListings(DataService.getListingsByCommunity(id));
      // Only set primary color for this page, and set a custom CSS variable for button glow
      const root = document.documentElement;
      root.style.setProperty('--community-primary-color', foundCommunity.theme.primaryColor);
      root.style.setProperty('--community-primary-dark', UIUtils.darkenColor(foundCommunity.theme.primaryColor, 0.2));
      root.style.setProperty('--radius-dynamic', foundCommunity.theme.borderRadius);
      root.style.setProperty('--radius-dynamic-large', foundCommunity.theme.borderRadiusLarge);
    }
    // Cleanup function to reset theme
    return () => {
      const root = document.documentElement;
      root.style.removeProperty('--community-primary-color');
      root.style.removeProperty('--community-primary-dark');
      root.style.setProperty('--radius-dynamic', '12px');
      root.style.setProperty('--radius-dynamic-large', '16px');
    };
  }, [id]);

  if (!community) {
    return (
      <div className="container section">
        <div className="text-center space-y-4">
          <h1 className="text-title-1">Community Not Found</h1>
          <p className="text-body text-secondary">
            The community you're looking for doesn't exist.
          </p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

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
    <div className="community-page">
      {/* Hero Section */}
      {community.sections.hero.visible && (
        <motion.section 
          className="hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
          style={{ background: `linear-gradient(135deg, ${community.theme.primaryColor}05 0%, ${community.theme.primaryColor}02 100%)` }}
        >
          <div className="container">
            <h1 className="hero-title">
              {community.sections.hero.title || community.name}
            </h1>
            <p className="hero-subtitle">
              {community.sections.hero.subtitle || community.description}
            </p>
            <div className="hero-actions">
              <a
                href="#homes"
                className="btn btn-primary"
                style={{
                  boxShadow: `0 4px 20px ${community.theme.primaryColor}40, 0 8px 30px ${community.theme.primaryColor}60`,
                  background: `linear-gradient(135deg, ${community.theme.primaryColor} 0%, ${UIUtils.darkenColor(community.theme.primaryColor, 0.2)} 100%)`
                }}
              >
                View Homes
              </a>
              <a href="#contact" className="btn btn-secondary">
                Contact Us
              </a>
            </div>
          </div>
        </motion.section>
      )}

      {/* About Section with dynamic background */}
      {community.sections.about.visible && (
        <section style={{ background: community.theme.primaryColor, color: '#fff', padding: '88px 0' }}>
          <div className="container">
            <div style={{ maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
              <h2 className="text-title-1 font-bold mb-4" style={{ color: '#fff' }}>About {community.name}</h2>
              <p className="text-body leading-relaxed" style={{ color: 'rgba(255,255,255,0.92)', fontSize: '1.18rem' }}>
                {community.sections.about.content || community.description}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* Amenities Section */}
      {community.amenities && community.amenities.length > 0 && (
        <section style={{ background: '#f7f8fa', padding: '96px 0' }}>
          <div className="container">
            <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
              <h2 className="text-title-1 font-bold mb-8" style={{ color: '#222' }}>Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 justify-center">
                {community.amenities.map((amenity, index) => (
                  <div key={index} className="inline-flex items-center justify-center rounded-full bg-secondary text-secondary px-6 py-3 text-base font-medium" style={{ background: '#e5e5ea', color: '#444', borderRadius: '9999px' }}>
                    {amenity}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Community Info */}
      <section className="section">
        <div className="container">
          <motion.div 
            className="grid grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="space-y-6">
              <div>
                <h2 className="text-title-1 font-bold mb-4">Community Details</h2>
                <div className="space-y-3">
                  <div>
                    <span className="text-subheadline font-medium text-secondary">Location:</span>
                    <span className="text-body ml-2">{community.location}</span>
                  </div>
                  <div>
                    <span className="text-subheadline font-medium text-secondary">Price Range:</span>
                    <span className="text-body ml-2">{community.priceRange}</span>
                  </div>
                </div>
              </div>

              {/* About Section */}
              {community.sections.about.visible && (
                <div className="space-y-6">
                  <div>
                    <h2 className="text-title-1 font-bold mb-4">About {community.name}</h2>
                    <p className="text-body text-secondary leading-relaxed">
                      {community.sections.about.content || community.description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* About Section */}
            {community.sections.about.visible && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-title-1 font-bold mb-4">About {community.name}</h2>
                  <p className="text-body text-secondary leading-relaxed">
                    {community.sections.about.content || community.description}
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      {/* Home Models Section */}
      {community.sections.homes.visible && community.homes.length > 0 && (
        <section id="homes" className="section bg-secondary">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                {community.sections.homes.title}
              </h2>
            </div>

            <motion.div 
              className="grid grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {community.homes.map((home, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <HomeModelCard home={home} theme={community.theme} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Builders Section */}
      {community.sections.builders.visible && community.builders.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">
                {community.sections.builders.title}
              </h2>
            </div>

            <motion.div 
              className="grid grid-cols-2"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {community.builders.map((builder, index) => (
                <motion.div key={index} variants={itemVariants}>
                  <BuilderCard builder={builder} theme={community.theme} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Available Listings */}
      {listings.length > 0 && (
        <section className="section bg-secondary">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Available Homes</h2>
              <p className="section-subtitle">
                Ready to move in homes in {community.name}
              </p>
            </div>

            <motion.div 
              className="grid grid-cols-3"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-100px" }}
            >
              {listings.map((listing) => (
                <motion.div key={listing.id} variants={itemVariants}>
                  <ListingCard listing={listing} theme={community.theme} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      <section id="contact" className="section">
        <div className="container">
          <div className="text-center space-y-4">
            <h2 className="text-title-1 font-bold">Interested in {community.name}?</h2>
            <p className="text-body text-secondary">
              Contact us to learn more about available homes and schedule a visit.
            </p>
            <div className="flex gap-4 justify-center">
              <button className="btn btn-primary">
                Schedule Visit
              </button>
              <button className="btn btn-secondary">
                Request Information
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const HomeModelCard = ({ home, theme }) => {
  return (
    <motion.div 
      className="card"
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      }}
      whileTap={{ scale: 0.97 }}
      style={{ borderRadius: theme.borderRadiusLarge }}
    >
      <div className="card-content">
        <div className="space-y-4">
          <div>
            <h3 className="text-title-3 font-bold text-primary mb-2">
              {home.name}
            </h3>
          </div>
          
          <div className="space-y-3">
            <div className="text-title-2 font-bold" style={{ color: theme.primaryColor }}>
              {UIUtils.formatPrice(home.price)}
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-footnote text-secondary bg-secondary px-3 py-1 rounded-full">
                {home.bedrooms} bed
              </span>
              <span className="text-footnote text-secondary bg-secondary px-3 py-1 rounded-full">
                {home.bathrooms} bath
              </span>
              <span className="text-footnote text-secondary bg-secondary px-3 py-1 rounded-full">
                {home.sqft?.toLocaleString()} sqft
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const BuilderCard = ({ builder, theme }) => {
  return (
    <motion.div 
      className="card"
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      }}
      whileTap={{ scale: 0.97 }}
      style={{ borderRadius: theme.borderRadiusLarge }}
    >
      <div className="card-content">
        <div className="space-y-4">
          <div>
            <h3 className="text-title-3 font-bold mb-2" style={{ color: theme.primaryColor }}>
              {builder.name}
            </h3>
            <p className="text-body text-secondary leading-relaxed">
              {builder.description}
            </p>
          </div>
          
          <div className="space-y-2">
            <span className="text-footnote text-tertiary bg-secondary px-3 py-1 rounded-full inline-block">
              {builder.contact}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

const ListingCard = ({ listing, theme }) => {
  return (
    <motion.div 
      className="card"
      whileHover={{ 
        scale: 1.03,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      }}
      whileTap={{ scale: 0.97 }}
      style={{ borderRadius: theme.borderRadiusLarge }}
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
            </div>
            
            <div className="space-y-3">
              <div className="text-title-2 font-bold" style={{ color: theme.primaryColor }}>
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

export default CommunityPage; 