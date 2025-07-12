import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DataService, UIUtils, NotificationService } from '../services/dataService';

const ListingPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [community, setCommunity] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);
  const [showPhoneNumber, setShowPhoneNumber] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadListing = async () => {
      setLoading(true);
      try {
        const foundListing = await DataService.getListing(id);
        if (foundListing) {
          setListing(foundListing);
          if (foundListing.communityId) {
            const foundCommunity = await DataService.getCommunity(foundListing.communityId);
            setCommunity(foundCommunity);
            
            // Apply community theming if available
            if (foundCommunity) {
              const root = document.documentElement;
              root.style.setProperty('--primary-color', foundCommunity.theme.primaryColor);
              root.style.setProperty('--primary-dark', UIUtils.darkenColor(foundCommunity.theme.primaryColor, 0.2));
            }
          }
        }
      } catch (error) {
        console.error('Error loading listing:', error);
      } finally {
        setLoading(false);
      }
    };

    loadListing();
    
    // Cleanup function
    return () => {
      const root = document.documentElement;
      root.style.setProperty('--primary-color', '#007AFF');
      root.style.setProperty('--primary-dark', '#0056CC');
    };
  }, [id]);

  if (loading) {
    return (
      <div className="container section">
        <div className="text-center space-y-4">
          <div className="animate-fade-in">
            <div className="text-title-1">Loading...</div>
            <p className="text-body text-secondary">Please wait while we load the property details.</p>
          </div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="container section">
        <div className="text-center space-y-4">
          <h1 className="text-title-1">Property Not Found</h1>
          <p className="text-body text-secondary">
            The property you're looking for doesn't exist or has been removed.
          </p>
          <Link to="/" className="btn btn-primary">
            Browse All Properties
          </Link>
        </div>
      </div>
    );
  }

  const handleContactSubmit = async (contactData) => {
    try {
      await DataService.saveContact({
        ...contactData,
        listingId: listing.id,
        listingTitle: listing.title,
        submittedAt: new Date().toISOString()
      });
      
      NotificationService.show('Your message has been sent successfully!', 'success');
      setShowContactForm(false);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      NotificationService.show('Failed to send message. Please try again.', 'error');
    }
  };

  // Default images if none provided
  const defaultImages = [
    'https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1448630360428-65456885c650?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80'
  ];

  const images = listing.images && listing.images.length > 0 ? listing.images : defaultImages;

  return (
    <div className="listing-page">
      {/* Property Images Section */}
      <motion.section 
        className="property-images-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="property-images-container">
          <div className="main-image-container">
            <img 
              src={images[selectedImageIndex]} 
              alt={listing.title}
              className="main-property-image"
              onClick={() => setShowImageModal(true)}
            />
            <button className="view-all-photos-btn" onClick={() => setShowImageModal(true)}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21,15 16,10 5,21"></polyline>
              </svg>
              View All {images.length} Photos
            </button>
          </div>
          
          {images.length > 1 && (
            <div className="thumbnail-grid">
              {images.slice(1, 5).map((image, index) => (
                <div 
                  key={index + 1}
                  className={`thumbnail ${selectedImageIndex === index + 1 ? 'active' : ''}`}
                  onClick={() => setSelectedImageIndex(index + 1)}
                >
                  <img src={image} alt={`Property ${index + 2}`} />
                  {index === 3 && images.length > 5 && (
                    <div className="thumbnail-overlay">
                      +{images.length - 4} more
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* Property Details Section */}
      <section className="property-details-section">
        <div className="container">
          <div className="property-details-grid">
            {/* Main Content */}
            <div className="main-content">
              {/* Property Header */}
              <motion.div 
                className="property-header"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <div className="property-price">
                  {UIUtils.formatPrice(listing.price)}
                </div>
                <h1 className="property-title">{listing.title}</h1>
                <div className="property-address">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  {listing.address}
                </div>

                {/* Quick Stats */}
                <div className="quick-stats">
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
                  {listing.lotSize && (
                    <div className="stat">
                      <span className="stat-value">{UIUtils.formatLotSize(listing.lotSize)}</span>
                      <span className="stat-label">lot size</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Property Description */}
              <motion.div 
                className="property-description"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <h2 className="section-title">About This Property</h2>
                <p className="description-text">
                  {listing.description || 'No description available for this property.'}
                </p>
              </motion.div>

              {/* Property Features */}
              {(listing.features?.length > 0 || listing.appliances?.length > 0) && (
                <motion.div 
                  className="property-features"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h2 className="section-title">Features & Amenities</h2>
                  <div className="features-grid">
                    {listing.features?.map((feature, index) => (
                      <div key={index} className="feature-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                        {feature}
                      </div>
                    ))}
                    {listing.appliances?.map((appliance, index) => (
                      <div key={index} className="feature-item">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <polyline points="20,6 9,17 4,12"></polyline>
                        </svg>
                        {appliance}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Property Details Grid */}
              <motion.div 
                className="property-details-info"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <h2 className="section-title">Property Details</h2>
                <div className="details-grid">
                  <div className="detail-item">
                    <span className="detail-label">Property Type</span>
                    <span className="detail-value">{UIUtils.capitalizeFirst(listing.type)}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Status</span>
                    <span className="detail-value">{UIUtils.capitalizeFirst(listing.status)}</span>
                  </div>
                  {listing.yearBuilt && (
                    <div className="detail-item">
                      <span className="detail-label">Year Built</span>
                      <span className="detail-value">{listing.yearBuilt}</span>
                    </div>
                  )}
                  {listing.parking && (
                    <div className="detail-item">
                      <span className="detail-label">Parking</span>
                      <span className="detail-value">{listing.parking}</span>
                    </div>
                  )}
                  {listing.cooling && (
                    <div className="detail-item">
                      <span className="detail-label">Cooling</span>
                      <span className="detail-value">{listing.cooling}</span>
                    </div>
                  )}
                  {listing.heating && (
                    <div className="detail-item">
                      <span className="detail-label">Heating</span>
                      <span className="detail-value">{listing.heating}</span>
                    </div>
                  )}
                  {listing.flooring?.length > 0 && (
                    <div className="detail-item">
                      <span className="detail-label">Flooring</span>
                      <span className="detail-value">{listing.flooring.join(', ')}</span>
                    </div>
                  )}
                  {listing.laundry && (
                    <div className="detail-item">
                      <span className="detail-label">Laundry</span>
                      <span className="detail-value">{listing.laundry}</span>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Community Section */}
              {community && (
                <motion.div 
                  className="community-section"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <h2 className="section-title">Community</h2>
                  <Link to={`/community/${community.id}`} className="community-card">
                    <div className="community-info">
                      <h3 className="community-name">{community.name}</h3>
                      <p className="community-location">{community.location}</p>
                      <p className="community-description">{community.description}</p>
                      {community.amenities?.length > 0 && (
                        <div className="community-amenities">
                          <span className="amenities-label">Amenities:</span>
                          <span className="amenities-count">{community.amenities.length} available</span>
                        </div>
                      )}
                    </div>
                    <div className="community-arrow">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="9,18 15,12 9,6"></polyline>
                      </svg>
                    </div>
                  </Link>
                </motion.div>
              )}
            </div>

            {/* Sidebar */}
            <div className="sidebar">
              <motion.div 
                className="contact-card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                {listing.agentInfo?.name && (
                  <div className="agent-info">
                    {listing.agentInfo.photo && (
                      <img src={listing.agentInfo.photo} alt={listing.agentInfo.name} className="agent-photo" />
                    )}
                    <div className="agent-details">
                      <h3 className="agent-name">{listing.agentInfo.name}</h3>
                      <p className="agent-title">Real Estate Agent</p>
                    </div>
                  </div>
                )}

                <div className="contact-actions">
                  <button 
                    onClick={() => setShowContactForm(true)}
                    className="btn btn-primary btn-full"
                  >
                    Request Information
                  </button>
                  
                  {listing.agentInfo?.phone && (
                    <button 
                      onClick={() => setShowPhoneNumber(!showPhoneNumber)}
                      className="btn btn-secondary btn-full"
                    >
                      {showPhoneNumber ? listing.agentInfo.phone : 'Show Phone Number'}
                    </button>
                  )}
                  
                  <button className="btn btn-ghost btn-full">
                    Schedule Tour
                  </button>
                </div>

                {listing.agentInfo?.bio && (
                  <div className="agent-bio">
                    <p>{listing.agentInfo.bio}</p>
                  </div>
                )}
              </motion.div>

              {/* Price History */}
              {listing.priceHistory?.length > 0 && (
                <motion.div 
                  className="price-history-card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  <h3 className="card-title">Price History</h3>
                  <div className="price-history-list">
                    {listing.priceHistory.map((entry, index) => (
                      <div key={index} className="price-history-item">
                        <div className="price-date">{UIUtils.formatDate(entry.date)}</div>
                        <div className="price-amount">{UIUtils.formatPrice(entry.price)}</div>
                        <div className="price-event">{entry.event}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Market Stats */}
              {listing.marketStats?.avgPricePerSqft && (
                <motion.div 
                  className="market-stats-card"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <h3 className="card-title">Market Insights</h3>
                  <div className="stats-grid">
                    <div className="stat-item">
                      <div className="stat-label">Price per sq ft</div>
                      <div className="stat-value">
                        ${(listing.price / listing.sqft).toFixed(0)}
                      </div>
                    </div>
                    {listing.marketStats.avgPricePerSqft && (
                      <div className="stat-item">
                        <div className="stat-label">Neighborhood avg</div>
                        <div className="stat-value">
                          ${listing.marketStats.avgPricePerSqft}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactFormModal 
          listing={listing}
          onClose={() => setShowContactForm(false)}
          onSubmit={handleContactSubmit}
        />
      )}

      {/* Image Modal */}
      {showImageModal && (
        <ImageModal 
          images={images}
          currentIndex={selectedImageIndex}
          onClose={() => setShowImageModal(false)}
          onImageChange={setSelectedImageIndex}
        />
      )}
    </div>
  );
};

const ContactFormModal = ({ listing, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I'm interested in ${listing.title} at ${listing.address}. Please contact me with more information.`,
    preferredContact: 'email'
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div 
      className="modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="modal-content contact-modal"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-header">
          <h3 className="modal-title">Request Information</h3>
          <button 
            onClick={onClose}
            className="modal-close"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="contact-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Preferred Contact Method</label>
              <select
                name="preferredContact"
                value={formData.preferredContact}
                onChange={handleChange}
                className="form-input"
              >
                <option value="email">Email</option>
                <option value="phone">Phone</option>
                <option value="text">Text Message</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Message *</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="form-textarea"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="form-actions">
            <button type="submit" className="btn btn-primary btn-full">
              Send Message
            </button>
            <button type="button" onClick={onClose} className="btn btn-ghost btn-full">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

const ImageModal = ({ images, currentIndex, onClose, onImageChange }) => {
  const nextImage = () => {
    onImageChange((currentIndex + 1) % images.length);
  };

  const prevImage = () => {
    onImageChange(currentIndex === 0 ? images.length - 1 : currentIndex - 1);
  };

  return (
    <motion.div 
      className="modal-overlay image-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="image-modal-content" onClick={(e) => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="image-modal-close"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        
        <button 
          onClick={prevImage}
          className="image-nav-button prev"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>
        
        <img 
          src={images[currentIndex]} 
          alt={`Property ${currentIndex + 1}`}
          className="modal-image"
        />
        
        <button 
          onClick={nextImage}
          className="image-nav-button next"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,18 15,12 9,6"></polyline>
          </svg>
        </button>
        
        <div className="image-counter">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </motion.div>
  );
};

export default ListingPage; 