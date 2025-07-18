import React, { useState, useEffect } from 'react';
import { Outlet, Navigate, useNavigate, useLocation } from 'react-router-dom';

const DashboardLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (!token || !userData) {
      navigate('/admin/login');
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/admin/login');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
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
      path: '/admin/properties',
      name: 'Properties',
      icon: '🏠'
    },
    {
      path: '/admin/listings',
      name: 'Listings',
      icon: '📝'
    },
    {
      path: '/admin/settings',
      name: 'Settings',
      icon: '⚙️'
    }
  ];

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
          {navItems.map((item) => (
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
            style={{ 
              background: 'none', 
              border: 'none', 
              width: '100%', 
              textAlign: 'left',
              marginTop: 'var(--spacing-6)' 
            }}
          >
            <span className="admin-nav-icon">🚪</span>
            <span>Logout</span>
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
              {navItems.find(item => item.path === location.pathname)?.name || 'Admin'}
            </h1>
          </div>
          
          <div className="admin-header-actions">
            <span className="text-secondary">Welcome, {user.email}</span>
            <button className="btn btn-secondary" onClick={handleLogout}>
              Logout
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