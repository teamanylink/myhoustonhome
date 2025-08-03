/* eslint-env node */
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { DatabaseService } from '../src/services/databaseService.js';
import { AdminService } from '../src/services/adminService.js';
import { put, list, del } from '@vercel/blob';

const app = express();
const PORT = process.env.PORT || 4000;

// JWT Secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'f310587d18ff021996bee1fd1d54f77c187d3262ed36ac87629afd4d6373ef1cb4dce30ddaeabb605ea0c8f7b1d41c4d22779d176e4210239fbcdec3b1e1542e';

console.log('🔐 JWT Secret check:', {
  hasEnvSecret: !!process.env.JWT_SECRET,
  secretLength: JWT_SECRET.length,
  secretPreview: JWT_SECRET.substring(0, 10) + '...',
  nodeEnv: process.env.NODE_ENV
});
const SALT_ROUNDS = 10;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Initialize admin system using database
const initializeAdminSystem = async () => {
  try {
    console.log('🔧 Initializing admin system with database...');
    await AdminService.ensureDefaultAdmin();
    console.log('✅ Admin system initialized successfully');
  } catch (error) {
    console.error('❌ Failed to initialize admin system:', error);
    throw error;
  }
};

// Authentication middleware
const authenticateAdmin = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Bearer TOKEN
  
  if (!token) {
    console.log('🔐 Auth failed: No token provided');
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }
  
  try {
    console.log('🔐 Verifying token with secret length:', JWT_SECRET.length);
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('🔐 Token decoded successfully:', { adminId: decoded.adminId, email: decoded.email });
    
    // Find admin in database
    const admin = await AdminService.findAdminById(decoded.adminId);
    
    if (!admin || !admin.isActive) {
      console.log('🔐 Auth failed: Admin not found or inactive', { 
        decodedAdminId: decoded.adminId,
        adminFound: !!admin,
        adminActive: admin?.isActive
      });
      return res.status(401).json({ error: 'Invalid token or admin not found.' });
    }
    
    console.log('🔐 Auth successful for:', admin.email);
    req.admin = admin;
    next();
  } catch (error) {
    console.log('🔐 Auth failed: JWT verification error:', error.message);
    res.status(401).json({ error: 'Invalid token.' });
  }
};

// Super admin middleware (for admin management)
const requireSuperAdmin = (req, res, next) => {
  if (req.admin.role !== 'SUPER_ADMIN') {
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
    
    console.log('🔐 Login attempt for:', email);
    
    // Find admin in database
    const admin = await AdminService.findAdminByEmail(email);
    
    if (!admin) {
      console.log('🔐 Login failed: Admin not found:', email);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    
    if (!admin.isActive) {
      console.log('🔐 Login failed: Admin inactive:', email);
      return res.status(401).json({ error: 'Account is disabled.' });
    }
    
    // Validate password
    const isValidPassword = await AdminService.validatePassword(password, admin.password);
    
    if (!isValidPassword) {
      console.log('🔐 Login failed: Invalid password for:', email);
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    
    console.log('🔐 Login successful for:', email);
    
    // Generate JWT token
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
app.get('/api/admin/users', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const adminUsers = await AdminService.getAllAdmins();
    res.json(adminUsers);
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({ error: 'Failed to fetch admin users.' });
  }
});

// Create new admin
app.post('/api/admin/users', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const { email, password, role = 'ADMIN' } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
    }
    
    const newAdmin = await AdminService.createAdmin({ email, password, role });
    res.status(201).json(newAdmin);
  } catch (error) {
    console.error('Create admin error:', error);
    if (error.message.includes('already exists')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal server error.' });
    }
  }
});

// Delete admin
app.delete('/api/admin/users/:id', authenticateAdmin, requireSuperAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    if (id === req.admin.id) {
      return res.status(400).json({ error: 'Cannot delete your own account.' });
    }
    
    // Soft delete by deactivating the admin
    await AdminService.updateAdmin(id, { isActive: false });
    res.json({ message: 'Admin deleted successfully.' });
  } catch (error) {
    console.error('Delete admin error:', error);
    if (error.message.includes('not found')) {
      res.status(404).json({ error: 'Admin not found.' });
    } else {
      res.status(500).json({ error: 'Failed to delete admin.' });
    }
  }
});

// ===== PROTECTED COMMUNITY ROUTES =====
app.get('/api/communities', authenticateAdmin, async (req, res) => {
  try {
    const communities = await DatabaseService.getCommunities();
    res.json(communities);
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ error: 'Failed to fetch communities' });
  }
});

app.get('/api/communities/:id', authenticateAdmin, async (req, res) => {
  try {
    const community = await DatabaseService.getCommunity(req.params.id);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }
    res.json(community);
  } catch (error) {
    console.error('Error fetching community:', error);
    res.status(500).json({ error: 'Failed to fetch community' });
  }
});

app.post('/api/communities', authenticateAdmin, async (req, res) => {
  try {
    const communityData = {
      id: req.body.id || `community-${Date.now()}`,
      ...req.body
    };
    const community = await DatabaseService.createCommunity(communityData);
    res.status(201).json(community);
  } catch (error) {
    console.error('Error creating community:', error);
    res.status(500).json({ error: 'Failed to create community' });
  }
});

