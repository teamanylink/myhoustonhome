import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import apiService from '../services/apiService';

const AdminLogin = () => {
  const [loginData, setLoginData] = useState({ 
    email: 'denis@denvagroup.com', 
    password: 'TempPassword123!' 
  });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await apiService.verifyToken();
        navigate('/admin/dashboard');
      } catch (error) {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);

    try {
      const response = await apiService.login(loginData.email, loginData.password);
      if (response.token) {
        navigate('/admin/dashboard');
      }
    } catch (error) {
      setLoginError(error.message || 'Login failed');
    } finally {
      setLoginLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <div className="text-center">
          <div className="text-large-title mb-4">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f5f5f7' }}>
      <div style={{ width: '360px', maxWidth: '90%' }}>
        {/* Logo */}
        <div className="text-center mb-6">
          <Link to="/">
            <div style={{ 
              fontSize: '24px', 
              fontWeight: 'bold', 
              color: '#1D1D1F' 
            }}>
              MyHoustonHome
            </div>
          </Link>
        </div>
        
        {/* Login Card */}
        <div style={{ 
          background: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)', 
          overflow: 'hidden'
        }}>
          {/* Card Header */}
          <div style={{ 
            padding: '24px 24px 0 24px',
            textAlign: 'center'
          }}>
            <h1 style={{ 
              fontSize: '22px', 
              fontWeight: '700', 
              color: '#1D1D1F', 
              marginBottom: '8px' 
            }}>
              Admin Login
            </h1>
            <p style={{ 
              fontSize: '14px', 
              color: '#86868B', 
              marginBottom: '24px' 
            }}>
              Sign in to access your dashboard
            </p>
          </div>
          
          {/* Card Content */}
          <div style={{ padding: '0 24px 24px 24px' }}>
            <form onSubmit={handleLogin}>
              {loginError && (
                <div style={{ 
                  padding: '12px', 
                  background: 'rgba(255, 59, 48, 0.08)', 
                  border: '1px solid rgba(255, 59, 48, 0.2)', 
                  borderRadius: '8px', 
                  marginBottom: '16px' 
                }}>
                  <p style={{ 
                    fontSize: '13px', 
                    color: '#FF3B30', 
                    margin: 0 
                  }}>
                    {loginError}
                  </p>
                </div>
              )}

              <div style={{ marginBottom: '16px' }}>
                <label 
                  htmlFor="email" 
                  style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#1D1D1F', 
                    marginBottom: '6px' 
                  }}
                >
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  style={{ 
                    width: '100%', 
                    padding: '10px 12px', 
                    border: '1px solid #E5E7EB', 
                    borderRadius: '8px', 
                    fontSize: '15px', 
                    transition: 'all 0.15s ease' 
                  }}
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label 
                  htmlFor="password" 
                  style={{ 
                    display: 'block', 
                    fontSize: '14px', 
                    fontWeight: '600', 
                    color: '#1D1D1F', 
                    marginBottom: '6px' 
                  }}
                >
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    style={{ 
                      width: '100%', 
                      padding: '10px 12px', 
                      paddingRight: '40px', 
                      border: '1px solid #E5E7EB', 
                      borderRadius: '8px', 
                      fontSize: '15px', 
                      transition: 'all 0.15s ease' 
                    }}
                    placeholder="Enter your password"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                  />
                  <button
                    type="button"
                    style={{ 
                      position: 'absolute', 
                      right: '12px', 
                      top: '50%', 
                      transform: 'translateY(-50%)', 
                      background: 'none', 
                      border: 'none', 
                      cursor: 'pointer', 
                      color: '#86868B', 
                      fontSize: '16px' 
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                style={{ 
                  width: '100%', 
                  padding: '12px', 
                  background: '#007AFF', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '8px', 
                  fontSize: '15px', 
                  fontWeight: '600', 
                  cursor: 'pointer', 
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px'
                }}
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <>
                    <span>⏳</span>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>🔐</span>
                    <span>Sign In</span>
                  </>
                )}
              </button>
              
              <div style={{ 
                marginTop: '16px', 
                textAlign: 'center', 
                fontSize: '13px', 
                color: '#86868B' 
              }}>
                Admin credentials are pre-filled for demo
              </div>
            </form>
          </div>
        </div>
        
        {/* Back to Home */}
        <div style={{ 
          textAlign: 'center', 
          marginTop: '20px'
        }}>
          <Link 
            to="/" 
            style={{ 
              color: '#007AFF', 
              fontSize: '14px', 
              textDecoration: 'none' 
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 