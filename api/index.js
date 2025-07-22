/* eslint-env node */
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = process.env.PORT || 4000;

// JWT Secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const SALT_ROUNDS = 10;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-memory storage (replace with actual database in production)
let communities = [];
let listings = [];
let contacts = [];
let admins = [];

// Initialize default admin
const initializeDefaultAdmin = async () => {
  if (admins.length === 0) {
    const hashedPassword = await bcrypt.hash('TempPassword123!', SALT_ROUNDS);
    admins.push({
      id: 'admin-1',
      email: 'denis@denvagroup.com',
      password: hashedPassword,
      role: 'super_admin',
      createdAt: new Date().toISOString(),
      isActive: true
    });
    console.log('✅ Default admin created: denis@denvagroup.com');
    console.log('🔑 Temporary password: TempPassword123!');
    console.log('⚠️  Please change this password immediately after first login');
  }
};

// Authentication middleware
const authenticateAdmin = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const admin = admins.find(a => a.id === decoded.adminId && a.isActive);
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid token or admin not found.' });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// Super admin middleware (for admin management)
const requireSuperAdmin = (req, res, next) => {
  if (req.admin.role !== 'super_admin') {
    return res.status(403).json({ error: 'Super admin access required.' });
  }
  next();
};

// ===== ADMIN AUTHENTICATION ROUTES =====

// Admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    
    const admin = admins.find(a => a.email.toLowerCase() === email.toLowerCase() && a.isActive);
    
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    
    const isValidPassword = await bcrypt.compare(password, admin.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    
    const token = jwt.sign(
      { adminId: admin.id, email: admin.email, role: admin.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    res.json({
      token,
      admin: {
        id: admin.id,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Verify token (for frontend to check if still authenticated)
app.get('/api/admin/verify', authenticateAdmin, (req, res) => {
  res.json({
    admin: {
      id: req.admin.id,
      email: req.admin.email,
      role: req.admin.role
    }
  });
});

// Change password
app.post('/api/admin/change-password', authenticateAdmin, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required.' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    }
    
    const admin = admins.find(a => a.id === req.admin.id);
    const isValidPassword = await bcrypt.compare(currentPassword, admin.password);
    
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
    admin.password = hashedPassword;
    
    res.json({ message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// ===== ADMIN MANAGEMENT ROUTES (Super Admin Only) =====

// Get all admins
app.get('/api/admin/users', authenticateAdmin, requireSuperAdmin, (req, res) => {
  const adminUsers = admins
    .filter(a => a.isActive)
    .map(({ password, ...admin }) => admin); // Remove password from response
  
  res.json(adminUsers);
});

// Create new admin
app.post('/api/admin/users', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const { email, password, role = 'admin' } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }
    
    // Check if admin already exists
    const existingAdmin = admins.find(a => a.email.toLowerCase() === email.toLowerCase());
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin with this email already exists.' });
    }
    
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    const newAdmin = {
      id: `admin-${Date.now()}`,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role === 'super_admin' ? 'super_admin' : 'admin',
      createdAt: new Date().toISOString(),
      isActive: true
    };
    
    admins.push(newAdmin);
    
    // Return admin without password
    const { password: _, ...adminResponse } = newAdmin;
    res.status(201).json(adminResponse);
  } catch (error) {
    console.error('Create admin error:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});

// Delete admin
app.delete('/api/admin/users/:id', authenticateAdmin, requireSuperAdmin, (req, res) => {
  const { id } = req.params;
  
  if (id === req.admin.id) {
    return res.status(400).json({ error: 'Cannot delete your own account.' });
  }
  
  const adminIndex = admins.findIndex(a => a.id === id);
  
  if (adminIndex === -1) {
    return res.status(404).json({ error: 'Admin not found.' });
  }
  
  // Soft delete
  admins[adminIndex].isActive = false;
  
  res.json({ message: 'Admin deleted successfully.' });
});

// ===== PROTECTED COMMUNITY ROUTES =====
app.get('/api/communities', authenticateAdmin, (req, res) => {
  res.json(communities);
});

app.get('/api/communities/:id', authenticateAdmin, (req, res) => {
  const community = communities.find(c => c.id === req.params.id);
  if (!community) {
    return res.status(404).json({ error: 'Community not found' });
  }
  res.json(community);
});

app.post('/api/communities', authenticateAdmin, (req, res) => {
  const community = {
    id: req.body.id || `community-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  communities.push(community);
  res.status(201).json(community);
});

app.put('/api/communities/:id', authenticateAdmin, (req, res) => {
  const index = communities.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Community not found' });
  }
  communities[index] = { ...communities[index], ...req.body };
  res.json(communities[index]);
});

app.delete('/api/communities/:id', authenticateAdmin, (req, res) => {
  const index = communities.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Community not found' });
  }
  communities.splice(index, 1);
  res.json({ message: 'Community deleted successfully' });
});

// ===== PROTECTED LISTING ROUTES =====
app.get('/api/listings', authenticateAdmin, (req, res) => {
  const { communityId } = req.query;
  let result = listings;
  
  if (communityId) {
    result = listings.filter(l => l.communityId === communityId);
  }
  
  res.json(result);
});

app.get('/api/listings/:id', authenticateAdmin, (req, res) => {
  const listing = listings.find(l => l.id === req.params.id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }
  res.json(listing);
});

app.post('/api/listings', authenticateAdmin, (req, res) => {
  const listing = {
    id: req.body.id || `listing-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  listings.push(listing);
  res.status(201).json(listing);
});

app.put('/api/listings/:id', authenticateAdmin, (req, res) => {
  const index = listings.findIndex(l => l.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Listing not found' });
  }
  listings[index] = { ...listings[index], ...req.body };
  res.json(listings[index]);
});

app.delete('/api/listings/:id', authenticateAdmin, (req, res) => {
  const index = listings.findIndex(l => l.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Listing not found' });
  }
  listings.splice(index, 1);
  res.json({ message: 'Listing deleted successfully' });
});

// ===== PROTECTED CONTACT ROUTES =====
app.get('/api/contacts', authenticateAdmin, (req, res) => {
  res.json(contacts);
});

// Public contact form submission (not protected)
app.post('/api/contacts', (req, res) => {
  const contact = {
    id: `contact-${Date.now()}`,
    ...req.body,
    createdAt: new Date().toISOString()
  };
  contacts.push(contact);
  res.status(201).json(contact);
});

app.delete('/api/contacts/:id', authenticateAdmin, (req, res) => {
  const index = contacts.findIndex(c => c.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ error: 'Contact not found' });
  }
  contacts.splice(index, 1);
  res.json({ message: 'Contact deleted successfully' });
});

// ===== PUBLIC ROUTES (No Authentication Required) =====

// Public community routes
app.get('/api/public/communities', (req, res) => {
  res.json(communities);
});

app.get('/api/public/communities/:id', (req, res) => {
  const community = communities.find(c => c.id === req.params.id);
  if (!community) {
    return res.status(404).json({ error: 'Community not found' });
  }
  res.json(community);
});

// Public listing routes
app.get('/api/public/listings', (req, res) => {
  const { communityId } = req.query;
  let result = listings;
  
  if (communityId) {
    result = listings.filter(l => l.communityId === communityId);
  }
  
  res.json(result);
});

app.get('/api/public/listings/:id', (req, res) => {
  const listing = listings.find(l => l.id === req.params.id);
  if (!listing) {
    return res.status(404).json({ error: 'Listing not found' });
  }
  res.json(listing);
});

// Public contact form submission
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, message, interest } = req.body;
    
    // Validate required fields
    if (!name || !email || !message || !interest) {
      return res.status(400).json({ error: 'Name, email, message, and interest are required.' });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    
    // Create contact submission
    const contact = {
      id: `contact-${Date.now()}`,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : null,
      message: message.trim(),
      interest,
      submittedAt: new Date().toISOString(),
      status: 'new'
    };
    
    contacts.push(contact);
    
    // Log submission for development
    console.log('📧 New contact submission:', {
      id: contact.id,
      name: contact.name,
      email: contact.email,
      interest: contact.interest
    });
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 300));
    
    res.status(201).json({ 
      success: true, 
      message: 'Thank you for your message! We\'ll get back to you soon.',
      id: contact.id
    });
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({ error: 'There was an error processing your message. Please try again.' });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize default admin on startup
initializeDefaultAdmin();

// Start server if this file is run directly
if (typeof process !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) { // eslint-disable-line no-undef
  
  app.listen(PORT, () => {
    console.log(`🚀 API Server running on http://localhost:${PORT}`);
    console.log(`🔐 Admin login available at: http://localhost:${PORT}/admin`);
  });
}

export default app; 