app.put('/api/communities/:id', authenticateAdmin, async (req, res) => {
  try {
    const community = await DatabaseService.updateCommunity(req.params.id, req.body);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }
    res.json(community);
  } catch (error) {
    console.error('Error updating community:', error);
    res.status(500).json({ error: 'Failed to update community' });
  }
});

app.delete('/api/communities/:id', authenticateAdmin, async (req, res) => {
  try {
    const success = await DatabaseService.deleteCommunity(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Community not found' });
    }
    res.json({ message: 'Community deleted successfully' });
  } catch (error) {
    console.error('Error deleting community:', error);
    res.status(500).json({ error: 'Failed to delete community' });
  }
});

// ===== PROTECTED LISTING ROUTES =====
app.get('/api/listings', authenticateAdmin, async (req, res) => {
  try {
    const { communityId } = req.query;
    const filters = {};
    if (communityId) filters.communityId = communityId;
    
    const listings = await DatabaseService.getListings(communityId, filters);
    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

app.get('/api/listings/:id', authenticateAdmin, async (req, res) => {
  try {
    const listing = await DatabaseService.getListing(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

app.post('/api/listings', authenticateAdmin, async (req, res) => {
  try {
    const listingData = {
      id: req.body.id || `listing-${Date.now()}`,
      ...req.body
    };
    const listing = await DatabaseService.createListing(listingData);
    res.status(201).json(listing);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

app.put('/api/listings/:id', authenticateAdmin, async (req, res) => {
  try {
    const listing = await DatabaseService.updateListing(req.params.id, req.body);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

app.delete('/api/listings/:id', authenticateAdmin, async (req, res) => {
  try {
    const success = await DatabaseService.deleteListing(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

// ===== PROTECTED PROPERTY ROUTES =====
app.get('/api/properties', authenticateAdmin, async (req, res) => {
  try {
    const properties = await DatabaseService.getProperties();
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ error: 'Failed to fetch properties' });
  }
});

app.get('/api/properties/:id', authenticateAdmin, async (req, res) => {
  try {
    const property = await DatabaseService.getProperty(req.params.id);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    res.status(500).json({ error: 'Failed to fetch property' });
  }
});

app.post('/api/properties', authenticateAdmin, async (req, res) => {
  try {
    const propertyData = {
      id: `property-${Date.now()}`,
      ...req.body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    const property = await DatabaseService.createProperty(propertyData);
    res.status(201).json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    res.status(500).json({ error: 'Failed to create property' });
  }
});

app.put('/api/properties/:id', authenticateAdmin, async (req, res) => {
  try {
    const propertyData = {
      ...req.body,
      id: req.params.id,
      updatedAt: new Date().toISOString()
    };
    const property = await DatabaseService.updateProperty(req.params.id, propertyData);
    if (!property) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json(property);
  } catch (error) {
    console.error('Error updating property:', error);
    res.status(500).json({ error: 'Failed to update property' });
  }
});

app.delete('/api/properties/:id', authenticateAdmin, async (req, res) => {
  try {
    const success = await DatabaseService.deleteProperty(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Property not found' });
    }
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ error: 'Failed to delete property' });
  }
});

// ===== PROTECTED CONTACT ROUTES =====
app.get('/api/contacts', authenticateAdmin, async (req, res) => {
  try {
    const contacts = await DatabaseService.getContacts();
    res.json(contacts);
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ error: 'Failed to fetch contacts' });
  }
});

// Public contact form submission (not protected)
app.post('/api/contacts', async (req, res) => {
  try {
    const contactData = {
      id: `contact-${Date.now()}`,
      ...req.body
    };
    const contact = await DatabaseService.createContact(contactData);
    res.status(201).json(contact);
  } catch (error) {
    console.error('Error creating contact:', error);
    res.status(500).json({ error: 'Failed to create contact' });
  }
});

app.delete('/api/contacts/:id', authenticateAdmin, async (req, res) => {
  try {
    const success = await DatabaseService.deleteContact(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Contact not found' });
    }
    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    console.error('Error deleting contact:', error);
    res.status(500).json({ error: 'Failed to delete contact' });
  }
});

// ===== PUBLIC ROUTES (No Authentication Required) =====

// Public community routes
app.get('/api/public/communities', async (req, res) => {
  try {
    const communities = await DatabaseService.getCommunities();
    res.json(communities);
  } catch (error) {
    console.error('Error fetching communities:', error);
    res.status(500).json({ error: 'Failed to fetch communities' });
  }
});

app.get('/api/public/communities/:id', async (req, res) => {
  try {
    const community = await DatabaseService.getCommunity(req.params.id);
    if (!community) {
      return res.status(404).json({ error: 'Community not found' });
    }
    res.json(community);
  } catch (error) {
    console.error('Error fetching community:', error);
    res.status(500).json({ error: 'Failed to fetch community' });
  }
});

// Public listing routes
app.get('/api/public/listings', async (req, res) => {
  try {
    const { communityId } = req.query;
    const filters = {};
    if (communityId) filters.communityId = communityId;
    
    const listings = await DatabaseService.getListings(communityId, filters);
    res.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

app.get('/api/public/listings/:id', async (req, res) => {
  try {
    const listing = await DatabaseService.getListing(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    res.json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
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
    
    // contacts.push(contact); // This line was removed as per the new_code, as contacts is no longer in-memory
    
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

// ===== IMAGE MANAGEMENT ENDPOINTS =====

// Get all images (including static)
app.get('/api/images', authenticateAdmin, async (req, res) => {
  try {
    // Get uploaded images from Vercel Blob
    let uploadedImages = [];
    try {
      const { blobs } = await list({ prefix: 'images/' });
      uploadedImages = blobs.map(blob => ({
        url: blob.url,
        filename: blob.pathname.replace('images/', ''),
        size: blob.size,
        uploadedAt: blob.uploadedAt,
        isStatic: false
      }));
    } catch (error) {
      console.log('Error listing Blob images:', error);
    }
    
    res.json({ 
      images: uploadedImages,
      success: true
    });
  } catch (error) {
    console.error('Error getting images:', error);
    res.status(500).json({ error: 'Failed to get images' });
  }
});

// Upload image
app.post('/api/upload', authenticateAdmin, async (req, res) => {
  try {
    const { filename, file } = req.body;
    
    if (!filename || !file) {
      return res.status(400).json({ error: 'Filename and file data required' });
    }

    // Convert base64 to buffer
    const buffer = Buffer.from(file.split(',')[1], 'base64');
    
    // Upload to Vercel Blob
    const { url } = await put(`images/${filename}`, buffer, { 
      access: 'public' 
    });

    res.status(200).json({ 
      success: true, 
      url: url,
      filename: filename 
    });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Delete image
app.delete('/api/upload', authenticateAdmin, async (req, res) => {
  try {
    const { url } = req.body;
    
    if (!url) {
      return res.status(400).json({ error: 'Image URL required' });
    }

    await del(url);

    res.status(200).json({ success: true });

  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

// Initialize admin system on startup
console.log('🚀 Server starting, initializing admin system...');
initializeAdminSystem();

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    console.log('🏥 Health check requested');
    
    // Test database connection
    let dbStatus = 'unknown';
    let dbError = null;
    
    try {
      const { DatabaseService } = await import('../src/services/databaseService.js');
      // Try a simple query with timeout
      await Promise.race([
        DatabaseService.getCommunities(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Database health check timeout')), 5000)
        )
      ]);
      dbStatus = 'connected';
      console.log('✅ Database connection healthy');
    } catch (error) {
      dbStatus = 'error';
      dbError = error.message;
      console.error('❌ Database connection failed:', error.message);
    }
    
    res.json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        error: dbError,
        hasDatabaseUrl: !!process.env.DATABASE_URL
      },
      environment: {
        nodeEnv: process.env.NODE_ENV || 'not set',
        hasJwtSecret: !!process.env.JWT_SECRET
      }
    });
  } catch (error) {
    console.error('❌ Health check failed:', error);
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

// Debug endpoint to check environment variables
app.get('/api/debug/env', (req, res) => {
  res.json({
    hasJwtSecret: !!process.env.JWT_SECRET,
    jwtSecretLength: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
    jwtSecretPreview: process.env.JWT_SECRET ? process.env.JWT_SECRET.substring(0, 10) + '...' : 'NOT_SET',
    nodeEnv: process.env.NODE_ENV,
    currentSecretLength: JWT_SECRET.length,
    currentSecretPreview: JWT_SECRET.substring(0, 10) + '...'
  });
});

// Endpoint to ensure default admin exists (for deployment)
app.post('/api/admin/ensure-default', async (req, res) => {
  try {
    // Check if default admin exists
    const existingAdmin = admins.find(a => a.email === 'denis@denvagroup.com');
    
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('TempPassword123!', SALT_ROUNDS);
      admins.push({
        id: 'admin-1',
        email: 'denis@denvagroup.com',
        password: hashedPassword,
        role: 'super_admin',
        createdAt: new Date().toISOString(),
        isActive: true
      });
      
      console.log('✅ Default admin created via API: denis@denvagroup.com');
      res.json({ 
        success: true, 
        message: 'Default admin created successfully',
        email: 'denis@denvagroup.com',
        password: 'TempPassword123!'
      });
    } else {
      res.json({ 
        success: true, 
        message: 'Default admin already exists',
        email: 'denis@denvagroup.com'
      });
    }
  } catch (error) {
    console.error('Error ensuring default admin:', error);
    res.status(500).json({ error: 'Failed to ensure default admin' });
  }
});

// 404 handler - MUST be last
app.use((req, res) => {
  console.log('❌ Route not found:', req.path);
  res.status(404).json({ error: 'Route not found' });
});

// Start server if this file is run directly
if (typeof process !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) { // eslint-disable-line no-undef
  
  app.listen(PORT, () => {
    console.log(`🚀 API Server running on http://localhost:${PORT}`);
    console.log(`🔐 Admin login available at: http://localhost:${PORT}/admin`);
  });
}

export default app; 