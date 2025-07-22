import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

const CommunityNavigation = ({ community }) => {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const theme = community?.theme || { primaryColor: '#007AFF' };

  useEffect(() => {
    const handleScroll = () => {
      const offset = window.scrollY;
      if (offset > 100) {
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

  // Generate a darker shade for hover effects
  const darkenColor = (color, amount) => {
    const darkenHex = (hex, percent) => {
      // Remove the # if present
      hex = hex.replace('#', '');
      
      // Parse the hex values to RGB
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      
      // Darken each component
      const darkenedR = Math.max(0, Math.floor(r * (1 - percent)));
      const darkenedG = Math.max(0, Math.floor(g * (1 - percent)));
      const darkenedB = Math.max(0, Math.floor(b * (1 - percent)));
      
      // Convert back to hex
      return `#${darkenedR.toString(16).padStart(2, '0')}${darkenedG.toString(16).padStart(2, '0')}${darkenedB.toString(16).padStart(2, '0')}`;
    };
    
    return darkenHex(color, amount);
  };

  const darkerShade = darkenColor(theme.primaryColor, 0.2);

  return (
    <nav 
      className="nav"
      style={{
        backgroundColor: scrolled ? 'rgba(255, 255, 255, 0.8)' : 'transparent',
        backdropFilter: scrolled ? 'blur(10px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(10px)' : 'none',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? '12px 0' : '16px 0',
        borderBottom: scrolled ? '1px solid rgba(0, 0, 0, 0.05)' : 'none',
        boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.08)' : 'none',
        transition: 'all 0.3s ease',
        transform: scrolled ? 'translateY(0)' : 'translateY(-100%)',
        opacity: scrolled ? 1 : 0,
        pointerEvents: scrolled ? 'auto' : 'none'
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
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              backgroundColor: theme.primaryColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: '10px',
              boxShadow: `0 2px 10px ${theme.primaryColor}40`
            }}
          >
            <i 
              className="fas fa-home" 
              style={{ 
                color: 'white', 
                fontSize: '16px' 
              }}
            />
          </div>
          <div>
            <div 
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: '#1D1D1F',
                lineHeight: '1.2',
                transition: 'color 0.3s ease'
              }}
            >
              {community?.name || 'myhoustonhome'}
            </div>
            <div 
              style={{
                fontSize: '11px',
                color: '#86868B',
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
            gap: '20px'
          }}
        >
          <Link 
            to="/communities" 
            className={`nav-link ${location.pathname === '/communities' ? 'active' : ''}`}
            style={{
              color: '#1D1D1F',
              fontWeight: '500',
              fontSize: '13px',
              textDecoration: 'none',
              padding: '6px 10px',
              borderRadius: '6px',
              transition: 'all 0.3s ease',
              backgroundColor: location.pathname === '/communities' ? 
                'rgba(0, 0, 0, 0.05)' : 
                'transparent'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
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
            to={`#homes`}
            className="nav-link"
            style={{
              color: '#1D1D1F',
              fontWeight: '500',
              fontSize: '13px',
              textDecoration: 'none',
              padding: '6px 10px',
              borderRadius: '6px',
              transition: 'all 0.3s ease',
              backgroundColor: 'transparent'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Homes
          </Link>
          <Link 
            to="/contact" 
            className={`nav-link ${location.pathname === '/contact' ? 'active' : ''}`}
            style={{
              color: '#1D1D1F',
              fontWeight: '500',
              fontSize: '13px',
              textDecoration: 'none',
              padding: '6px 10px',
              borderRadius: '6px',
              transition: 'all 0.3s ease',
              backgroundColor: location.pathname === '/contact' ? 
                'rgba(0, 0, 0, 0.05)' : 
                'transparent'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.05)';
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
              background: '#fff',
              border: `1px solid ${theme.primaryColor}`,
              cursor: 'pointer',
              padding: '6px 14px',
              borderRadius: '100px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              color: theme.primaryColor,
              fontSize: '13px',
              fontWeight: '500'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.backgroundColor = theme.primaryColor;
              e.currentTarget.style.color = '#fff';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.backgroundColor = '#fff';
              e.currentTarget.style.color = theme.primaryColor;
            }}
          >
            Schedule Visit
          </button>
        </div>
      </div>
    </nav>
  );
};

export default CommunityNavigation; 