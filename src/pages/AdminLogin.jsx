import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    // Check if already authenticated
    const checkAuth = async () => {
      try {
        await apiService.verifyToken();
        // If authenticated, redirect to dashboard
        navigate('/admin/dashboard');
      } catch (error) {
        // Not authenticated, show login form
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
        // Redirect to dashboard
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
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background-secondary)' }}>
        <div className="text-center">
          <div className="text-large-title mb-4">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--background-secondary)' }}>
      <div className="w-full max-w-md mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-title-1 font-bold text-primary mb-2">
            Admin Login
          </h1>
          <p className="text-body text-secondary">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Form */}
        <div className="card">
          <div className="card-content">
            <form onSubmit={handleLogin} className="space-y-6">
              {loginError && (
                <div style={{
                  padding: 'var(--spacing-4)',
                  backgroundColor: 'rgba(255, 59, 48, 0.1)',
                  border: '1px solid rgba(255, 59, 48, 0.2)',
                  borderRadius: 'var(--radius-xl)',
                  color: 'var(--error-color)'
                }}>
                  <p className="text-sm">{loginError}</p>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="form-input"
                  placeholder="Enter your email"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    className="form-input"
                    style={{ paddingRight: '3rem' }}
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
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                      fontSize: '1.2rem'
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary"
                style={{ width: '100%' }}
                disabled={loginLoading}
              >
                {loginLoading ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span>⏳</span>
                    Signing in...
                  </span>
                ) : (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <span>🔐</span>
                    Sign In
                  </span>
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-secondary">
                Default admin credentials are pre-filled
              </p>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <a 
            href="/" 
            className="text-primary hover:text-primary-dark"
            style={{ 
              textDecoration: 'none',
              transition: 'color var(--transition-fast)'
            }}
          >
            ← Back to Home
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin; 