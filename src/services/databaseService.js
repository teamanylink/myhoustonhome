import { PrismaClient } from '@prisma/client';
import { withAccelerate } from '@prisma/extension-accelerate';

// Initialize Prisma client with Accelerate
const prisma = new PrismaClient().$extends(withAccelerate());

// Database service for communities, builders, homes, and listings
export class DatabaseService {
  // ===== COMMUNITY METHODS =====
  
  static async getCommunities() {
    try {
      const communities = await prisma.community.findMany({
        include: {
          builders: true,
          homes: true,
          _count: {
            select: {
              builders: true,
              homes: true,
              listings: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      });

      // Return communities with native PostgreSQL types (no JSON parsing needed)
      return communities;
    } catch (error) {
      console.error('Error fetching communities:', error);
      throw new Error('Failed to fetch communities');
    }
  }

  static async getCommunity(id) {
    try {
      const community = await prisma.community.findUnique({
        where: { id },
        include: {
          builders: true,
          homes: {
            include: {
              builder: true
            }
          },
          listings: {
            where: {
              status: 'AVAILABLE'
            }
          }
        }
      });

      if (!community) return null;

      // Return community with native PostgreSQL types (no JSON parsing needed)
      return community;
    } catch (error) {
      console.error('Error fetching community:', error);
      throw new Error('Failed to fetch community');
    }
  }

  static async createCommunity(communityData) {
    try {
      const { 
        builders, 
        homes, 
        features, 
        styling, 
        mediaAssets, 
        totalHomes,
        ...community 
      } = communityData;
      
      // Map frontend fields to database schema (PostgreSQL native types)
      const mappedData = {
        ...community,
        // Map features to amenities (native array)
        amenities: features || [],
        // Map styling to theme with mediaAssets (native JSON)
        theme: {
          ...(styling || {}),
          mediaAssets: mediaAssets || []
        },
        // Handle other field mappings (native types)
        sections: community.sections || {},
        schools: community.schools || [],
        references: community.references || [],
        priceRange: community.priceRange || '',
      };
      
      return await prisma.community.create({
        data: {
          ...mappedData,
          builders: builders ? {
            create: builders
          } : undefined,
          homes: homes ? {
            create: homes
          } : undefined
        },
        include: {
          builders: true,
          homes: true
        }
      });
    } catch (error) {
      console.error('Error creating community:', error);
      throw new Error('Failed to create community');
    }
  }

  static async updateCommunity(id, updateData) {
    try {
      const { 
        features, 
        styling, 
        mediaAssets, 
        totalHomes,
        builders,   // Exclude builders from main update
        homes,      // Exclude homes from main update
        _count,     // Exclude Prisma count metadata
        ...community 
      } = updateData;
      
      // Get existing community to merge theme data
      const existing = await prisma.community.findUnique({ where: { id } });
      const existingTheme = existing?.theme || {};
      
      // Map frontend fields to database schema (PostgreSQL native types)
      const mappedData = {
        ...community,
        // Map features to amenities (native array if provided)
        ...(features !== undefined && { amenities: features }),
        // Map styling to theme with mediaAssets (merge with existing theme)
        ...(styling !== undefined || mediaAssets !== undefined) && {
          theme: {
            ...existingTheme,
            ...(styling || {}),
            ...(mediaAssets !== undefined && { mediaAssets })
          }
        },
        // Handle other native fields
        ...(community.sections !== undefined && { sections: community.sections }),
        ...(community.schools !== undefined && { schools: community.schools }),
        ...(community.references !== undefined && { references: community.references })
      };
      
      return await prisma.community.update({
        where: { id },
        data: mappedData,
        include: {
          builders: true,
          homes: true
        }
      });
    } catch (error) {
      console.error('Error updating community:', error);
      throw new Error('Failed to update community');
    }
  }

  static async deleteCommunity(id) {
    try {
      return await prisma.community.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting community:', error);
      throw new Error('Failed to delete community');
    }
  }

  // ===== BUILDER METHODS =====

  static async getBuilders(communityId = null) {
    try {
      const where = communityId ? { communityId } : {};
      
      return await prisma.builder.findMany({
        where,
        include: {
          community: true,
          homes: true
        },
        orderBy: {
          name: 'asc'
        }
      });
    } catch (error) {
      console.error('Error fetching builders:', error);
      throw new Error('Failed to fetch builders');
    }
  }

  static async getBuilder(id) {
    try {
      return await prisma.builder.findUnique({
        where: { id },
        include: {
          community: true,
          homes: true
        }
      });
    } catch (error) {
      console.error('Error fetching builder:', error);
      throw new Error('Failed to fetch builder');
    }
  }

  static async createBuilder(builderData) {
    try {
      return await prisma.builder.create({
        data: builderData,
        include: {
          community: true,
          homes: true
        }
      });
    } catch (error) {
      console.error('Error creating builder:', error);
      throw new Error('Failed to create builder');
    }
  }

  static async updateBuilder(id, updateData) {
    try {
      return await prisma.builder.update({
        where: { id },
        data: updateData,
        include: {
          community: true,
          homes: true
        }
      });
    } catch (error) {
      console.error('Error updating builder:', error);
      throw new Error('Failed to update builder');
    }
  }

  static async deleteBuilder(id) {
    try {
      return await prisma.builder.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting builder:', error);
      throw new Error('Failed to delete builder');
    }
  }

  // ===== HOME METHODS =====

  static async getHomes(communityId = null, builderId = null) {
    try {
      const where = {};
      if (communityId) where.communityId = communityId;
      if (builderId) where.builderId = builderId;
      
      return await prisma.home.findMany({
        where,
        include: {
          community: true,
          builder: true
        },
        orderBy: [
          { price: 'asc' },
          { name: 'asc' }
        ]
      });
    } catch (error) {
      console.error('Error fetching homes:', error);
      throw new Error('Failed to fetch homes');
    }
  }

  static async getHome(id) {
    try {
      return await prisma.home.findUnique({
        where: { id },
        include: {
          community: true,
          builder: true
        }
      });
    } catch (error) {
      console.error('Error fetching home:', error);
      throw new Error('Failed to fetch home');
    }
  }

  static async createHome(homeData) {
    try {
      return await prisma.home.create({
        data: homeData,
        include: {
          community: true,
          builder: true
        }
      });
    } catch (error) {
      console.error('Error creating home:', error);
      throw new Error('Failed to create home');
    }
  }

  static async updateHome(id, updateData) {
    try {
      return await prisma.home.update({
        where: { id },
        data: updateData,
        include: {
          community: true,
          builder: true
        }
      });
    } catch (error) {
      console.error('Error updating home:', error);
      throw new Error('Failed to update home');
    }
  }

  static async deleteHome(id) {
    try {
      return await prisma.home.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting home:', error);
      throw new Error('Failed to delete home');
    }
  }

  // ===== LISTING METHODS =====

  static async getListings(communityId = null, filters = {}) {
    try {
      const where = {};
      
      if (communityId) where.communityId = communityId;
      if (filters.status) where.status = filters.status;
      if (filters.type) where.type = filters.type;
      if (filters.minPrice) where.price = { gte: filters.minPrice };
      if (filters.maxPrice) {
        where.price = where.price ? 
          { ...where.price, lte: filters.maxPrice } : 
          { lte: filters.maxPrice };
      }
      if (filters.minBedrooms) where.bedrooms = { gte: filters.minBedrooms };
      
      const listings = await prisma.listing.findMany({
        where,
        include: {
          community: true
        },
        orderBy: [
          { status: 'asc' },
          { price: 'asc' },
          { createdAt: 'desc' }
        ]
      });

      // Return listings with native PostgreSQL types (no JSON parsing needed)
      return listings;
    } catch (error) {
      console.error('Error fetching listings:', error);
      throw new Error('Failed to fetch listings');
    }
  }

  static async getListing(id) {
    try {
      const listing = await prisma.listing.findUnique({
        where: { id },
        include: {
          community: true
        }
      });

      if (!listing) return null;

      // Return listing with native PostgreSQL types (no JSON parsing needed)
      return listing;
    } catch (error) {
      console.error('Error fetching listing:', error);
      throw new Error('Failed to fetch listing');
    }
  }

  static async createListing(listingData) {
    try {
      // Use native PostgreSQL array types (no serialization needed)
      const listing = await prisma.listing.create({
        data: listingData,
        include: {
          community: true
        }
      });

      return listing;
    } catch (error) {
      console.error('Error creating listing:', error);
      throw new Error('Failed to create listing');
    }
  }

  static async updateListing(id, updateData) {
    try {
      // Use native PostgreSQL array types (no serialization needed)
      const listing = await prisma.listing.update({
        where: { id },
        data: updateData,
        include: {
          community: true
        }
      });

      return listing;
    } catch (error) {
      console.error('Error updating listing:', error);
      throw new Error('Failed to update listing');
    }
  }

  static async deleteListing(id) {
    try {
      return await prisma.listing.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting listing:', error);
      throw new Error('Failed to delete listing');
    }
  }

  // ===== PROPERTY METHODS =====

  static async getProperties() {
    try {
      return await prisma.property.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error fetching properties:', error);
      throw new Error('Failed to fetch properties');
    }
  }

  static async getProperty(id) {
    try {
      return await prisma.property.findUnique({
        where: { id }
      });
    } catch (error) {
      console.error('Error fetching property:', error);
      throw new Error('Failed to fetch property');
    }
  }

  static async createProperty(propertyData) {
    try {
      return await prisma.property.create({
        data: propertyData
      });
    } catch (error) {
      console.error('Error creating property:', error);
      throw new Error('Failed to create property');
    }
  }

  static async updateProperty(id, updateData) {
    try {
      return await prisma.property.update({
        where: { id },
        data: updateData
      });
    } catch (error) {
      console.error('Error updating property:', error);
      throw new Error('Failed to update property');
    }
  }

  static async deleteProperty(id) {
    try {
      return await prisma.property.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting property:', error);
      throw new Error('Failed to delete property');
    }
  }

  // ===== CONTACT METHODS =====

  static async getContacts() {
    try {
      return await prisma.contact.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error fetching contacts:', error);
      throw new Error('Failed to fetch contacts');
    }
  }

  static async createContact(contactData) {
    try {
      return await prisma.contact.create({
        data: contactData
      });
    } catch (error) {
      console.error('Error creating contact:', error);
      throw new Error('Failed to create contact');
    }
  }

  static async deleteContact(id) {
    try {
      return await prisma.contact.delete({
        where: { id }
      });
    } catch (error) {
      console.error('Error deleting contact:', error);
      throw new Error('Failed to delete contact');
    }
  }

  // ===== SEARCH AND ANALYTICS =====

  static async searchListings(query, filters = {}) {
    try {
      const where = {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { address: { contains: query, mode: 'insensitive' } },
          { 
            community: {
              name: { contains: query, mode: 'insensitive' }
            }
          }
        ]
      };

      // Apply additional filters
      if (filters.status) where.status = filters.status;
      if (filters.type) where.type = filters.type;
      if (filters.communityId) where.communityId = filters.communityId;

      return await prisma.listing.findMany({
        where,
        include: {
          community: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } catch (error) {
      console.error('Error searching listings:', error);
      throw new Error('Failed to search listings');
    }
  }

  static async getAnalytics() {
    try {
      const [
        totalCommunities,
        totalBuilders,
        totalHomes,
        totalListings,
        availableListings,
        avgPrice
      ] = await Promise.all([
        prisma.community.count(),
        prisma.builder.count(),
        prisma.home.count(),
        prisma.listing.count(),
        prisma.listing.count({ where: { status: 'AVAILABLE' } }),
        prisma.listing.aggregate({
          _avg: { price: true },
          where: { status: 'AVAILABLE' }
        })
      ]);

      return {
        communities: totalCommunities,
        builders: totalBuilders,
        homes: totalHomes,
        listings: {
          total: totalListings,
          available: availableListings,
          avgPrice: avgPrice._avg.price || 0
        }
      };
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw new Error('Failed to fetch analytics');
    }
  }

  // ===== UTILITY METHODS =====

  static async disconnect() {
    await prisma.$disconnect();
  }
}

// UI utilities (keeping the same as before for compatibility)
export class UIUtils {
  static formatPrice(price) {
    if (typeof price === 'string' && price.includes('$')) {
      return price; // Already formatted string like "$200K+"
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price);
  }

  static formatDate(dateString) {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(dateString));
  }

  static capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  static darkenColor(color, factor) {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Darken the color
    const darkR = Math.floor(r * (1 - factor));
    const darkG = Math.floor(g * (1 - factor));
    const darkB = Math.floor(b * (1 - factor));
    
    // Convert back to hex
    const toHex = (value) => value.toString(16).padStart(2, '0');
    return `#${toHex(darkR)}${toHex(darkG)}${toHex(darkB)}`;
  }
}

// Notification system (keeping the same for compatibility)
export class NotificationService {
  static show(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Styling
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      padding: var(--spacing-4) var(--spacing-6);
      border-radius: var(--radius-lg);
      color: white;
      font-weight: var(--font-weight-semibold);
      z-index: 1000;
      box-shadow: var(--shadow-xl);
      transform: translateX(100%);
      transition: transform var(--transition-normal);
      max-width: 400px;
      font-family: var(--font-family);
      font-size: var(--text-lg);
    `;
    
    // Color based on type
    if (type === 'success') {
      notification.style.backgroundColor = 'var(--success-color)';
    } else if (type === 'error') {
      notification.style.backgroundColor = 'var(--error-color)';
    } else if (type === 'warning') {
      notification.style.backgroundColor = 'var(--warning-color)';
    }
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
      notification.style.transform = 'translateX(100%)';
      setTimeout(() => {
        if (notification.parentNode) {
          document.body.removeChild(notification);
        }
      }, 300);
    }, 3000);
  }
} 