import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DataService } from '../services/dataService';

const CommunitiesPage = () => {
  const [communities, setCommunities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCommunities = async () => {
      try {
        setLoading(true);
        // Try to load from API first
        try {
          const response = await fetch('/api/communities');
          if (response.ok) {
            const data = await response.json();
            setCommunities(data);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.log('API not available, falling back to local data');
        }

        // Fallback to local data
        const localCommunities = DataService.getCommunities();
        setCommunities(localCommunities);
      } catch (error) {
        console.error('Error loading communities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCommunities();
  }, []);

  // Animation variants
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
        duration: 0.6,
        ease: [0.25, 0.46, 0.45, 0.94]
      }
    }
  };

  return (
    <div>
      {/* Hero Header Section */}
      <section
        className="hero-section"
        style={{
          backgroundColor: 'var(--primary-color)',
          position: 'relative',
          padding: '120px 0 80px',
          overflow: 'hidden'
        }}
      >
        {/* Background Elements */}
        <div style={{
          position: 'absolute',
          top: '-100px',
          right: '-100px',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          zIndex: 1
        }} />
        
        <div style={{
          position: 'absolute',
          bottom: '-150px',
          left: '-150px',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          zIndex: 1
        }} />

        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}
          >
            <div style={{
              display: 'inline-block',
              padding: '8px 16px',
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '30px',
              fontSize: '14px',
              fontWeight: '600',
              color: 'white',
              marginBottom: '24px'
            }}>
              EXPLORE HOUSTON COMMUNITIES
            </div>
            
            <h1 style={{
              fontSize: '48px',
              fontWeight: '800',
              color: 'white',
              marginBottom: '24px',
              lineHeight: '1.2'
            }}>
              Find Your Perfect Houston Community
            </h1>
            
            <p style={{
              fontSize: '18px',
              lineHeight: '1.6',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '40px'
            }}>
              Discover master-planned communities with world-class amenities, top-rated schools, 
              and beautiful homes designed for modern living.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Communities Grid Section */}
      <section className="section" style={{ padding: '80px 0', background: 'white' }}>
        <div className="container">
          <div className="section-header" style={{ marginBottom: '48px' }}>
            <h2 className="section-title">All Communities</h2>
            <p className="section-subtitle">
              Explore our curated selection of premier Houston communities
            </p>
          </div>

          {loading ? (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'center', 
              alignItems: 'center', 
              minHeight: '300px' 
            }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                border: '4px solid rgba(0, 122, 255, 0.1)', 
                borderLeftColor: 'var(--primary-color)', 
                borderRadius: '50%', 
                animation: 'spin 1s linear infinite' 
              }} />
            </div>
          ) : (
            <motion.div 
              className="communities-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                gap: '32px'
              }}
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {communities.map((community) => (
                <motion.div key={community.id} variants={itemVariants}>
                  <CommunityCard community={community} />
                </motion.div>
              ))}
            </motion.div>
          )}

          {!loading && communities.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              padding: '60px 0',
              backgroundColor: 'var(--background-secondary)',
              borderRadius: '16px'
            }}>
              <h3 style={{ marginBottom: '16px', color: 'var(--text-primary)' }}>
                No communities available yet
              </h3>
              <p style={{ marginBottom: '24px', color: 'var(--text-secondary)' }}>
                Check back soon for new community listings
              </p>
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
      style={{
        borderRadius: '20px',
        overflow: 'hidden',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      whileHover={{ 
        scale: 1.03,
        boxShadow: 'var(--shadow-card-hover)',
        transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
      }}
      whileTap={{ scale: 0.97 }}
    >
      <Link to={`/community/${community.id}`} style={{ textDecoration: 'none', height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Community Image */}
        <div style={{ width: '100%', height: '220px', overflow: 'hidden', flexShrink: 0 }}>
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
        <div className="card-content" style={{ padding: '24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ fontSize: '20px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '8px' }}>
              {community.name}
            </h3>
            <p style={{ fontSize: '16px', color: 'var(--text-secondary)', fontWeight: '500' }}>
              {community.location}
            </p>
          </div>
          
          <p style={{ 
            fontSize: '15px', 
            color: 'var(--text-secondary)', 
            lineHeight: '1.5',
            marginBottom: '16px',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            flex: 1
          }}>
            {community.description.length > 120 
              ? `${community.description.substring(0, 120)}...` 
              : community.description}
          </p>
          
          <div style={{ 
            marginTop: 'auto', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            paddingTop: '16px',
            borderTop: '1px solid var(--separator)'
          }}>
            <span style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: 'var(--text-secondary)'
            }}>
              {community.priceRange}
            </span>
            <span style={{ 
              fontSize: '14px', 
              fontWeight: '600', 
              color: 'var(--primary-color)',
              display: 'flex',
              alignItems: 'center'
            }}>
              View Details
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginLeft: '4px' }}>
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default CommunitiesPage; 