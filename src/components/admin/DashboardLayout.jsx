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

  const currentPage = navItems.find(item => item.path === location.pathname);

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--background-secondary)' }}>
      {/* Sidebar */}
      <div 
        style={{
          width: sidebarCollapsed ? '80px' : '280px',
          backgroundColor: 'var(--surface-color)',
          borderRight: '1px solid var(--separator)',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          height: '100vh',
          left: mobileMenuOpen ? '0' : (window.innerWidth <= 768 ? '-280px' : '0'),
          top: '0',
          zIndex: 1000,
          transition: 'all 0.3s ease',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        {/* Sidebar Header */}
        <div 
          style={{
            padding: 'var(--spacing-6)',
            borderBottom: '1px solid var(--separator)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            minHeight: '80px'
          }}
        >
          {!sidebarCollapsed && (
            <div style={{ fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-bold)', color: 'var(--primary-color)' }}>
              MyHoustonHome
            </div>
          )}
          <button
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              padding: 'var(--spacing-2)',
              borderRadius: 'var(--radius-md)',
              transition: 'all var(--transition-fast)',
              fontSize: '1.2rem'
            }}
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            onMouseOver={(e) => e.target.style.backgroundColor = 'var(--background-secondary)'}
            onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        
        {/* Navigation */}
        <nav style={{ flex: 1, padding: 'var(--spacing-4)', display: 'flex', flexDirection: 'column' }}>
          {navItems.map((item) => (
            <button
              key={item.path}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: sidebarCollapsed ? '0' : 'var(--spacing-3)',
                padding: 'var(--spacing-3) var(--spacing-4)',
                color: location.pathname === item.path ? 'white' : 'var(--text-secondary)',
                backgroundColor: location.pathname === item.path ? 'var(--primary-color)' : 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                transition: 'all var(--transition-normal)',
                marginBottom: 'var(--spacing-1)',
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                textAlign: 'left',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                minHeight: '48px'
              }}
              onClick={() => {
                navigate(item.path);
                setMobileMenuOpen(false);
              }}
              onMouseOver={(e) => {
                if (location.pathname !== item.path) {
                  e.target.style.backgroundColor = 'var(--background-secondary)';
                  e.target.style.color = 'var(--text-primary)';
                }
              }}
              onMouseOut={(e) => {
                if (location.pathname !== item.path) {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <span style={{ fontSize: '1.2rem', minWidth: '20px', textAlign: 'center' }}>{item.icon}</span>
              {!sidebarCollapsed && <span>{item.name}</span>}
            </button>
          ))}

          {/* Logout Button */}
          <div style={{ marginTop: 'auto', paddingTop: 'var(--spacing-6)' }}>
            <button
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: sidebarCollapsed ? '0' : 'var(--spacing-3)',
                padding: 'var(--spacing-3) var(--spacing-4)',
                color: 'var(--text-secondary)',
                backgroundColor: 'transparent',
                border: 'none',
                borderRadius: 'var(--radius-lg)',
                transition: 'all var(--transition-normal)',
                fontSize: 'var(--text-lg)',
                fontWeight: 'var(--font-weight-medium)',
                cursor: 'pointer',
                textAlign: 'left',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                minHeight: '48px',
                width: '100%'
              }}
              onClick={handleLogout}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 59, 48, 0.1)';
                e.target.style.color = 'var(--error-color)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'var(--text-secondary)';
              }}
            >
              <span style={{ fontSize: '1.2rem', minWidth: '20px', textAlign: 'center' }}>🚪</span>
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && window.innerWidth <= 768 && (
        <div 
          style={{
            position: 'fixed',
            inset: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999
          }}
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <div 
        style={{
          flex: 1,
          marginLeft: window.innerWidth <= 768 ? '0' : (sidebarCollapsed ? '80px' : '280px'),
          transition: 'margin-left 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh'
        }}
      >
        {/* Top Header */}
        <header 
          style={{
            backgroundColor: 'var(--surface-color)',
            borderBottom: '1px solid var(--separator)',
            padding: 'var(--spacing-4) var(--spacing-6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: 'var(--shadow-sm)',
            minHeight: '80px'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
            {window.innerWidth <= 768 && (
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  cursor: 'pointer',
                  padding: 'var(--spacing-2)',
                  borderRadius: 'var(--radius-md)',
                  transition: 'all var(--transition-fast)',
                  fontSize: '1.2rem'
                }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                ☰
              </button>
            )}
            <h1 style={{ 
              fontSize: 'var(--text-2xl)', 
              fontWeight: 'var(--font-weight-bold)', 
              color: 'var(--text-primary)',
              margin: 0
            }}>
              {currentPage?.name || 'Admin'}
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-4)' }}>
            <span style={{ color: 'var(--text-secondary)' }}>Welcome, {user.email}</span>
            <button 
              className="btn btn-secondary"
              onClick={handleLogout}
            >
              Logout
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main 
          style={{
            flex: 1,
            padding: 'var(--spacing-6)',
            backgroundColor: 'var(--background-secondary)'
          }}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 