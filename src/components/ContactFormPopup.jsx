import React, { useState } from 'react';
import { DataService } from '../services/apiService';
import { UIUtils } from '../services/utils';

const ContactFormPopup = ({ isOpen, onClose, communityName, communityTheme }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    interest: communityName || 'General Inquiry'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      await DataService.createPublicContact(formData);
      setSubmitStatus({
        type: 'success',
        message: `Thank you for your interest in ${communityName}! We'll be in touch soon.`
      });
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        interest: communityName || 'General Inquiry'
      });
      
      // Close the popup after 3 seconds on success
      setTimeout(() => {
        onClose();
        setSubmitStatus(null);
      }, 3000);
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: 'There was an error submitting your request. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const primaryColor = communityTheme?.primaryColor || '#007AFF';
  const borderRadius = communityTheme?.borderRadius || '16px';

  return (
    <div 
      className="popup-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        padding: '20px'
      }}
      onClick={onClose}
    >
      <div 
        className="popup-content"
        style={{
          backgroundColor: 'white',
          borderRadius,
          width: '100%',
          maxWidth: '500px',
          maxHeight: '90vh',
          overflowY: 'auto',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
          position: 'relative'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          className="close-button"
          style={{
            position: 'absolute',
            top: '15px',
            right: '15px',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            color: '#666',
            zIndex: 10
          }}
          onClick={onClose}
        >
          &times;
        </button>

        <div
          className="popup-header"
          style={{
            background: `linear-gradient(135deg, ${primaryColor} 0%, ${UIUtils.darkenColor(primaryColor, 0.15)} 100%)`,
            padding: '30px',
            borderTopLeftRadius: borderRadius,
            borderTopRightRadius: borderRadius,
            color: 'white',
            textAlign: 'center'
          }}
        >
          <h2 style={{ margin: '0 0 10px 0', fontSize: '1.8rem' }}>
            Request Information
          </h2>
          <p style={{ margin: '0', fontSize: '1.1rem', opacity: 0.9 }}>
            Interested in {communityName}? We're here to help!
          </p>
        </div>

        <div
          className="popup-body"
          style={{ padding: '30px' }}
        >
          {submitStatus && (
            <div 
              className={`status-message ${submitStatus.type}`}
              style={{
                padding: '15px',
                marginBottom: '20px',
                borderRadius: '8px',
                textAlign: 'center',
                backgroundColor: submitStatus.type === 'success' ? '#d4edda' : '#f8d7da',
                color: submitStatus.type === 'success' ? '#155724' : '#721c24'
              }}
            >
              {submitStatus.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="name"
                style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Full Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: errors.name ? '1px solid #dc3545' : '1px solid #ced4da',
                  fontSize: '16px'
                }}
                placeholder="Your name"
              />
              {errors.name && (
                <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', marginBottom: 0 }}>
                  {errors.name}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="email"
                style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Email Address*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: errors.email ? '1px solid #dc3545' : '1px solid #ced4da',
                  fontSize: '16px'
                }}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', marginBottom: 0 }}>
                  {errors.email}
                </p>
              )}
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="phone"
                style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ced4da',
                  fontSize: '16px'
                }}
                placeholder="(123) 456-7890"
              />
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label 
                htmlFor="message"
                style={{ 
                  display: 'block', 
                  marginBottom: '6px', 
                  fontWeight: '600',
                  fontSize: '14px'
                }}
              >
                Message*
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '12px',
                  borderRadius: '8px',
                  border: errors.message ? '1px solid #dc3545' : '1px solid #ced4da',
                  fontSize: '16px',
                  minHeight: '120px',
                  resize: 'vertical'
                }}
                placeholder={`I'm interested in learning more about ${communityName}...`}
              />
              {errors.message && (
                <p style={{ color: '#dc3545', fontSize: '14px', marginTop: '5px', marginBottom: 0 }}>
                  {errors.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: primaryColor,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Request'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactFormPopup; 