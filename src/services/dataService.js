// Local storage management
class StorageManager {
  static get(key) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error getting item from localStorage:', error);
      return null;
    }
  }

  static set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error setting item in localStorage:', error);
    }
  }

  static remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing item from localStorage:', error);
    }
  }
}

// Data models
export class Community {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.name = data.name || '';
    this.description = data.description || '';
    this.location = data.location || '';
    this.priceRange = data.priceRange || '';
    this.amenities = data.amenities || [];
    this.builders = data.builders || [];
    this.homes = data.homes || [];
    this.theme = data.theme || {
      primaryColor: '#007AFF',
      borderRadius: '12px',
      borderRadiusLarge: '16px'
    };
    this.sections = data.sections || {
      hero: { visible: true, title: '', subtitle: '' },
      about: { visible: true, content: '' },
      homes: { visible: true, title: 'Available Homes' },
      builders: { visible: true, title: 'Our Builders' }
    };
    this.schools = data.schools || [];
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}

export class Listing {
  constructor(data) {
    this.id = data.id || Date.now().toString();
    this.title = data.title || '';
    this.description = data.description || '';
    this.price = data.price || 0;
    this.address = data.address || '';
    this.bedrooms = data.bedrooms || 0;
    this.bathrooms = data.bathrooms || 0;
    this.sqft = data.sqft || 0;
    this.communityId = data.communityId || null;
    this.type = data.type || 'house';
    this.status = data.status || 'available';
    this.createdAt = data.createdAt || new Date().toISOString();
  }
}

// Enhanced Listing model with additional properties for Zillow-like features
export class EnhancedListing extends Listing {
  constructor(data) {
    super(data);
    this.images = data.images || [];
    this.virtualTourUrl = data.virtualTourUrl || '';
    this.floorPlanUrl = data.floorPlanUrl || '';
    this.yearBuilt = data.yearBuilt || null;
    this.lotSize = data.lotSize || null;
    this.parking = data.parking || null;
    this.propertyTax = data.propertyTax || null;
    this.hoaFees = data.hoaFees || null;
    this.appliances = data.appliances || [];
    this.features = data.features || [];
    this.flooring = data.flooring || [];
    this.cooling = data.cooling || '';
    this.heating = data.heating || '';
    this.laundry = data.laundry || '';
    this.schools = data.schools || {
      elementary: null,
      middle: null,
      high: null
    };
    this.walkScore = data.walkScore || null;
    this.neighborhood = data.neighborhood || {};
    this.marketStats = data.marketStats || {};
    this.priceHistory = data.priceHistory || [];
    this.agentInfo = data.agentInfo || {
      name: '',
      phone: '',
      email: '',
      photo: '',
      bio: ''
    };
  }
}

// Data service
export class DataService {
  static getCommunities() {
    const communities = StorageManager.get('communities') || [];
    return communities.map(data => new Community(data));
  }

  static getCommunity(id) {
    const communities = this.getCommunities();
    return communities.find(community => community.id === id);
  }

  static saveCommunity(community) {
    const communities = this.getCommunities();
    const index = communities.findIndex(c => c.id === community.id);
    
    if (index >= 0) {
      communities[index] = community;
    } else {
      communities.push(community);
    }
    
    StorageManager.set('communities', communities);
  }

  static deleteCommunity(id) {
    const communities = this.getCommunities();
    const filtered = communities.filter(c => c.id !== id);
    StorageManager.set('communities', filtered);
  }

  static getListings() {
    const listings = StorageManager.get('listings') || [];
    return listings.map(data => new EnhancedListing(data));
  }

  static getListing(id) {
    const listings = this.getListings();
    return listings.find(listing => listing.id === id);
  }

  static saveListing(listing) {
    const listings = this.getListings();
    const index = listings.findIndex(l => l.id === listing.id);
    
    if (index >= 0) {
      listings[index] = listing;
    } else {
      listings.push(listing);
    }
    
    StorageManager.set('listings', listings);
  }

  static deleteListing(id) {
    const listings = this.getListings();
    const filtered = listings.filter(l => l.id !== id);
    StorageManager.set('listings', filtered);
  }

