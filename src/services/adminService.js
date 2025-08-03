import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';
import bcrypt from 'bcrypt';

// Initialize Prisma client for admin operations
let prisma;
try {
  prisma = new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
  
  // Use Accelerate extension if DATABASE_URL is configured for it
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.includes('prisma-accelerate')) {
    prisma = prisma.$extends(withAccelerate());
    console.log('✅ AdminService: Prisma Accelerate extension loaded');
  }
  
  console.log('✅ AdminService: Prisma client initialized successfully');
} catch (error) {
  console.error('❌ AdminService: Failed to initialize Prisma client:', error.message);
  // Fallback to basic client without extensions
  prisma = new PrismaClient({
    log: ['error', 'warn']
  });
  console.log('⚠️ AdminService: Using basic Prisma client without extensions');
}

const SALT_ROUNDS = 10;

// Admin service for database operations
export class AdminService {
  // ===== ADMIN AUTHENTICATION =====
  
  static async findAdminByEmail(email) {
    try {
      console.log('🔍 Finding admin by email:', email);
      const admin = await prisma.admin.findUnique({
        where: { email: email.toLowerCase() }
      });
      return admin;
    } catch (error) {
      console.error('Error finding admin by email:', error);
      throw new Error('Failed to find admin');
    }
  }
  
  static async findAdminById(id) {
    try {
      console.log('🔍 Finding admin by ID:', id);
      const admin = await prisma.admin.findUnique({
        where: { id }
      });
      return admin;
    } catch (error) {
      console.error('Error finding admin by ID:', error);
      throw new Error('Failed to find admin');
    }
  }
  
  static async validatePassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      console.error('Error validating password:', error);
      return false;
    }
  }
  
  // ===== ADMIN MANAGEMENT =====
  
  static async getAllAdmins() {
    try {
      console.log('📋 Fetching all admins');
      const admins = await prisma.admin.findMany({
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
      return admins;
    } catch (error) {
      console.error('Error fetching admins:', error);
      throw new Error('Failed to fetch admins');
    }
  }
  
  static async createAdmin(adminData) {
    try {
      const { email, password, role = 'ADMIN' } = adminData;
      
      console.log('👤 Creating new admin:', email);
      
      // Check if admin already exists
      const existingAdmin = await this.findAdminByEmail(email);
      if (existingAdmin) {
        throw new Error('Admin with this email already exists');
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      
      // Create admin
      const newAdmin = await prisma.admin.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          role: role === 'SUPER_ADMIN' ? 'SUPER_ADMIN' : 'ADMIN',
          isActive: true
        },
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      console.log('✅ Admin created successfully:', newAdmin.email);
      return newAdmin;
    } catch (error) {
      console.error('Error creating admin:', error);
      throw error;
    }
  }
  
  static async updateAdmin(id, updateData) {
    try {
      console.log('📝 Updating admin:', id);
      
      const updatePayload = { ...updateData };
      
      // Hash password if provided
      if (updateData.password) {
        updatePayload.password = await bcrypt.hash(updateData.password, SALT_ROUNDS);
      }
      
      // Normalize email if provided
      if (updateData.email) {
        updatePayload.email = updateData.email.toLowerCase();
      }
      
      const updatedAdmin = await prisma.admin.update({
        where: { id },
        data: updatePayload,
        select: {
          id: true,
          email: true,
          role: true,
          isActive: true,
          createdAt: true,
          updatedAt: true
        }
      });
      
      console.log('✅ Admin updated successfully:', updatedAdmin.email);
      return updatedAdmin;
    } catch (error) {
      console.error('Error updating admin:', error);
      throw new Error('Failed to update admin');
    }
  }
  
  static async deleteAdmin(id) {
    try {
      console.log('🗑️ Deleting admin:', id);
      
      await prisma.admin.delete({
        where: { id }
      });
      
      console.log('✅ Admin deleted successfully');
      return { success: true };
    } catch (error) {
      console.error('Error deleting admin:', error);
      throw new Error('Failed to delete admin');
    }
  }
  
  // ===== INITIALIZATION =====
  
  static async ensureDefaultAdmin() {
    try {
      console.log('🔧 Ensuring default admin exists...');
      
      const defaultAdmin = await this.findAdminByEmail('denis@denvagroup.com');
      if (!defaultAdmin) {
        console.log('🔧 Creating default admin...');
        await this.createAdmin({
          email: 'denis@denvagroup.com',
          password: 'TempPassword123!',
          role: 'SUPER_ADMIN'
        });
        console.log('✅ Default admin created: denis@denvagroup.com');
        console.log('🔑 Temporary password: TempPassword123!');
        console.log('⚠️  Please change this password immediately after first login');
      } else {
        console.log('✅ Default admin already exists');
      }
    } catch (error) {
      console.error('Error ensuring default admin:', error);
      throw error;
    }
  }
  
  static async migrateExistingAdmin(adminData) {
    try {
      console.log('🔄 Migrating existing admin to database:', adminData.email);
      
      const existing = await this.findAdminByEmail(adminData.email);
      if (!existing) {
        // Create without hashing password again (it's already hashed)
        await prisma.admin.create({
          data: {
            id: adminData.id,
            email: adminData.email.toLowerCase(),
            password: adminData.password, // Already hashed
            role: adminData.role === 'super_admin' ? 'SUPER_ADMIN' : 'ADMIN',
            isActive: adminData.isActive,
            createdAt: adminData.createdAt
          }
        });
        console.log('✅ Admin migrated successfully:', adminData.email);
      } else {
        console.log('✅ Admin already exists in database:', adminData.email);
      }
    } catch (error) {
      console.error('Error migrating admin:', error);
      throw error;
    }
  }
}

export default AdminService;