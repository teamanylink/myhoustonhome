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
    // Ensure we're running on the client side
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

  const navItems = [
    {
      path: '/admin/dashboard',
      name: 'Dashboard',
      icon: '📊'
    },
    {
      path: '/admin/communities',
      name: 'Communities',
      icon: '🏘️'
    },
    {
      path: '/admin/listings',
      name: 'Listings',
      icon: '📝'
    },
    {
      path: '/admin/properties',
      name: 'Properties',
      icon: '🏠'
    },
    {
      path: '/admin/admin-users',
      name: 'Admin Users',
      icon: '👥',
      requiresSuperAdmin: true
    },
    {
      path: '/admin/settings',
      name: 'Settings',
      icon: '⚙️'
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
              const shouldShow = !item.requiresSuperAdmin || user.role === 'super_admin';
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
              <span className="admin-nav-icon">{item.icon}</span>
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
              {isLoggingOut ? '⏳' : '🚪'}
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