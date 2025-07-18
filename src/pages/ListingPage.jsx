import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
// eslint-disable-next-line no-unused-vars
import { motion } from 'framer-motion';
import { DataService } from '../services/apiService';
import { UIUtils, NotificationService } from '../services/utils';

const ListingPage = () => {
  const { id } = useParams();
  const [listing, setListing] = useState(null);
  const [community, setCommunity] = useState(null);
  const [showContactForm, setShowContactForm] = useState(false);

  useEffect(() => {
    const loadListingData = async () => {
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
        console.error('Error loading listing data:', error);
      }
    };

    loadListingData();
    
    // Cleanup function
    return () => {
      const root = document.documentElement;
      root.style.setProperty('--primary-color', '#007AFF');
      root.style.setProperty('--primary-dark', '#0056CC');
    };
  }, [id]);

  if (!listing) {
    return (
      <div className="container section">
        <div className="text-center space-y-4">
          <h1 className="text-title-1">Listing Not Found</h1>
          <p className="text-body text-secondary">
            The listing you're looking for doesn't exist.
          </p>
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="listing-page">
      {/* Hero Section */}
      <motion.section 
        className="hero"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.4, 0, 0.2, 1] }}
        style={{ 
          background: community 
            ? `linear-gradient(135deg, ${community.theme.primaryColor}05 0%, ${community.theme.primaryColor}02 100%)`
            : 'linear-gradient(135deg, rgba(0, 122, 255, 0.05) 0%, rgba(0, 122, 255, 0.02) 100%)'
        }}
      >
        <div className="container">
          <h1 className="hero-title">{listing.title}</h1>
          <p className="hero-subtitle">{listing.address}</p>
          <div className="hero-actions">
            <button 
              onClick={() => setShowContactForm(true)}
              className="btn btn-primary"
            >
              Contact Agent
            </button>
            <button className="btn btn-secondary">
              Schedule Tour
            </button>
          </div>
        </div>
      </motion.section>

      {/* Listing Details */}
      <section className="section">
        <div className="container">
          <motion.div 
            className="grid grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Main Details */}
            <div className="space-y-6">
              <div>
                <h2 className="text-title-1 font-bold mb-4">Property Details</h2>
                <div className="space-y-4">
                  <div className="text-title-2 font-bold" style={{ color: community?.theme.primaryColor || 'var(--primary-color)' }}>
                    {UIUtils.formatPrice(listing.price)}
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-secondary rounded-xl p-4 text-center">
                      <div className="text-title-3 font-bold text-primary">{listing.bedrooms}</div>
                      <div className="text-footnote text-secondary">Bedrooms</div>
                    </div>
                    <div className="bg-secondary rounded-xl p-4 text-center">
                      <div className="text-title-3 font-bold text-primary">{listing.bathrooms}</div>
                      <div className="text-footnote text-secondary">Bathrooms</div>
                    </div>
                    <div className="bg-secondary rounded-xl p-4 text-center">
                      <div className="text-title-3 font-bold text-primary">{listing.sqft.toLocaleString()}</div>
                      <div className="text-footnote text-secondary">Sq Ft</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <span className="text-subheadline font-medium text-secondary">Type:</span>
                      <span className="text-body ml-2">{UIUtils.capitalizeFirst(listing.type)}</span>
                    </div>
                    <div>
                      <span className="text-subheadline font-medium text-secondary">Status:</span>
                      <span className="text-body ml-2">{UIUtils.capitalizeFirst(listing.status)}</span>
                    </div>
                    <div>
                      <span className="text-subheadline font-medium text-secondary">Listed:</span>
                      <span className="text-body ml-2">{UIUtils.formatDate(listing.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Community Link */}
              {community && (
                <div>
                  <h3 className="text-title-3 font-semibold mb-3">Community</h3>
                  <Link 
                    to={`/community/${community.id}`}
                    className="card block"
                    style={{ borderRadius: community.theme.borderRadiusLarge }}
                  >
                    <div className="card-content">
                      <div className="space-y-2">
                        <h4 className="text-headline font-semibold" style={{ color: community.theme.primaryColor }}>
                          {community.name}
                        </h4>
                        <p className="text-footnote text-secondary">
                          {community.location}
                        </p>
                        <p className="text-footnote text-tertiary">
                          {community.amenities.length} amenities available
                        </p>
                      </div>
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-6">
              <div>
                <h2 className="text-title-1 font-bold mb-4">Description</h2>
                <p className="text-body text-secondary leading-relaxed">
                  {listing.description || 'No description available for this property.'}
                </p>
              </div>

              {/* Quick Contact */}
              <div className="bg-secondary rounded-xl p-6">
                <h3 className="text-title-3 font-semibold mb-4">Interested in this property?</h3>
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowContactForm(true)}
                    className="btn btn-primary w-full"
                  >
                    Request Information
                  </button>
                  <button className="btn btn-secondary w-full">
                    Schedule Viewing
                  </button>
                  <button className="btn btn-ghost w-full">
                    Save to Favorites
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Modal */}
      {showContactForm && (
        <ContactFormModal 
          listing={listing}
          onClose={() => setShowContactForm(false)}
        />
      )}
    </div>
  );
};

const ContactFormModal = ({ listing, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: `I'm interested in ${listing.title} at ${listing.address}. Please contact me with more information.`
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const contact = {
        ...formData,
        listingId: listing.id,
        listingTitle: listing.title,
        submittedAt: new Date().toISOString()
      };

      await DataService.saveContact(contact);
      NotificationService.show('Contact form submitted successfully!', 'success');
      onClose();
    } catch (error) {
      console.error('Error submitting contact form:', error);
      NotificationService.show('Error submitting contact form', 'error');
    }
  };

  return (
    <motion.div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="bg-surface rounded-2xl p-6 max-w-md w-full"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-title-3 font-semibold">Contact Agent</h3>
          <button 
            onClick={onClose}
            className="text-secondary hover:text-primary"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="form-group">
            <label className="form-label">Name</label>
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
            <label className="form-label">Email</label>
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
            <label className="form-label">Phone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Message</label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="form-textarea"
              rows="4"
              required
            ></textarea>
          </div>

          <div className="flex gap-3">
            <button type="submit" className="btn btn-primary flex-1">
              Send Message
            </button>
            <button type="button" onClick={onClose} className="btn btn-secondary">
              Cancel
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default ListingPage; 