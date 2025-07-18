// Lightweight local storage management
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
    this.image = data.image || '/images/communities/default.jpg';
    this.amenities = data.amenities || [];
    this.builders = data.builders || [];
    this.homes = data.homes || [];
    this.theme = data.theme || {
      primaryColor: '#007AFF',
      borderRadius: '12px',
      borderRadiusLarge: '16px'
    };
    this.sections = data.sections || {
      hero: { 
        visible: true, 
        title: '', 
        subtitle: '',
        backgroundType: 'image',
        backgroundColor: '#ffffff',
        backgroundImage: '',
        backgroundVideo: '',
        backgroundOpacity: 1.0,
        overlayColor: '#ffffff',
        overlayOpacity: 0.85
      },
      about: { visible: true, content: '' },
      homes: { visible: true, title: 'Available Homes' },
      builders: { visible: true, title: 'Our Builders' }
    };
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

// Lightweight data service
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
    return listings.map(data => new Listing(data));
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
    return StorageManager.get('contacts') || [];
  }

  static saveContact(contact) {
    const contacts = this.getContacts();
    contacts.push(contact);
    StorageManager.set('contacts', contacts);
  }

  static deleteContact(index) {
    const contacts = this.getContacts();
    contacts.splice(index, 1);
    StorageManager.set('contacts', contacts);
  }

  static clearAllContacts() {
    StorageManager.remove('contacts');
  }

  // Initialize example data only when explicitly called
  static initializeExampleData() {
    const existingCommunities = this.getCommunities();
    if (existingCommunities.length === 0) {
      // Lazy load example data only when needed
      import('./exampleData.js').then(({ initializeExampleData }) => {
        initializeExampleData();
      });
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