import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const Navigation = () => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <nav 
      className="nav"
      style={{
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 122, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: '16px 0',
        borderBottom: scrolled ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
        boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.08)' : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      <div 
        className="nav-content"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          maxWidth: '1400px',
          margin: '0 auto',
          paddingLeft: '5%',
          paddingRight: '5%'
        }}
      >
        <Link 
          to="/" 
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none'
          }}
        >
          <div 
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              backgroundColor: '#007AFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10px',
              boxShadow: '0 2px 10px rgba(0, 122, 255, 0.2)'
            }}
          >
            <i 
              className="fas fa-home" 
              style={{ 
                color: 'white', 
                fontSize: '20px' 
              }}
            />
          </div>
          <div>
            <div 
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: scrolled ? '#1D1D1F' : 'white',
                lineHeight: '1.2',
                transition: 'color 0.3s ease'
              }}
            >
              myhoustonhome
            </div>
            <div 
              style={{
                fontSize: '12px',
                color: scrolled ? '#86868B' : 'rgba(255, 255, 255, 0.8)',
                lineHeight: '1.2',
                transition: 'color 0.3s ease'
              }}
            >
              Rivera Real Estate Group
            </div>
          </div>
        </Link>
        
        <div 
          className="nav-menu"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '28px'
          }}
        >
          <Link 
            to="/communities" 
            className={`nav-link ${location.pathname === '/communities' ? 'active' : ''}`}
            style={{
              color: scrolled ? '#1D1D1F' : 'white',
              fontWeight: '500',
              fontSize: '14px',
              textDecoration: 'none',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              backgroundColor: location.pathname === '/communities' ? 
                (scrolled ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.2)') : 
                'transparent'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = scrolled ? 
                'rgba(0, 0, 0, 0.05)' : 
                'rgba(255, 255, 255, 0.2)';
            }}
            onMouseOut={(e) => {
              if (location.pathname !== '/communities') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            Communities
          </Link>
          <Link 
            to="/contact" 
            className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
            style={{
              color: scrolled ? '#1D1D1F' : 'white',
              fontWeight: '500',
              fontSize: '14px',
              textDecoration: 'none',
              padding: '8px 12px',
              borderRadius: '8px',
              transition: 'all 0.3s ease',
              backgroundColor: location.pathname === '/contact' ? 
                (scrolled ? 'rgba(0, 0, 0, 0.05)' : 'rgba(255, 255, 255, 0.2)') : 
                'transparent'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = scrolled ? 
                'rgba(0, 0, 0, 0.05)' : 
                'rgba(255, 255, 255, 0.2)';
            }}
            onMouseOut={(e) => {
              if (location.pathname !== '/contact') {
                e.currentTarget.style.backgroundColor = 'transparent';
              }
            }}
          >
            Contact
          </Link>
          <button
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = scrolled ? 
                'rgba(0, 0, 0, 0.05)' : 
                'rgba(255, 255, 255, 0.2)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <i 
              className="fas fa-search" 
              style={{ 
                color: scrolled ? '#1D1D1F' : 'white', 
                fontSize: '16px',
                transition: 'color 0.3s ease'
              }}
            />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 