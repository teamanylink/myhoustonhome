import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { DataService } from '../services/apiService';
import { UIUtils } from '../services/utils';
import CommunityNavigation from '../components/CommunityNavigation.jsx';
import ContactFormPopup from '../components/ContactFormPopup.jsx';

// Custom Shape Divider Component
const ShapeDivider = ({ type, position, color, opacity = 1 }) => {
  const svgShapes = {
    wave: `M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z`,
    curve: `M1200 120L0 16.48V0h1200v120z`,
    angle: `M1200 0L0 0 598.97 114.72 1200 0z`
  };

  const encodedColor = encodeURIComponent(color);
  const svgPath = svgShapes[type] || svgShapes.wave;
  
  const svgUrl = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath d='${svgPath}' fill='${encodedColor}' opacity='${opacity}'/%3E%3C/svg%3E`;

  return (
    <div
      style={{
        position: 'absolute',
        [position]: '-1px',
        left: 0,
        width: '100%',
        height: '60px',
        background: `url("${svgUrl}") center ${position} / cover no-repeat`,
        transform: position === 'bottom' ? 'rotate(180deg)' : 'none',
        zIndex: 10
      }}
    />
  );
};

// Helper function to convert hex color to RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Helper function to generate hero background style
const getHeroBackgroundStyle = (heroConfig, communityImage) => {
  const { backgroundType, backgroundColor, backgroundImage } = heroConfig;
  // Use a light overlay for the hero section to match HomePage style
  const overlayRgba = '255, 255, 255';
  const overlayOpacity = 0.85;

  if (backgroundType === 'color') {
    return {
      background: backgroundColor,
      backgroundSize: 'auto',
      backgroundPosition: 'initial',
      backgroundRepeat: 'initial'
    };
  }

  if (backgroundType === 'image') {
    // Use hero backgroundImage if specified, otherwise fall back to main community image
    const imageToUse = backgroundImage || communityImage;

    if (imageToUse) {
      return {
        background: `linear-gradient(rgba(${overlayRgba}, ${overlayOpacity}), rgba(${overlayRgba}, ${overlayOpacity})), url("${imageToUse}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      };
    }
  }

  // Fallback to background color
  return {
    background: backgroundColor || '#f8f9fa',
    backgroundSize: 'auto',
    backgroundPosition: 'initial',
    backgroundRepeat: 'initial'
  };
};