  static getListingsByCommunity(communityId) {
    const listings = this.getListings();
    return listings.filter(listing => listing.communityId === communityId);
  }

  static getContacts() {
    return JSON.parse(localStorage.getItem('contacts') || '[]');
  }

  static saveContact(contact) {
    const contacts = this.getContacts();
    contacts.push(contact);
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }

  static deleteContact(index) {
    const contacts = this.getContacts();
    contacts.splice(index, 1);
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }

  static clearAllContacts() {
    localStorage.removeItem('contacts');
  }

  // Production-ready initialization - no dummy data
  static initializeExampleData() {
    // Data will be managed through the admin interface
    // No dummy data initialization in production
  }

  // Search functionality
  static searchListings(query, filters = {}) {
    const listings = this.getListings();
    let filtered = listings;

    // Text search
    if (query) {
      const searchTerm = query.toLowerCase();
      filtered = filtered.filter(listing => 
        listing.title.toLowerCase().includes(searchTerm) ||
        listing.address.toLowerCase().includes(searchTerm) ||
        listing.description.toLowerCase().includes(searchTerm)
      );
    }

    // Apply filters
    if (filters.minPrice) {
      filtered = filtered.filter(listing => listing.price >= filters.minPrice);
    }
    if (filters.maxPrice) {
      filtered = filtered.filter(listing => listing.price <= filters.maxPrice);
    }
    if (filters.bedrooms) {
      filtered = filtered.filter(listing => listing.bedrooms >= filters.bedrooms);
    }
    if (filters.bathrooms) {
      filtered = filtered.filter(listing => listing.bathrooms >= filters.bathrooms);
    }
    if (filters.type && filters.type !== 'all') {
      filtered = filtered.filter(listing => listing.type === filters.type);
    }
    if (filters.communityId) {
      filtered = filtered.filter(listing => listing.communityId === filters.communityId);
    }

    return filtered;
  }

  // Sort functionality
  static sortListings(listings, sortBy = 'price-asc') {
    const sorted = [...listings];
    
    switch (sortBy) {
      case 'price-asc':
        return sorted.sort((a, b) => a.price - b.price);
      case 'price-desc':
        return sorted.sort((a, b) => b.price - a.price);
      case 'sqft-asc':
        return sorted.sort((a, b) => a.sqft - b.sqft);
      case 'sqft-desc':
        return sorted.sort((a, b) => b.sqft - a.sqft);
      case 'bedrooms-asc':
        return sorted.sort((a, b) => a.bedrooms - b.bedrooms);
      case 'bedrooms-desc':
        return sorted.sort((a, b) => b.bedrooms - a.bedrooms);
      case 'newest':
        return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'oldest':
        return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      default:
        return sorted;
    }
  }
}

// API Service for production backend integration
export class APIService {
  static baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  
  static async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Community endpoints
  static async getCommunities() {
    return this.request('/communities');
  }

  static async getCommunity(id) {
    return this.request(`/communities/${id}`);
  }

  static async createCommunity(community) {
    return this.request('/communities', {
      method: 'POST',
      body: JSON.stringify(community),
    });
  }

  static async updateCommunity(id, community) {
    return this.request(`/communities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(community),
    });
  }

  static async deleteCommunity(id) {
    return this.request(`/communities/${id}`, {
      method: 'DELETE',
    });
  }

  // Listing endpoints
  static async getListings(filters = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/listings?${params}`);
  }

  static async getListing(id) {
    return this.request(`/listings/${id}`);
  }

  static async createListing(listing) {
    return this.request('/listings', {
      method: 'POST',
      body: JSON.stringify(listing),
    });
  }

