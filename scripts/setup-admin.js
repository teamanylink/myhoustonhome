#!/usr/bin/env node

/**
 * Admin Setup Script for MyHoustonHome
 * 
 * This script helps with initial admin setup and testing.
 * Run with: node scripts/setup-admin.js
 */

import fetch from 'node-fetch';

const API_BASE = 'http://localhost:4000/api';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logError = (message) => {
  console.log(`${colors.red}❌ ${message}${colors.reset}`);
};

const logSuccess = (message) => {
  console.log(`${colors.green}✅ ${message}${colors.reset}`);
};

const logInfo = (message) => {
  console.log(`${colors.blue}ℹ️  ${message}${colors.reset}`);
};

const logWarning = (message) => {
  console.log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
};

// Test API connection
const testConnection = async () => {
  try {
    logInfo('Testing API connection...');
    const response = await fetch(`${API_BASE}/public/communities`);
    
    if (response.ok) {
      logSuccess('API is running and accessible');
      return true;
    } else {
      logError(`API responded with status: ${response.status}`);
      return false;
    }
  } catch (error) {
    logError(`Failed to connect to API: ${error.message}`);
    logWarning('Make sure the backend server is running on port 4000');
    return false;
  }
};

// Test admin login
const testAdminLogin = async () => {
  try {
    logInfo('Testing admin login...');
    
    const loginData = {
      email: 'denis@denvagroup.com',
      password: 'TempPassword123!'
    };
    
    const response = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(loginData)
    });
    
    if (response.ok) {
      const data = await response.json();
      logSuccess('Admin login successful');
      logInfo(`Token received: ${data.token.substring(0, 20)}...`);
      return data.token;
    } else {
      const error = await response.json();
      logError(`Login failed: ${error.error}`);
      return null;
    }
  } catch (error) {
    logError(`Login error: ${error.message}`);
    return null;
  }
};

// Test admin users endpoint
const testAdminUsers = async (token) => {
  try {
    logInfo('Testing admin users endpoint...');
    
    const response = await fetch(`${API_BASE}/admin/users`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (response.ok) {
      const users = await response.json();
      logSuccess(`Found ${users.length} admin user(s)`);
      users.forEach(user => {
        logInfo(`- ${user.email} (${user.role})`);
      });
      return true;
    } else {
      const error = await response.json();
      logError(`Failed to get admin users: ${error.error}`);
      return false;
    }
  } catch (error) {
    logError(`Admin users error: ${error.message}`);
    return false;
  }
};

// Create a test admin
const createTestAdmin = async (token) => {
  try {
    logInfo('Creating test admin user...');
    
    const adminData = {
      email: 'testadmin@example.com',
      password: 'TestPass123!',
      role: 'admin'
    };
    
    const response = await fetch(`${API_BASE}/admin/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(adminData)
    });
    
    if (response.ok) {
      const admin = await response.json();
      logSuccess(`Test admin created: ${admin.email}`);
      return true;
    } else {
      const error = await response.json();
      logError(`Failed to create test admin: ${error.error}`);
      return false;
    }
  } catch (error) {
    logError(`Create admin error: ${error.message}`);
    return false;
  }
};

// Main setup function
const runSetup = async () => {
  log('🚀 MyHoustonHome Admin Setup Script', 'bright');
  log('=====================================', 'bright');
  
  // Test connection
  const isConnected = await testConnection();
  if (!isConnected) {
    logError('Setup failed: Cannot connect to API');
    process.exit(1);
  }
  
  // Test login
  const token = await testAdminLogin();
  if (!token) {
    logError('Setup failed: Cannot login with default admin');
    logWarning('Check that the backend server is running and default admin exists');
    process.exit(1);
  }
  
  // Test admin users
  const usersOk = await testAdminUsers(token);
  if (!usersOk) {
    logError('Setup failed: Cannot access admin users');
    process.exit(1);
  }
  
  // Create test admin
  await createTestAdmin(token);
  
  log('\n🎉 Setup completed successfully!', 'bright');
  log('\n📋 Next Steps:', 'bright');
  log('1. Access the admin panel at: http://localhost:5173/admin/login');
  log('2. Login with: denis@denvagroup.com / TempPassword123!');
  log('3. Change your password in Settings > Password');
  log('4. Create additional admin users in Admin Users section');
  log('5. Start managing your communities and listings!');
  
  log('\n🔐 Default Admin Credentials:', 'bright');
  log('Email: denis@denvagroup.com');
  log('Password: TempPassword123!');
  log('Role: Super Admin');
  
  log('\n⚠️  Security Reminder:', 'yellow');
  log('Change the default password immediately after first login!');
};

// Run the setup
runSetup().catch(error => {
  logError(`Setup failed with error: ${error.message}`);
  process.exit(1);
}); 