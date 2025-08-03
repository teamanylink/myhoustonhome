import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';
import apiService from '../../services/apiService'; // Added import for apiService

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined') {
      console.log('🔍 DashboardLayout: Running on server, skipping auth check');
      setAuthChecked(true);
      return;
    }

    console.log('🔍 DashboardLayout: Checking authentication...');
    
    try {
      const token = localStorage.getItem('adminToken');
      const userData = localStorage.getItem('adminUser');
      
      if (!token || !userData) {
        console.log('🔍 DashboardLayout: No token or user data, redirecting to login');
        navigate('/admin/login');
        return;
      }

      const parsedUser = JSON.parse(userData);
      console.log('🔍 DashboardLayout: Setting user:', parsedUser);
      setUser(parsedUser);
    } catch (error) {
      console.error('Error accessing localStorage or parsing user data:', error);
      navigate('/admin/login');
    } finally {
      // Always mark auth as checked, whether successful or not
      setAuthChecked(true);
    }
  }, []); // Empty dependency array - only run once on mount

  const handleLogout = () => {
    // Set loading state
    setIsLoggingOut(true);
    
    // Clear local storage
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    
    // Clear API service token
    apiService.logout();
    
    // Clear user state
    setUser(null);
    
    // Small delay to ensure state is cleared, then navigate
    setTimeout(() => {
      navigate('/admin/login', { replace: true });
    }, 100);
  };

  // Helper function to get SVG icons
  const getNavIcon = (iconType) => {
    const iconProps = {
      width: "20",
      height: "20",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2"
    };

    switch (iconType) {
      case 'dashboard':
        return (
          <svg {...iconProps}>
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
          </svg>
        );
      case 'communities':
        return (
          <svg {...iconProps}>
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9,22 9,12 15,12 15,22"/>
          </svg>
        );
      case 'listings':
        return (
          <svg {...iconProps}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <polyline points="14,2 14,8 20,8"/>
            <line x1="16" y1="13" x2="8" y2="13"/>
            <line x1="16" y1="17" x2="8" y2="17"/>
          </svg>
        );
      case 'properties':
        return (
          <svg {...iconProps}>
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
        );
      case 'users':
        return (
          <svg {...iconProps}>
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        );
      case 'settings':
        return (
          <svg {...iconProps}>
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
            <circle cx="12" cy="12" r="3"/>
          </svg>
        );
      case 'logout':
        return (
          <svg {...iconProps}>
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16,17 21,12 16,7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
        );
      case 'loading':
        return (
          <svg {...iconProps} className="animate-spin">
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" strokeLinecap="round" strokeDasharray="60" strokeDashoffset="20"/>
          </svg>
        );
      default:
        return null;
    }
  };

  const navItems = [
    {
      path: '/admin/dashboard',
      name: 'Dashboard',
      icon: 'dashboard'
    },
    {
      path: '/admin/communities',
      name: 'Communities',
      icon: 'communities'
    },
    {
      path: '/admin/listings',
      name: 'Listings',
      icon: 'listings'
    },
    {
      path: '/admin/properties',
      name: 'Properties',
      icon: 'properties'
    },
    {
      path: '/admin/admin-users',
      name: 'Admin Users',
      icon: 'users',
      requiresSuperAdmin: true
    },
    {
      path: '/admin/settings',
      name: 'Settings',
      icon: 'settings'
    }
  ];

  const currentPage = navItems.find(item => item.path === location.pathname);

  // Show loading while checking authentication
  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-secondary">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Only redirect after auth check is complete
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`admin-sidebar ${sidebarCollapsed ? 'collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="admin-sidebar-header">
          <div className="admin-sidebar-logo">MyHoustonHome</div>
          <button
            className="admin-sidebar-toggle"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            ☰
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {navItems
            .filter(item => {
              const shouldShow = !item.requiresSuperAdmin || user.role === 'SUPER_ADMIN';
              return shouldShow;
            })
            .map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`admin-nav-link ${location.pathname === item.path ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
            >
              <span className="admin-nav-icon">{getNavIcon(item.icon)}</span>
              <span>{item.name}</span>
            </a>
          ))}

          <button
            className="admin-nav-link"
            onClick={handleLogout}
            disabled={isLoggingOut}
            style={{
              background: 'none',
              border: 'none',
              width: '100%',
              textAlign: 'left',
              marginTop: 'var(--spacing-6)',
              opacity: isLoggingOut ? 0.6 : 1
            }}
          >
            <span className="admin-nav-icon">
              {isLoggingOut ? getNavIcon('loading') : getNavIcon('logout')}
            </span>
            <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
          </button>
        </nav>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div
          className="admin-sidebar-overlay show"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div className={`admin-main ${sidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              className="admin-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              ☰
            </button>
            <h1 className="admin-header-title">
              {currentPage?.name || 'Admin'}
            </h1>
          </div>

          <div className="admin-header-actions">
            <span className="text-secondary">Welcome, {user.email}</span>
            <button 
              className="btn btn-secondary" 
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Logging out...
                </>
              ) : (
                'Logout'
              )}
            </button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 