  static async updateListing(id, listing) {
    return this.request(`/listings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(listing),
    });
  }

  static async deleteListing(id) {
    return this.request(`/listings/${id}`, {
      method: 'DELETE',
    });
  }

  // Contact endpoints
  static async submitContact(contact) {
    return this.request('/contacts', {
      method: 'POST',
      body: JSON.stringify(contact),
    });
  }

  static async getContacts() {
    return this.request('/contacts');
  }

  // Search endpoints
  static async searchListings(query, filters = {}) {
    return this.request('/search/listings', {
      method: 'POST',
      body: JSON.stringify({ query, filters }),
    });
  }

  // Upload endpoints
  static async uploadImage(file, type = 'listing') {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('type', type);

    return this.request('/upload/image', {
      method: 'POST',
      headers: {}, // Remove Content-Type to let browser set it for FormData
      body: formData,
    });
  }
}

// Production DataService that integrates with API
export class ProductionDataService extends DataService {
  static async getCommunities() {
    try {
      const data = await APIService.getCommunities();
      return data.map(item => new Community(item));
    } catch (error) {
      console.error('Failed to fetch communities from API, falling back to localStorage:', error);
      return super.getCommunities();
    }
  }

  static async getCommunity(id) {
    try {
      const data = await APIService.getCommunity(id);
      return new Community(data);
    } catch (error) {
      console.error('Failed to fetch community from API, falling back to localStorage:', error);
      return super.getCommunity(id);
    }
  }

  static async saveCommunity(community) {
    try {
      if (community.id && community.id !== 'new') {
        await APIService.updateCommunity(community.id, community);
      } else {
        await APIService.createCommunity(community);
      }
      // Also save to localStorage as backup
      super.saveCommunity(community);
    } catch (error) {
      console.error('Failed to save community to API, saving to localStorage only:', error);
      super.saveCommunity(community);
    }
  }

  static async deleteCommunity(id) {
    try {
      await APIService.deleteCommunity(id);
      super.deleteCommunity(id);
    } catch (error) {
      console.error('Failed to delete community from API, deleting from localStorage only:', error);
      super.deleteCommunity(id);
    }
  }

  static async getListings(filters = {}) {
    try {
      const data = await APIService.getListings(filters);
      return data.map(item => new EnhancedListing(item));
    } catch (error) {
      console.error('Failed to fetch listings from API, falling back to localStorage:', error);
      return super.getListings().map(item => new EnhancedListing(item));
    }
  }

  static async getListing(id) {
    try {
      const data = await APIService.getListing(id);
      return new EnhancedListing(data);
    } catch (error) {
      console.error('Failed to fetch listing from API, falling back to localStorage:', error);
      const listing = super.getListing(id);
      return listing ? new EnhancedListing(listing) : null;
    }
  }

  static async saveListing(listing) {
    try {
      if (listing.id && listing.id !== 'new') {
        await APIService.updateListing(listing.id, listing);
      } else {
        await APIService.createListing(listing);
      }
      // Also save to localStorage as backup
      super.saveListing(listing);
    } catch (error) {
      console.error('Failed to save listing to API, saving to localStorage only:', error);
      super.saveListing(listing);
    }
  }

  static async deleteListing(id) {
    try {
      await APIService.deleteListing(id);
      super.deleteListing(id);
    } catch (error) {
      console.error('Failed to delete listing from API, deleting from localStorage only:', error);
      super.deleteListing(id);
    }
  }

  static async saveContact(contact) {
    try {
      await APIService.submitContact(contact);
      super.saveContact(contact);
    } catch (error) {
      console.error('Failed to submit contact to API, saving to localStorage only:', error);
      super.saveContact(contact);
    }
  }

  static async searchListings(query, filters = {}) {
    try {
      const data = await APIService.searchListings(query, filters);
      return data.map(item => new EnhancedListing(item));
    } catch (error) {
      console.error('Failed to search listings via API, falling back to local search:', error);
      return super.searchListings(query, filters);
    }
  }

  static async uploadImage(file, type = 'listing') {
    try {
      const result = await APIService.uploadImage(file, type);
      return result.url;
    } catch (error) {
      console.error('Failed to upload image:', error);
      throw error;
    }
  }
}

// UI utilities
export class UIUtils {
  static formatPrice(price) {
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

  static formatSquareFeet(sqft) {
    return sqft ? sqft.toLocaleString() + ' sq ft' : '';
  }

  static formatLotSize(lotSize) {
    if (!lotSize) return '';
    if (lotSize >= 43560) {
      const acres = (lotSize / 43560).toFixed(2);
      return `${acres} acres`;
    }
    return lotSize.toLocaleString() + ' sq ft';
  }

  static generateSlug(title) {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
}

// Notification system
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