const CommunityPage = () => {
  const { id } = useParams();
  const [community, setCommunity] = useState(null);
  const [listings, setListings] = useState([]);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  // Define section background colors for consistent shape divider matching
  const sectionColors = {
    details: '#fafbfc',
    homes: '#ffffff', 
    builders: '#f8f9fa',
    listings: '#ffffff',
    contact: '#ffffff'
  };

  useEffect(() => {
    const loadCommunityData = async () => {
      console.log(`🔍 Loading community data for ID: ${id}`);
      
      // Try to get community from cache first for instant loading
      let foundCommunity = DataService.getCommunityFromCache(id);
      console.log('📦 Cache check result:', foundCommunity ? 'Found in cache' : 'Not in cache');
      
      // If not in cache, fetch from API (fallback)
      if (!foundCommunity) {
        try {
          console.log('🌐 Fetching from API...');
          foundCommunity = await DataService.getCommunity(id);
          console.log('✅ API result:', foundCommunity);
        } catch (error) {
          console.error('❌ Error loading community data:', error);
          
          // Force initialize example data if localStorage is empty
          const localCommunities = DataService.getCommunitiesFromLocalStorage();
          if (localCommunities.length === 0) {
            console.log('🚨 localStorage empty, force initializing...');
            const { initializeExampleData } = await import('../services/exampleData.js');
            initializeExampleData();
          }
          
          // Try localStorage fallback
          foundCommunity = DataService.getCommunityFromLocalStorage(id);
          console.log('📦 localStorage fallback result:', foundCommunity);
        }
      }

      if (foundCommunity) {
        console.log('🏘️ Setting community data:', foundCommunity.name);
        setCommunity(foundCommunity);
        
        // Load listings for this community
        try {
          const communityListings = await DataService.getListingsByCommunity(id);
          setListings(communityListings || []);
        } catch (error) {
          console.error('Error loading community listings:', error);
          setListings([]);
        }
        
        // Set theme variables
          const root = document.documentElement;
          root.style.setProperty('--community-primary-color', foundCommunity.theme.primaryColor);
          root.style.setProperty('--community-primary-dark', UIUtils.darkenColor(foundCommunity.theme.primaryColor, 0.2));
          root.style.setProperty('--radius-dynamic', foundCommunity.theme.borderRadius);
          root.style.setProperty('--radius-dynamic-large', foundCommunity.theme.borderRadiusLarge);
      }
    };

    loadCommunityData();
    
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
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <>
      <CommunityNavigation community={community} />
      <div className="community-page">
        {/* Hero Section */}
        {community.sections.hero.visible && (
          <motion.section 
            className="hero-section"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{
              position: 'relative',
              height: '90vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-start',
              padding: '0',
              paddingTop: '80px', // Add padding to account for the fixed header
              color: '#1D1D1F',
              ...getHeroBackgroundStyle(community.sections.hero, community.image)
            }}
          >
            <div 
              className="container" 
              style={{
                position: 'relative',
                zIndex: 2,
                maxWidth: '1400px',
                margin: '0 auto',
                paddingLeft: '5%',
                paddingRight: '5%',
                textAlign: 'left',
                width: '100%'
              }}
            >
              <div style={{ maxWidth: '650px', marginLeft: '0' }}>
                <div 
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderRadius: '100px',
                    padding: '6px 14px',
                    marginBottom: '20px'
                  }}
                >
                  <div 
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: community.theme.primaryColor,
                      marginRight: '8px'
                    }}
                  />
                  <span style={{ fontSize: '13px', fontWeight: '500' }}>Rivera Real Estate Group</span>
                </div>
                
                <h1 
                  style={{
                    fontSize: 'clamp(2.5rem, 4vw, 3.5rem)',
                    fontWeight: '700',
                    lineHeight: '1.2',
                    marginBottom: '20px',
                    color: '#1D1D1F',
                    letterSpacing: '-0.02em'
                  }}
                >
                  {community.sections.hero.title || community.name}
                </h1>
                
                <p 
                  style={{
                    fontSize: '16px',
                    lineHeight: '1.6',
                    marginBottom: '32px',
                    maxWidth: '580px',
                    color: '#4B4B4B'
                  }}
                >
                  {community.sections.hero.subtitle || community.description}
                </p>
                
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-start', alignItems: 'center', flexWrap: 'wrap' }}>
                  <a
                    href="#homes"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      backgroundColor: community.theme.primaryColor,
                      color: 'white',
                      padding: '14px 28px',
                      borderRadius: '100px',
                      fontWeight: '500',
                      fontSize: '15px',
                      textDecoration: 'none',
                      boxShadow: `0 2px 10px rgba(0, 122, 255, 0.2)`
                    }}
                  >
                    <i className="fas fa-home" style={{ marginRight: '8px' }}></i>
                    View Homes
                  </a>
                  <a 
                    href="#contact" 
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      background: 'rgba(255,255,255,0.9)',
                      color: '#1a1a1a',
                      textDecoration: 'none',
                      padding: '14px 28px',
                      borderRadius: '100px',
                      fontSize: '15px',
                      fontWeight: '500',
                      border: '2px solid rgba(0,0,0,0.1)',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    <i className="fas fa-phone" style={{ marginRight: '8px' }}></i>
                    Contact Us
                  </a>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Premium About Section */}
        {community.sections.about.visible && (
          <motion.section 
            className="community-about-section"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
            style={{ 
              background: `linear-gradient(135deg, ${community.theme.primaryColor} 0%, ${UIUtils.darkenColor(community.theme.primaryColor, 0.15)} 100%)`,
              position: 'relative',
              overflow: 'hidden',
              paddingTop: '10rem',
              paddingBottom: '10rem'
            }}
          >
            {/* Custom colored curve divider for about to details transition */}
            <ShapeDivider 
              type="curve" 
              position="bottom" 
              color={sectionColors.details}
              opacity={1}
            />
            
            {/* Subtle pattern overlay */}
            <div 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundImage: `radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)`,
                pointerEvents: 'none'
              }}
            />
          
          <div className="container" style={{ position: 'relative', zIndex: 2, display: 'flex', justifyContent: 'center' }}>
            <div style={{ maxWidth: 800, textAlign: 'center' }}>
              <motion.h2 
                className="community-about-title"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                style={{ 
                  fontSize: '2.5rem',
                  fontWeight: '700',
                  color: '#fff',
                  marginBottom: '2rem',
                  letterSpacing: '-0.02em',
                  textAlign: 'center'
                }}
              >
                About {community.name}
              </motion.h2>
              <motion.p 
                className="community-about-content"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                style={{ 
                  fontSize: '1.25rem',
                  lineHeight: '1.7',
                  color: 'rgba(255,255,255,0.95)',
                  fontWeight: '400',
                  textAlign: 'center'
                }}
              >
                {community.sections.about.content || community.description}
              </motion.p>
              
              {/* Enhanced Amenities */}
      {community.amenities && community.amenities.length > 0 && (
                <motion.div 
                  className="community-amenities"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                  style={{ marginTop: '3rem', textAlign: 'center' }}
                >
                  <h3 style={{ 
                    fontSize: '1.1rem',
                    fontWeight: '600',
                    color: 'rgba(255,255,255,0.9)',
                    marginBottom: '1.5rem',
                    textAlign: 'center'
                  }}>
                    Community Features
                  </h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'center' }}>
                {community.amenities.map((amenity, index) => (
                      <motion.span 
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: 0.7 + (index * 0.1) }}
                        className="community-amenity-tag"
                        style={{ 
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          color: '#fff',
                          padding: '0.5rem 1rem',
                          borderRadius: '25px',
                          fontSize: '0.9rem',
                          fontWeight: '500',
                          border: '1px solid rgba(255,255,255,0.3)',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                    {amenity}
                      </motion.span>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.section>
        )}



      {/* Premium Community Details */}
      <motion.section 
        className="community-details-section shape-divider shape-divider-angle-bottom"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
                  style={{ 
            padding: '10rem 0 12rem 0', 
            backgroundColor: sectionColors.details,
            position: 'relative'
          }}
      >
        {/* Divider to homes section */}
        <ShapeDivider 
          type="angle" 
          position="bottom" 
          color={sectionColors.homes}
          opacity={1}
        />
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: 1000, width: '100%' }}>
            <motion.div 
              className="community-details-grid"
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
                gap: '2rem' 
              }}
            >
              {/* Location Card */}
              <motion.div 
                className="detail-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                style={{
                  backgroundColor: '#fff',
                  padding: '2rem',
                  borderRadius: community.theme.borderRadiusLarge,
                  boxShadow: '0 4px 25px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  textAlign: 'center'
                }}
              >
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  background: `${community.theme.primaryColor}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <span style={{ fontSize: '1.5rem', color: community.theme.primaryColor }}>📍</span>
                </div>
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  color: '#1a1a1a', 
                  marginBottom: '0.5rem' 
                }}>
                  Location
                </h3>
                <p style={{ 
                  fontSize: '1rem', 
                  color: '#666', 
                  fontWeight: '500' 
                }}>
                  {community.location}
                </p>
              </motion.div>

              {/* Price Range Card */}
          <motion.div 
                className="detail-card"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
                style={{
                  backgroundColor: '#fff',
                  padding: '2rem',
                  borderRadius: community.theme.borderRadiusLarge,
                  boxShadow: '0 4px 25px rgba(0,0,0,0.08)',
                  border: '1px solid rgba(0,0,0,0.05)',
                  textAlign: 'center'
                }}
              >
                <div style={{ 
                  width: '60px', 
                  height: '60px', 
                  borderRadius: '50%', 
                  background: `${community.theme.primaryColor}15`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem'
                }}>
                  <span style={{ fontSize: '1.5rem', color: community.theme.primaryColor }}>💰</span>
                </div>
                <h3 style={{ 
                  fontSize: '1.1rem', 
                  fontWeight: '600', 
                  color: '#1a1a1a', 
                  marginBottom: '0.5rem' 
                }}>
                  Price Range
                </h3>
                <p style={{ 
                  fontSize: '1rem', 
                  fontWeight: '600',
                  color: community.theme.primaryColor
                }}>
                  {community.priceRange}
                </p>
              </motion.div>

              {/* Schools Card */}
              {community.schools && community.schools.length > 0 && (
                <motion.div 
                  className="detail-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  style={{
                    backgroundColor: '#fff',
                    padding: '2rem',
                    borderRadius: community.theme.borderRadiusLarge,
                    boxShadow: '0 4px 25px rgba(0,0,0,0.08)',
                    border: '1px solid rgba(0,0,0,0.05)',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ 
                    width: '60px', 
                    height: '60px', 
                    borderRadius: '50%', 
                    background: `${community.theme.primaryColor}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem'
                  }}>
                    <span style={{ fontSize: '1.5rem', color: community.theme.primaryColor }}>🎓</span>
              </div>
                  <h3 style={{ 
                    fontSize: '1.1rem', 
                    fontWeight: '600', 
                    color: '#1a1a1a', 
                    marginBottom: '0.5rem' 
                  }}>
                    Schools
                  </h3>
                  <p style={{ 
                    fontSize: '0.9rem', 
                    color: '#666',
                    lineHeight: '1.4'
                  }}>
                    {community.schools.join(', ')}
                  </p>
                </motion.div>
              )}
            </motion.div>
            </div>
        </div>
      </motion.section>

      {/* Premium Home Models Section */}
      {community.sections.homes.visible && community.homes.length > 0 && (
        <motion.section 
          id="homes" 
          className="homes-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ 
            padding: '10rem 0 12rem 0', 
            backgroundColor: sectionColors.homes,
            position: 'relative'
          }}
        >
          {/* Divider to builders section */}
          <ShapeDivider 
            type="wave" 
            position="bottom" 
            color={sectionColors.builders}
            opacity={1}
          />
          
          <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '1200px' }}>
              {/* Home Models Section Header */}
              <div className="community-section-header" style={{ marginBottom: '3rem' }}>
                <h2 style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '700', 
                  color: '#1a1a1a', 
                  marginBottom: '1rem',
                  letterSpacing: '-0.02em',
                  textAlign: 'center'
                }}>
                  {community.sections.homes.title}
                </h2>
                <p style={{ 
                  fontSize: '1.1rem', 
                  color: '#666', 
                  maxWidth: '600px',
                  textAlign: 'center',
                  margin: '0 auto'
                }}>
                  Discover our beautiful home designs in {community.name}
                </p>
              </div>

              <motion.div 
                className="homes-grid"
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                  gap: '2.5rem',
                  maxWidth: '1000px',
                  margin: '0 auto'
                }}
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
          </div>
        </motion.section>
      )}

      {/* Premium Builders Section */}
      {community.sections.builders.visible && community.builders.length > 0 && (
        <motion.section 
          className="builders-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ 
            padding: '10rem 0 12rem 0', 
            backgroundColor: sectionColors.builders,
            position: 'relative'
          }}
        >
          {/* Divider to listings section */}
          <ShapeDivider 
            type="curve" 
            position="bottom" 
            color={sectionColors.listings}
            opacity={1}
          />
          
          <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '1200px' }}>
              {/* Builders Section Header */}
              <div className="community-section-header" style={{ marginBottom: '3rem' }}>
                <h2 style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '700', 
                  color: '#1a1a1a', 
                  marginBottom: '1rem',
                  letterSpacing: '-0.02em',
                  textAlign: 'center'
                }}>
                  {community.sections.builders.title}
                </h2>
                <p style={{ 
                  fontSize: '1.1rem', 
                  color: '#666', 
                  maxWidth: '600px',
                  textAlign: 'center',
                  margin: '0 auto'
                }}>
                  Meet our trusted builder partners in {community.name}
                </p>
              </div>

              <motion.div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
                  gap: '2.5rem',
                  maxWidth: '1000px',
                  margin: '0 auto'
                }}
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
          </div>
        </motion.section>
      )}

      {/* Premium Available Listings */}
      {listings.length > 0 && (
        <motion.section 
          className="listings-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ 
            padding: '10rem 0 6rem 0', 
            backgroundColor: sectionColors.listings,
            position: 'relative'
          }}
        >
          {/* No shape divider should be here since both listings and contact sections are white now */}
          
          <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '100%', maxWidth: '1200px' }}>
              {/* Listings Section Header */}
              <div className="community-section-header" style={{ marginBottom: '3rem' }}>
                <h2 style={{ 
                  fontSize: '2.5rem', 
                  fontWeight: '700', 
                  color: '#1a1a1a', 
                  marginBottom: '1rem',
                  letterSpacing: '-0.02em',
                  textAlign: 'center'
                }}>
                  Available Homes
                </h2>
                <p style={{ 
                  fontSize: '1.1rem', 
                  color: '#666', 
                  maxWidth: '600px',
                  textAlign: 'center',
                  margin: '0 auto'
                }}>
                  Ready to move in homes in {community.name}
                </p>
              </div>

              <motion.div 
                style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: '2.5rem',
                  maxWidth: '1000px',
                  margin: '0 auto'
                }}
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
          </div>
        </motion.section>
      )}

      {/* Premium Contact Section */}
      <motion.section 
        id="contact" 
        className="contact-section"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        style={{ 
          padding: '6rem 0 4rem 0',
          background: `linear-gradient(135deg, ${community.theme.primaryColor} 0%, ${UIUtils.darkenColor(community.theme.primaryColor, 0.15)} 100%)`,
          position: 'relative'
        }}
      >
        <div className="container" style={{ display: 'flex', justifyContent: 'center' }}>
          <div style={{ maxWidth: '600px', width: '100%', textAlign: 'center' }}>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              style={{ 
                fontSize: '2.5rem', 
                fontWeight: '700', 
                color: '#ffffff', 
                marginBottom: '1.5rem',
                letterSpacing: '-0.02em',
                transition: 'transform 0.3s ease',
                textAlign: 'center'
              }}
            >
              Interested in {community.name}?
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              style={{ 
                fontSize: '1.1rem', 
                color: 'rgba(255, 255, 255, 0.9)', 
                marginBottom: '3rem',
                lineHeight: '1.6',
                textAlign: 'center'
              }}
            >
              Contact us to learn more about available homes and schedule a visit to experience the community firsthand.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}
            >
              <button 
                className="premium-cta-button"
                style={{
                  background: '#ffffff',
                  color: community.theme.primaryColor,
                  border: 'none',
                  padding: '1rem 2.5rem',
                  borderRadius: community.theme.borderRadiusLarge,
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  boxShadow: '0 8px 30px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s ease',
                  minWidth: '180px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
                }}
              >
                Schedule Visit
              </button>
              <button 
                className="premium-secondary-button"
                onClick={() => setIsContactFormOpen(true)}
                style={{
                  background: 'transparent',
                  color: '#ffffff',
                  border: '2px solid #ffffff',
                  padding: '1rem 2.5rem',
                  borderRadius: community.theme.borderRadiusLarge,
                  fontSize: '1rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minWidth: '180px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                Request Information
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>

    {/* Contact Form Popup */}
    {community && (
      <ContactFormPopup 
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
        communityName={community.name}
        communityTheme={community.theme}
      />
    )}
    </>
  );
};

