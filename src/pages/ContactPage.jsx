import React, { useState } from 'react';
import { motion } from 'framer-motion';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    interest: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: '',
          interest: 'general'
        });
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: '#FFFFFF',
      minHeight: '100vh'
    }}>
      {/* Hero Section */}
      <section style={{
        backgroundColor: '#007AFF',
        color: 'white',
        padding: '80px 0',
        paddingTop: '120px', // Increased padding to account for fixed header
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Elements */}
        <div style={{
          position: 'absolute',
          top: '-10%',
          right: '-5%',
          width: '400px',
          height: '400px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.1)',
          zIndex: 1
        }}/>
        <div style={{
          position: 'absolute',
          bottom: '-20%',
          left: '10%',
          width: '300px',
          height: '300px',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.05)',
          zIndex: 1
        }}/>
        
        <div className="container" style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 5%',
          position: 'relative',
          zIndex: 2
        }}>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              textAlign: 'center'
            }}
          >
            <h1 style={{
              fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
              fontWeight: '700',
              marginBottom: '24px',
              lineHeight: '1.2'
            }}>
              Get in Touch With Our Experts
            </h1>
            <p style={{
              fontSize: '18px',
              lineHeight: '1.6',
              opacity: '0.9',
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              We're here to help you find your perfect Houston home. Reach out with any questions about communities, properties, or the buying process.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section style={{
        padding: '80px 0',
        backgroundColor: '#FFFFFF'
      }}>
        <div className="container" style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 5%'
        }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '60px',
            alignItems: 'flex-start'
          }}>
            {/* Contact Information */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div style={{
                marginBottom: '40px'
              }}>
                <h2 style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  marginBottom: '24px',
                  color: '#1D1D1F'
                }}>
                  Contact Information
                </h2>
                <p style={{
                  fontSize: '16px',
                  lineHeight: '1.6',
                  color: '#4B4B4B',
                  marginBottom: '32px'
                }}>
                  Our team of Houston real estate experts is ready to assist you with all your questions and needs.
                </p>
              </div>
              
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '24px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 122, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#007AFF',
                    flexShrink: 0
                  }}>
                    <i className="fas fa-map-marker-alt"></i>
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: '#1D1D1F'
                    }}>
                      Office Location
                    </h3>
                    <p style={{
                      fontSize: '16px',
                      lineHeight: '1.6',
                      color: '#4B4B4B'
                    }}>
                      1220 Augusta Dr, Suite 300<br />
                      Houston, TX 77057
                    </p>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 122, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#007AFF',
                    flexShrink: 0
                  }}>
                    <i className="fas fa-phone-alt"></i>
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: '#1D1D1F'
                    }}>
                      Phone
                    </h3>
                    <p style={{
                      fontSize: '16px',
                      lineHeight: '1.6',
                      color: '#4B4B4B'
                    }}>
                      (832) 598-6825
                    </p>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 122, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#007AFF',
                    flexShrink: 0
                  }}>
                    <i className="fas fa-envelope"></i>
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: '#1D1D1F'
                    }}>
                      Email
                    </h3>
                    <p style={{
                      fontSize: '16px',
                      lineHeight: '1.6',
                      color: '#4B4B4B'
                    }}>
                      norbert.rivera@kw.com
                    </p>
                  </div>
                </div>
                
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '16px'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(0, 122, 255, 0.1)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#007AFF',
                    flexShrink: 0
                  }}>
                    <i className="fas fa-user"></i>
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      marginBottom: '8px',
                      color: '#1D1D1F'
                    }}>
                      Contact Person
                    </h3>
                    <p style={{
                      fontSize: '16px',
                      lineHeight: '1.6',
                      color: '#4B4B4B'
                    }}>
                      Norbert Rivera<br />
                      Director, REALTOR ®
                    </p>
                  </div>
                </div>
              </div>
              
              <div style={{
                marginTop: '40px'
              }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  marginBottom: '16px',
                  color: '#1D1D1F'
                }}>
                  Follow Us
                </h3>
                <div style={{
                  display: 'flex',
                  gap: '16px'
                }}>
                  {[
                    { platform: 'instagram', url: 'https://www.instagram.com/riverarealestategrp/' },
                    { platform: 'facebook', url: 'https://www.facebook.com/riverarealestategrp/' },
                    { platform: 'linkedin', url: 'https://www.linkedin.com/company/riverarealestategrp/' },
                    { platform: 'youtube', url: 'https://www.youtube.com/@riverarealestategrp' },
                    { platform: 'tiktok', url: 'https://www.tiktok.com/@riverarealestategrp' }
                  ].map(social => (
                    <a 
                      key={social.platform} 
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(0, 122, 255, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#007AFF',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = '#007AFF';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseOut={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 122, 255, 0.1)';
                        e.currentTarget.style.color = '#007AFF';
                      }}
                    >
                      <i className={`fab fa-${social.platform}`}></i>
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.08)',
                padding: '40px',
                border: '1px solid #F0F0F0'
              }}
            >
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                marginBottom: '24px',
                color: '#1D1D1F'
              }}>
                Send Us a Message
              </h2>
              
              {submitStatus === 'success' && (
                <div style={{
                  padding: '16px',
                  backgroundColor: 'rgba(40, 205, 65, 0.1)',
                  borderRadius: '8px',
                  color: '#28CD41',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <i className="fas fa-check-circle"></i>
                  <p style={{ margin: 0 }}>Thank you for your message! We'll get back to you soon.</p>
                </div>
              )}
              
              {submitStatus === 'error' && (
                <div style={{
                  padding: '16px',
                  backgroundColor: 'rgba(255, 59, 48, 0.1)',
                  borderRadius: '8px',
                  color: '#FF3B30',
                  marginBottom: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <i className="fas fa-exclamation-circle"></i>
                  <p style={{ margin: 0 }}>There was an error sending your message. Please try again.</p>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  <div>
                    <label 
                      htmlFor="name"
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#1D1D1F'
                      }}
                    >
                      Full Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '16px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        backgroundColor: '#FFFFFF',
                        transition: 'border-color 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#007AFF'}
                      onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                    />
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="email"
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#1D1D1F'
                      }}
                    >
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '16px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        backgroundColor: '#FFFFFF',
                        transition: 'border-color 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#007AFF'}
                      onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                    />
                  </div>
                </div>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  gap: '20px',
                  marginBottom: '20px'
                }}>
                  <div>
                    <label 
                      htmlFor="phone"
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#1D1D1F'
                      }}
                    >
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '16px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        backgroundColor: '#FFFFFF',
                        transition: 'border-color 0.2s ease',
                        outline: 'none'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#007AFF'}
                      onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                    />
                  </div>
                  
                  <div>
                    <label 
                      htmlFor="interest"
                      style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '14px',
                        fontWeight: '500',
                        color: '#1D1D1F'
                      }}
                    >
                      I'm interested in *
                    </label>
                    <select
                      id="interest"
                      name="interest"
                      value={formData.interest}
                      onChange={handleInputChange}
                      required
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        fontSize: '16px',
                        border: '1px solid #E5E7EB',
                        borderRadius: '8px',
                        backgroundColor: '#FFFFFF',
                        transition: 'border-color 0.2s ease',
                        outline: 'none',
                        appearance: 'none',
                        backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23777%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E")',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'right 12px center',
                        backgroundSize: '16px'
                      }}
                      onFocus={(e) => e.target.style.borderColor = '#007AFF'}
                      onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                    >
                      <option value="general">General Information</option>
                      <option value="buying">Buying a Home</option>
                      <option value="community">Specific Community</option>
                      <option value="investment">Investment Opportunities</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <label 
                    htmlFor="message"
                    style={{
                      display: 'block',
                      marginBottom: '8px',
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1D1D1F'
                    }}
                  >
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows="5"
                    placeholder="Tell us about your needs, questions, or how we can help you..."
                    required
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '16px',
                      border: '1px solid #E5E7EB',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      transition: 'border-color 0.2s ease',
                      outline: 'none',
                      resize: 'vertical',
                      minHeight: '120px',
                      fontFamily: 'inherit'
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#007AFF'}
                    onBlur={(e) => e.target.style.borderColor = '#E5E7EB'}
                  ></textarea>
                </div>
                
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '14px 28px',
                    backgroundColor: '#007AFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    gap: '8px',
                    boxShadow: '0 2px 10px rgba(0, 122, 255, 0.2)',
                    opacity: isSubmitting ? 0.7 : 1
                  }}
                  onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#0056CC')}
                  onMouseOut={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = '#007AFF')}
                >
                  {isSubmitting ? (
                    <>
                      <span style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid rgba(255,255,255,0.3)',
                        borderTopColor: 'white',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }}></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <i className="fas fa-paper-plane"></i>
                    </>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Legal Links Section */}
      <section style={{
        padding: '40px 0',
        backgroundColor: '#F8F9FA',
        borderTop: '1px solid #E5E7EB'
      }}>
        <div className="container" style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 5%',
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '24px',
            marginBottom: '16px'
          }}>
            <a 
              href="#" 
              style={{
                color: '#4B4B4B',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#007AFF'}
              onMouseOut={(e) => e.currentTarget.style.color = '#4B4B4B'}
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              style={{
                color: '#4B4B4B',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#007AFF'}
              onMouseOut={(e) => e.currentTarget.style.color = '#4B4B4B'}
            >
              Information About Brokerage Services
            </a>
            <a 
              href="#" 
              style={{
                color: '#4B4B4B',
                fontSize: '14px',
                textDecoration: 'none',
                transition: 'color 0.2s ease'
              }}
              onMouseOver={(e) => e.currentTarget.style.color = '#007AFF'}
              onMouseOut={(e) => e.currentTarget.style.color = '#4B4B4B'}
            >
              Consumer Protection Notice
            </a>
          </div>
          <p style={{
            fontSize: '14px',
            color: '#86868B',
            margin: '0'
          }}>
            &copy; {new Date().getFullYear()} Rivera Real Estate Group. All rights reserved.
          </p>
        </div>
      </section>
      
      {/* Add CSS for the spinner animation */}
      <style jsx="true">{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ContactPage; 