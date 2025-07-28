import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { DataService } from '../services/apiService';
import { UIUtils } from '../services/utils';

const HomePage = () => {
  const [communities, setCommunities] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        console.log('🔄 Loading communities and listings...');
        
        const [communitiesData, listingsData] = await Promise.all([
          DataService.getCommunities(),
          DataService.getListings()
        ]);
        
        console.log('📋 Communities loaded:', communitiesData);
        console.log('🏠 Listings loaded:', listingsData);
        
        setCommunities(communitiesData || []);
        setListings(listingsData || []);
        
        // If no communities loaded, force initialize example data
        if (!communitiesData || communitiesData.length === 0) {
          console.log('🚨 No communities found, force initializing localStorage...');
          const { initializeExampleData } = await import('../services/exampleData.js');
          initializeExampleData();
          
          // Try loading again from localStorage
          const fallbackCommunities = DataService.getCommunitiesFromLocalStorage();
          const fallbackListings = DataService.getListingsFromLocalStorage();
          console.log('📦 Fallback communities:', fallbackCommunities);
          setCommunities(fallbackCommunities || []);
          setListings(fallbackListings || []);
        }
      } catch (error) {
        console.error('❌ Error loading data:', error);
        
        // Force fallback to localStorage
        console.log('🔄 Falling back to localStorage...');
        const fallbackCommunities = DataService.getCommunitiesFromLocalStorage();
        const fallbackListings = DataService.getListingsFromLocalStorage();
        console.log('📦 localStorage communities:', fallbackCommunities);
        setCommunities(fallbackCommunities || []);
        setListings(fallbackListings || []);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
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
      <section 
        className="hero-section"
        style={{
          backgroundImage: 'url(/images/communities/brookewater.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          height: '90vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-start',
          padding: '0',
          paddingTop: '80px', // Add padding to account for the fixed header
          color: '#1D1D1F'
        }}
      >
        {/* Overlay */}
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
            zIndex: 1
          }}
        />
        
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
                  backgroundColor: '#007AFF',
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
              Find Your Perfect<br />
              Houston Community
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
              Discover the ideal neighborhood for your lifestyle with personalized
              recommendations and local insights across the greater Houston area.
            </p>
            
            <Link 
              to="#communities" 
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById('communities');
                if (element) {
                  element.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                  });
                }
              }}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                backgroundColor: '#007AFF',
                color: 'white',
                padding: '14px 28px',
                borderRadius: '100px',
                fontWeight: '500',
                fontSize: '15px',
                textDecoration: 'none',
                boxShadow: '0 2px 10px rgba(0, 122, 255, 0.2)'
              }}
            >
              <i 
                className="fas fa-map-marker-alt" 
                style={{ marginRight: '8px' }}
              />
              Explore Communities
            </Link>
          </div>
        </div>
      </section>

      {/* About MyHoustonHome Section */}
      <section style={{ padding: '120px 0 160px', background: 'white' }}>
        <div className="container">
          <motion.div 
            style={{ maxWidth: '1200px', margin: '0 auto' }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Header */}
            <div className="custom-section-header">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="custom-section-badge"
                style={{
                  background: 'white',
                  color: 'var(--primary-color)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                }}
              >
                ABOUT MYHOUSTONHOME
              </motion.div>
              
              <h2 className="custom-section-title">
                Your Gateway to Houston's
                <br />
                <span style={{ color: 'var(--primary-color)' }}>Premier Communities</span>
              </h2>
              
              <p className="custom-section-description">
                We specialize in connecting homebuyers with Houston's most desirable master-planned communities. 
                From luxury amenities to top-rated schools, we help you find not just a house, but the perfect 
                neighborhood for your lifestyle.
              </p>
            </div>

            {/* Stats Row */}
            <motion.div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(4, 1fr)', 
                gap: '48px',
                marginBottom: '80px',
                padding: '60px 0',
                borderTop: '1px solid #f0f0f0',
                borderBottom: '1px solid #f0f0f0'
              }}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '8px' }}>
                  6+
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                  Communities
                </div>
                <div style={{ fontSize: '14px', color: '#888' }}>
                  Carefully curated
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '8px' }}>
                  $200K+
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                  Starting Prices
                </div>
                <div style={{ fontSize: '14px', color: '#888' }}>
                  Affordable luxury
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '8px' }}>
                  15+
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                  Top Builders
                </div>
                <div style={{ fontSize: '14px', color: '#888' }}>
                  Trusted partners
                </div>
              </div>
              
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '48px', fontWeight: '700', color: 'var(--primary-color)', marginBottom: '8px' }}>
                  A+
                </div>
                <div style={{ fontSize: '16px', fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                  School Districts
                </div>
                <div style={{ fontSize: '14px', color: '#888' }}>
                  Excellence in education
                </div>
              </div>
            </motion.div>

            {/* Features Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '40px' }}>
              {[
                {
                  title: "Expert Market Knowledge",
                  description: "Deep understanding of Houston's growth patterns, school districts, and emerging neighborhoods to guide your decision.",
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M9 11H5a2 2 0 00-2 2v7a2 2 0 002 2h4a2 2 0 002-2v-7a2 2 0 00-2-2zM13 11h4a2 2 0 012 2v7a2 2 0 01-2 2h-4a2 2 0 01-2-2v-7a2 2 0 012-2zM9 7V4a2 2 0 012-2h2a2 2 0 012 2v3"/>
                    </svg>
                  )
                },
                {
                  title: "Curated Communities",
                  description: "Hand-selected master-planned communities with resort-style amenities, modern infrastructure, and strong resale value.",
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M3 21l18 0"/>
                      <path d="M5 21V7l8-4v18"/>
                      <path d="M19 21V11l-6-4"/>
                      <path d="M9 9v.01"/>
                      <path d="M9 12v.01"/>
                      <path d="M9 15v.01"/>
                      <path d="M9 18v.01"/>
                    </svg>
                  )
                },
                {
                  title: "Seamless Experience",
                  description: "From initial discovery to move-in, we streamline the home-buying journey with trusted builder partnerships.",
                  icon: (
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
                      <path d="M2 17l10 5 10-5"/>
                      <path d="M2 12l10 5 10-5"/>
                    </svg>
                  )
                }
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                  whileHover={{ y: -8 }}
                  style={{
                    background: 'white',
                    border: '1px solid #f0f0f0',
                    borderRadius: '24px',
                    padding: '40px 32px',
                    textAlign: 'center',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                    transition: 'all 0.3s ease'
                  }}
                >
                  <div style={{ 
                    width: '80px',
                    height: '80px',
                    margin: '0 auto 24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.25)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '20px',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.5)',
                    color: 'var(--primary-color)'
                  }}>
                    {feature.icon}
                  </div>
                  <h3 style={{ 
                    fontSize: '20px', 
                    fontWeight: '700', 
                    color: '#1a1a1a',
                    marginBottom: '16px',
                    lineHeight: '1.3'
                  }}>
                    {feature.title}
                  </h3>
                  <p style={{ 
                    fontSize: '16px', 
                    color: '#666', 
                    lineHeight: '1.6'
                  }}>
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Houston Section */}
      <section style={{ 
        padding: '120px 0 160px', 
        background: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background decoration */}
        <div style={{
          position: 'absolute',
          top: '0',
          right: '-200px',
          width: '600px',
          height: '600px',
          background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.03) 0%, rgba(0, 122, 255, 0.01) 100%)',
          borderRadius: '50%',
          zIndex: '1'
        }} />
        
        <div className="container" style={{ position: 'relative', zIndex: '2' }}>
          <motion.div 
            style={{ maxWidth: '1200px', margin: '0 auto' }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            {/* Header */}
            <div className="custom-section-header">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="custom-section-badge"
                style={{
                  background: 'white',
                  color: 'var(--primary-color)',
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)'
                }}
              >
                WHY HOUSTON
              </motion.div>
              
              <h2 className="custom-section-title">
                America's Most
                <br />
                <span style={{ color: 'var(--primary-color)' }}>Dynamic City</span>
              </h2>
              
              <p className="custom-section-description">
                Houston offers unmatched job opportunities, world-class dining, diverse culture, 
                and some of the most affordable luxury living in America. Discover why millions 
                call Houston home.
              </p>
            </div>

            {/* Two-column layout */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
              {/* Left column - Benefits */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
              >
                                 {[
                   {
                     title: "Economic Powerhouse",
                     description: "Home to 26 Fortune 500 companies and the world's largest energy corridor. No state income tax means more money in your pocket.",
                     icon: (
                       <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                         <path d="M20 7h-9"/>
                         <path d="M14 17H5"/>
                         <circle cx="17" cy="17" r="3"/>
                         <circle cx="7" cy="7" r="3"/>
                       </svg>
                     )
                   },
                   {
                     title: "World-Class Education",
                     description: "Top-rated school districts and prestigious universities including Rice University and University of Houston.",
                     icon: (
                       <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                         <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
                         <path d="M6 12v5c3 3 9 3 12 0v-5"/>
                       </svg>
                     )
                   },
                   {
                     title: "Cultural Capital",
                     description: "Museum District, Theater District, professional sports, and the most diverse dining scene in America.",
                     icon: (
                       <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                         <polygon points="3,11 22,2 13,21 11,13 3,11"/>
                       </svg>
                     )
                   },
                   {
                     title: "Strategic Location",
                     description: "Easy access to downtown, major employment centers, and recreational areas with modern infrastructure.",
                     icon: (
                       <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                         <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                         <circle cx="12" cy="10" r="3"/>
                       </svg>
                     )
                   }
                 ].map((benefit, index) => (
                   <motion.div
                     key={index}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
                     style={{
                       display: 'flex',
                       alignItems: 'flex-start',
                       gap: '20px',
                       padding: '24px',
                       background: 'white',
                       borderRadius: '20px',
                       boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)',
                       border: '1px solid rgba(0, 0, 0, 0.06)'
                     }}
                   >
                     <div style={{
                       width: '64px',
                       height: '64px',
                       display: 'flex',
                       alignItems: 'center',
                       justifyContent: 'center',
                       background: 'rgba(255, 255, 255, 0.3)',
                       backdropFilter: 'blur(20px)',
                       border: '1px solid rgba(255, 255, 255, 0.4)',
                       borderRadius: '18px',
                       boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)',
                       flexShrink: 0,
                       color: 'var(--primary-color)'
                     }}>
                       {benefit.icon}
                     </div>
                    <div>
                      <h3 style={{ 
                        fontSize: '18px', 
                        fontWeight: '700', 
                        color: '#1a1a1a',
                        marginBottom: '8px'
                      }}>
                        {benefit.title}
                      </h3>
                      <p style={{ 
                        fontSize: '15px', 
                        color: '#666', 
                        lineHeight: '1.6'
                      }}>
                        {benefit.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Right column - Visual element */}
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.6 }}
                style={{
                  background: 'white',
                  borderRadius: '32px',
                  padding: '48px',
                  boxShadow: '0 20px 60px rgba(0, 0, 0, 0.08)',
                  border: '1px solid rgba(0, 0, 0, 0.06)',
                  textAlign: 'center'
                }}
              >
                                 <div style={{
                   width: '120px',
                   height: '120px',
                   background: 'rgba(255, 255, 255, 0.2)',
                   backdropFilter: 'blur(30px)',
                   border: '1px solid rgba(255, 255, 255, 0.3)',
                   borderRadius: '30px',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center',
                   margin: '0 auto 32px',
                   boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15), inset 0 2px 0 rgba(255, 255, 255, 0.7)',
                   color: 'var(--primary-color)'
                 }}>
                   <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
                     <path d="M3 21h18"/>
                     <path d="M6 21V9a2 2 0 012-2h8a2 2 0 012 2v12"/>
                     <path d="M10 9V6a2 2 0 012-2h0a2 2 0 012 2v3"/>
                     <path d="M10 12h4"/>
                     <path d="M10 15h4"/>
                     <path d="M10 18h4"/>
                   </svg>
                 </div>
                
                <h3 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#1a1a1a',
                  marginBottom: '16px'
                }}>
                  4th Largest City
                </h3>
                
                <p style={{
                  fontSize: '16px',
                  color: '#666',
                  lineHeight: '1.6',
                  marginBottom: '32px'
                }}>
                  Houston is America's 4th largest city and the most diverse major city in the country, 
                  offering unparalleled opportunities for growth and success.
                </p>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '24px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    padding: '20px',
                    background: 'rgba(0, 122, 255, 0.04)',
                    borderRadius: '16px'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary-color)' }}>
                      2.3M+
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}>
                      Population
                    </div>
                  </div>
                  
                  <div style={{
                    padding: '20px',
                    background: 'rgba(0, 122, 255, 0.04)',
                    borderRadius: '16px'
                  }}>
                    <div style={{ fontSize: '24px', fontWeight: '700', color: 'var(--primary-color)' }}>
                      #1
                    </div>
                    <div style={{ fontSize: '14px', color: '#666', fontWeight: '600' }}>
                      Job Growth
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Communities Section */}
      <section id="communities" className="section" style={{ paddingBottom: 'var(--spacing-24)', background: 'white' }}>
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Communities</h2>
            <p className="section-subtitle">
              Explore master-planned communities designed for modern living
            </p>
            <div style={{ textAlign: 'center', marginTop: '16px' }}>
              <Link 
                to="/communities" 
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  color: 'var(--primary-color)',
                  fontWeight: '600',
                  fontSize: '16px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
              >
                View All Communities
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '6px' }}>
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </Link>
            </div>
          </div>

          <motion.div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '32px',
              marginTop: '48px'
            }}
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
      <Link to={`/community/${community.id}`} style={{ textDecoration: 'none' }}>
        {/* Community Image */}
        <div style={{ width: '100%', height: 220, overflow: 'hidden', flexShrink: 0 }}>
          <img 
            src={community.image} 
            alt={community.name}
            style={{ 
              width: '100%', 
              height: '100%', 
              objectFit: 'cover',
              borderRadius: '20px 20px 0 0'
            }}
          />
        </div>
        <div className="card-content">
          <div>
            <h3 className="text-title-3 font-bold text-primary mb-2">
              {community.name}
            </h3>
            <p className="text-callout text-secondary font-medium">
              {community.location}
            </p>
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
          <div className="space-y-4 flex-1">
            <div>
              <h3 className="text-title-3 font-bold text-primary mb-2">
                {listing.title}
              </h3>
              <p className="text-callout text-secondary font-medium">
                {listing.address}
              </p>
              {community && (
                <p className="text-footnote font-semibold mt-1" style={{ color: community.theme?.primaryColor || 'var(--primary-color)' }}>
                  {community.name}
                </p>
              )}
            </div>
            
            <div className="space-y-3 mt-auto">
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