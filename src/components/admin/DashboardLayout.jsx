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
    { path: '/admin/dashboard', name: 'Dashboard', icon: '📊' },
    { path: '/admin/communities', name: 'Communities', icon: '🏘️' },
    { path: '/admin/properties', name: 'Properties', icon: '🏠' },
    { path: '/admin/listings', name: 'Listings', icon: '📝' },
    { path: '/admin/settings', name: 'Settings', icon: '⚙️' }
  ];

  const currentPage = navItems.find(item => item.path === location.pathname);

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: '#f8fafc',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarCollapsed ? '80px' : '280px',
        background: 'white',
        borderRight: '1px solid #e5e7eb',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        height: '100vh',
        left: window.innerWidth <= 768 ? (mobileMenuOpen ? '0' : '-280px') : '0',
        top: '0',
        zIndex: 1000,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: sidebarCollapsed ? '24px 16px' : '24px',
          borderBottom: '1px solid #f3f4f6',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '80px'
        }}>
          {!sidebarCollapsed && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px'
              }}>
                🏠
              </div>
              <div style={{
                fontSize: '18px',
                fontWeight: '700',
                color: '#1f2937',
                letterSpacing: '-0.01em'
              }}>
                MyHoustonHome
              </div>
            </div>
          )}
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            style={{
              background: 'none',
              border: 'none',
              color: '#6b7280',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '6px',
              transition: 'all 0.2s ease',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.target.style.background = '#f3f4f6';
              e.target.style.color = '#374151';
            }}
            onMouseOut={(e) => {
              e.target.style.background = 'none';
              e.target.style.color = '#6b7280';
            }}
          >
            {sidebarCollapsed ? '→' : '←'}
          </button>
        </div>
        
        {/* Navigation */}
        <nav style={{ 
          flex: 1, 
          padding: '16px', 
          display: 'flex', 
          flexDirection: 'column',
          gap: '4px'
        }}>
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setMobileMenuOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: sidebarCollapsed ? '0' : '12px',
                  padding: sidebarCollapsed ? '12px' : '12px 16px',
                  color: isActive ? '#667eea' : '#6b7280',
                  background: isActive ? '#f0f4ff' : 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  textAlign: 'left',
                  justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                  minHeight: '44px',
                  width: '100%'
                }}
                onMouseOver={(e) => {
                  if (!isActive) {
                    e.target.style.background = '#f9fafb';
                    e.target.style.color = '#374151';
                  }
                }}
                onMouseOut={(e) => {
                  if (!isActive) {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#6b7280';
                  }
                }}
              >
                <span style={{ 
                  fontSize: '16px', 
                  minWidth: '20px', 
                  textAlign: 'center'
                }}>
                  {item.icon}
                </span>
                {!sidebarCollapsed && <span>{item.name}</span>}
              </button>
            );
          })}

          {/* Logout Button */}
          <div style={{ marginTop: 'auto', paddingTop: '16px' }}>
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: sidebarCollapsed ? '0' : '12px',
                padding: sidebarCollapsed ? '12px' : '12px 16px',
                color: '#6b7280',
                background: 'transparent',
                border: 'none',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                textAlign: 'left',
                justifyContent: sidebarCollapsed ? 'center' : 'flex-start',
                minHeight: '44px',
                width: '100%'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#fef2f2';
                e.target.style.color = '#dc2626';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'transparent';
                e.target.style.color = '#6b7280';
              }}
            >
              <span style={{ 
                fontSize: '16px', 
                minWidth: '20px', 
                textAlign: 'center'
              }}>
                🚪
              </span>
              {!sidebarCollapsed && <span>Logout</span>}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile overlay */}
      {mobileMenuOpen && window.innerWidth <= 768 && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: '0',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            backdropFilter: 'blur(4px)'
          }}
        />
      )}

      {/* Main content */}
      <div style={{
        flex: 1,
        marginLeft: window.innerWidth <= 768 ? '0' : (sidebarCollapsed ? '80px' : '280px'),
        transition: 'margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <header style={{
          background: 'white',
          borderBottom: '1px solid #e5e7eb',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          minHeight: '80px',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px' 
          }}>
            {window.innerWidth <= 768 && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  padding: '8px',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  fontSize: '16px'
                }}
                onMouseOver={(e) => {
                  e.target.style.background = '#f3f4f6';
                  e.target.style.color = '#374151';
                }}
                onMouseOut={(e) => {
                  e.target.style.background = 'none';
                  e.target.style.color = '#6b7280';
                }}
              >
                ☰
              </button>
            )}
            <div>
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#1f2937',
                margin: 0,
                letterSpacing: '-0.01em'
              }}>
                {currentPage?.name || 'Admin'}
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '2px 0 0 0'
              }}>
                Manage your real estate platform
              </p>
            </div>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px' 
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '8px 12px',
              background: '#f9fafb',
              borderRadius: '8px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '32px',
                height: '32px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px'
              }}>
                👤
              </div>
              <div>
                <div style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  color: '#1f2937',
                  lineHeight: '1.2'
                }}>
                  Admin User
                </div>
                <div style={{
                  fontSize: '12px',
                  color: '#6b7280',
                  lineHeight: '1.2'
                }}>
                  {user.email}
                </div>
              </div>
            </div>
            <button 
              onClick={handleLogout}
              style={{
                padding: '8px 16px',
                background: 'white',
                color: '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f9fafb';
                e.target.style.borderColor = '#d1d5db';
                e.target.style.color = '#374151';
              }}
              onMouseOut={(e) => {
                e.target.style.background = 'white';
                e.target.style.borderColor = '#e5e7eb';
                e.target.style.color = '#6b7280';
              }}
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main style={{
          flex: 1,
          padding: '32px',
          background: '#f8fafc'
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout; 