const HomeModelCard = ({ home, theme }) => {
  return (
    <motion.div 
      className="premium-home-card"
      whileHover={{ 
        scale: 1.02,
        y: -8,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      }}
      whileTap={{ scale: 0.98 }}
      style={{ 
        backgroundColor: '#fff',
        borderRadius: theme.borderRadiusLarge,
        boxShadow: '0 4px 25px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.05)',
        overflow: 'hidden',
        cursor: 'pointer',
        maxWidth: '340px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      {/* Image placeholder - could be enhanced with actual home images */}
      <div style={{ 
        height: '180px', 
        background: `linear-gradient(135deg, ${theme.primaryColor}15 0%, ${theme.primaryColor}25 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <span style={{ fontSize: '3rem', opacity: 0.6 }}>🏡</span>
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '0.5rem 1rem',
          fontSize: '0.8rem',
          fontWeight: '600',
          color: theme.primaryColor
        }}>
          New Model
        </div>
      </div>
      
      <div style={{ padding: '1.5rem' }}>
        <div style={{ marginBottom: '1.25rem' }}>
          <h3 style={{ 
            fontSize: '1.3rem',
            fontWeight: '700',
            color: '#1a1a1a',
            marginBottom: '0.5rem'
          }}>
              {home.name}
            </h3>
          <div style={{ 
            fontSize: '1.5rem',
            fontWeight: '700',
            color: theme.primaryColor,
            marginBottom: '0.75rem'
          }}>
            {typeof home.price === 'number' ? UIUtils.formatPrice(home.price) : home.price}
          </div>
          </div>
          
        <div style={{ 
          display: 'flex', 
          gap: '0.5rem', 
          flexWrap: 'wrap',
          marginBottom: '1.25rem'
        }}>
          <span style={{
            background: `${theme.primaryColor}10`,
            color: theme.primaryColor,
            padding: '0.4rem 0.8rem',
            borderRadius: '16px',
            fontSize: '0.8rem',
            fontWeight: '600',
            border: `1px solid ${theme.primaryColor}20`
          }}>
                {home.bedrooms} bed
              </span>
          <span style={{
            background: `${theme.primaryColor}10`,
            color: theme.primaryColor,
            padding: '0.4rem 0.8rem',
            borderRadius: '16px',
            fontSize: '0.8rem',
            fontWeight: '600',
            border: `1px solid ${theme.primaryColor}20`
          }}>
                {home.bathrooms} bath
              </span>
          <span style={{
            background: `${theme.primaryColor}10`,
            color: theme.primaryColor,
            padding: '0.4rem 0.8rem',
            borderRadius: '16px',
            fontSize: '0.8rem',
            fontWeight: '600',
            border: `1px solid ${theme.primaryColor}20`
          }}>
                {home.sqft?.toLocaleString()} sqft
              </span>
        </div>
        
        <button style={{
          width: '100%',
          background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${UIUtils.darkenColor(theme.primaryColor, 0.1)} 100%)`,
          color: '#fff',
          border: 'none',
          padding: '0.75rem',
          borderRadius: theme.borderRadius,
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}>
          View Details
        </button>
      </div>
    </motion.div>
  );
};

const BuilderCard = ({ builder, theme }) => {
  return (
    <motion.div 
      className="premium-builder-card"
      whileHover={{ 
        scale: 1.02,
        y: -8,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      }}
      whileTap={{ scale: 0.98 }}
      style={{ 
        backgroundColor: '#fff',
        borderRadius: theme.borderRadiusLarge,
        boxShadow: '0 4px 25px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.05)',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
        maxWidth: '340px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      {/* Builder logo/icon area */}
      <div style={{ 
        height: '100px', 
        background: `linear-gradient(135deg, ${theme.primaryColor}08 0%, ${theme.primaryColor}15 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }}>
        <div style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
        }}>
          <span style={{ fontSize: '1.5rem', color: theme.primaryColor }}>🏗️</span>
        </div>
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          background: `${theme.primaryColor}`,
          color: '#fff',
          borderRadius: '12px',
          padding: '0.3rem 0.8rem',
          fontSize: '0.7rem',
          fontWeight: '600'
        }}>
          Partner Builder
        </div>
      </div>
      
      <div style={{ padding: '1.5rem', textAlign: 'center' }}>
        <h3 style={{ 
          fontSize: '1.3rem',
          fontWeight: '700',
          color: '#1a1a1a',
          marginBottom: '0.75rem'
        }}>
              {builder.name}
            </h3>
        <p style={{ 
          fontSize: '0.9rem',
          color: '#666',
          lineHeight: '1.6',
          marginBottom: '1.25rem'
        }}>
              {builder.description}
            </p>
          
          {builder.contact && (
          <div style={{ marginBottom: '1.25rem' }}>
            <span style={{
              background: `${theme.primaryColor}10`,
              color: theme.primaryColor,
              padding: '0.4rem 0.8rem',
              borderRadius: '16px',
              fontSize: '0.8rem',
              fontWeight: '600',
              border: `1px solid ${theme.primaryColor}20`
            }}>
              📞 {builder.contact}
              </span>
            </div>
          )}
        
        <button style={{
          width: '100%',
          background: '#fff',
          color: theme.primaryColor,
          border: `2px solid ${theme.primaryColor}`,
          padding: '0.75rem',
          borderRadius: theme.borderRadius,
          fontSize: '0.9rem',
          fontWeight: '600',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}>
          Learn More
        </button>
      </div>
    </motion.div>
  );
};

const ListingCard = ({ listing, theme }) => {
  return (
    <motion.div 
      className="premium-listing-card"
      whileHover={{ 
        scale: 1.02,
        y: -8,
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      }}
      whileTap={{ scale: 0.98 }}
      style={{ 
        backgroundColor: '#fff',
        borderRadius: theme.borderRadiusLarge,
        boxShadow: '0 4px 25px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.05)',
        overflow: 'hidden',
        cursor: 'pointer',
        maxWidth: '340px',
        margin: '0 auto',
        width: '100%'
      }}
    >
      <Link to={`/listing/${listing.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
        {/* Listing image placeholder */}
        <div style={{ 
          height: '180px', 
          background: `linear-gradient(135deg, ${theme.primaryColor}12 0%, ${theme.primaryColor}20 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative'
        }}>
          <span style={{ fontSize: '3.5rem', opacity: 0.5 }}>🏠</span>
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: '#28a745',
            color: '#fff',
            borderRadius: '16px',
            padding: '0.4rem 0.8rem',
            fontSize: '0.8rem',
            fontWeight: '600'
          }}>
            Available Now
          </div>
          <div style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '0.4rem 0.8rem',
            fontSize: '0.8rem',
            fontWeight: '700',
            color: theme.primaryColor
          }}>
            {UIUtils.formatPrice(listing.price)}
          </div>
        </div>
        
        <div style={{ padding: '1.5rem' }}>
          <div style={{ marginBottom: '1.25rem' }}>
            <h3 style={{ 
              fontSize: '1.3rem',
              fontWeight: '700',
              color: '#1a1a1a',
              marginBottom: '0.5rem'
            }}>
                {listing.title}
              </h3>
            <p style={{ 
              fontSize: '0.9rem',
              color: '#666',
              fontWeight: '500'
            }}>
              📍 {listing.address}
              </p>
            </div>
            
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            flexWrap: 'wrap',
            marginBottom: '1.25rem'
          }}>
            <span style={{
              background: `${theme.primaryColor}10`,
              color: theme.primaryColor,
              padding: '0.4rem 0.8rem',
              borderRadius: '16px',
              fontSize: '0.8rem',
              fontWeight: '600',
              border: `1px solid ${theme.primaryColor}20`
            }}>
              🛏️ {listing.bedrooms} bed
                </span>
            <span style={{
              background: `${theme.primaryColor}10`,
              color: theme.primaryColor,
              padding: '0.4rem 0.8rem',
              borderRadius: '16px',
              fontSize: '0.8rem',
              fontWeight: '600',
              border: `1px solid ${theme.primaryColor}20`
            }}>
              🚿 {listing.bathrooms} bath
                </span>
            <span style={{
              background: `${theme.primaryColor}10`,
              color: theme.primaryColor,
              padding: '0.4rem 0.8rem',
              borderRadius: '16px',
              fontSize: '0.8rem',
              fontWeight: '600',
              border: `1px solid ${theme.primaryColor}20`
            }}>
              📐 {listing.sqft.toLocaleString()} sqft
                </span>
              </div>
          
          <div style={{
            width: '100%',
            background: `linear-gradient(135deg, ${theme.primaryColor} 0%, ${UIUtils.darkenColor(theme.primaryColor, 0.1)} 100%)`,
            color: '#fff',
            border: 'none',
            padding: '0.75rem',
            borderRadius: theme.borderRadius,
            fontSize: '0.9rem',
            fontWeight: '600',
            textAlign: 'center',
            transition: 'all 0.2s ease'
          }}>
            View Listing
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CommunityPage; 