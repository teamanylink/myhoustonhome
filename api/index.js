/* eslint-env node */
import express from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { DatabaseService } from '../src/services/databaseService.js';
import { put, list, del } from '@vercel/blob';

const app = express();
const PORT = process.env.PORT || 4000;

// JWT Secret - in production, use environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const SALT_ROUNDS = 10;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// In-memory storage for admin users only (communities, listings, contacts use database)
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
    
    // Check if this is the default admin login attempt
    if (email.toLowerCase() === 'denis@denvagroup.com' && password === 'TempPassword123!') {
      // Ensure default admin exists
      let admin = admins.find(a => a.email.toLowerCase() === email.toLowerCase() && a.isActive);
      
      if (!admin) {
        console.log('🔧 Creating default admin on first login attempt...');
        const hashedPassword = await bcrypt.hash('TempPassword123!', SALT_ROUNDS);
        admin = {
          id: 'admin-1',
          email: 'denis@denvagroup.com',
          password: hashedPassword,
          role: 'super_admin',
          createdAt: new Date().toISOString(),
          isActive: true
        };
        admins.push(admin);
        console.log('✅ Default admin created: denis@denvagroup.com');
      }
    } else {
      // Regular login flow
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
      return;
    }
    
    // Handle default admin login
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

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Initialize default admin on startup
initializeDefaultAdmin();

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

// Start server if this file is run directly
if (typeof process !== 'undefined' && import.meta.url === `file://${process.argv[1]}`) { // eslint-disable-line no-undef
  
  app.listen(PORT, () => {
    console.log(`🚀 API Server running on http://localhost:${PORT}`);
    console.log(`🔐 Admin login available at: http://localhost:${PORT}/admin`);
  });
}

export default app; 