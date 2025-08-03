// Simplified API service for communicating with database operations
class ApiService {
  constructor() {
    // Use relative URL for Vite proxy, fallback to absolute URL for production
    this.baseURL = import.meta.env.VITE_API_URL || (import.meta.env.MODE === 'development' ? '' : window.location.origin);
    this.token = localStorage.getItem('adminToken');
    console.log('🔧 ApiService initialized:', {
      baseURL: this.baseURL,
      mode: import.meta.env.MODE,
      envApiUrl: import.meta.env.VITE_API_URL
    });
  }

  // Authentication methods
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('adminToken', token);
    } else {
      localStorage.removeItem('adminToken');
    }
  }

  getToken() {
    return this.token || localStorage.getItem('adminToken');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  logout() {
    this.setToken(null);
    localStorage.removeItem('adminUser');
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}/api${endpoint}`;
    console.log('🌐 Making request:', { url, method: options.method || 'GET', endpoint });

    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        // Add authorization header if token exists
        ...(this.getToken() && { 'Authorization': `Bearer ${this.getToken()}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log('🔧 Request config:', {
      url,
      method: config.method,
      hasAuth: !!config.headers.Authorization,
      headers: Object.keys(config.headers)
    });

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      console.log('📡 Sending request to:', url);
      const response = await fetch(url, config);
      console.log('📡 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      });
      
      if (response.status === 401) {
        console.log('🔐 401 Unauthorized - logging out user');
        // Token expired or invalid, logout user
        this.logout();
        throw new Error('Authentication expired. Please login again.');
      }
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('❌ HTTP error:', { status: response.status, errorData });
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Request successful:', data);
      return data;
    } catch (error) {
      console.error(`❌ Request failed: ${url} - ${error.message}`);
      if (error.message.includes('Authentication expired')) {
        // Re-throw auth errors to be handled by components
        throw error;
      }
      throw new Error(`Network error: ${error.message}`);
    }
  }

  // ===== ADMIN AUTHENTICATION METHODS =====
  async login(email, password) {
    const response = await this.request('/admin/login', {
      method: 'POST',
      body: { email, password }
    });
    
    if (response.token) {
      this.setToken(response.token);
      localStorage.setItem('adminUser', JSON.stringify(response.admin));
    }
    
    return response;
  }

  async verifyToken() {
    if (!this.getToken()) {
      throw new Error('No token available');
    }
    
    return this.request('/admin/verify');
  }

  async changePassword(currentPassword, newPassword) {
    return this.request('/admin/change-password', {
      method: 'POST',
      body: { currentPassword, newPassword }
    });
  }

  // ===== ADMIN MANAGEMENT METHODS =====
  async getAdminUsers() {
    return this.request('/admin/users');
  }

  async createAdminUser(email, password, role = 'admin') {
    return this.request('/admin/users', {
      method: 'POST',
      body: { email, password, role }
    });
  }

  async deleteAdminUser(id) {
    console.log('🔧 ApiService.deleteAdminUser called with ID:', id);
    console.log('🔧 Current token:', this.getToken() ? 'Present' : 'Missing');
    
    try {
      const result = await this.request(`/admin/users/${id}`, {
        method: 'DELETE'
      });
      console.log('✅ ApiService.deleteAdminUser successful:', result);
      return result;
    } catch (error) {
      console.error('❌ ApiService.deleteAdminUser failed:', {
        id,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // ===== COMMUNITY METHODS =====
  async getCommunities() { return this.request('/communities'); }
  async getCommunity(id) { return this.request(`/communities/${id}`); }
  async createCommunity(data) { return this.request('/communities', { method: 'POST', body: data }); }
  async updateCommunity(id, data) { return this.request(`/communities/${id}`, { method: 'PUT', body: data }); }
  async deleteCommunity(id) { return this.request(`/communities/${id}`, { method: 'DELETE' }); }

  // ===== LISTING METHODS =====
  async getListings(communityId = null) {
    const query = communityId ? `?communityId=${communityId}` : '';
    return this.request(`/listings${query}`);
  }
  async getListing(id) { return this.request(`/listings/${id}`); }
  async createListing(data) { return this.request('/listings', { method: 'POST', body: data }); }
  async updateListing(id, data) { return this.request(`/listings/${id}`, { method: 'PUT', body: data }); }
  async deleteListing(id) { return this.request(`/listings/${id}`, { method: 'DELETE' }); }

  // ===== PROPERTY METHODS =====
  async getProperties() { return this.request('/properties'); }
  async getProperty(id) { return this.request(`/properties/${id}`); }
  async createProperty(data) { return this.request('/properties', { method: 'POST', body: data }); }
  async updateProperty(id, data) { return this.request(`/properties/${id}`, { method: 'PUT', body: data }); }
  async deleteProperty(id) { return this.request(`/properties/${id}`, { method: 'DELETE' }); }

  // ===== CONTACT METHODS =====
  async getContacts() { return this.request('/contacts'); }
  async createContact(data) { return this.request('/contacts', { method: 'POST', body: data }); }
  async deleteContact(id) { return this.request(`/contacts/${id}`, { method: 'DELETE' }); }

  // ===== PUBLIC METHODS (No Auth Required) =====
  async getPublicCommunities() { 
    // Remove auth header for public access
    return this.request('/public/communities', { headers: {} }); 
  }
  async getPublicCommunity(id) { 
    return this.request(`/public/communities/${id}`, { headers: {} }); 
  }
  async getPublicListings(communityId = null) {
    const query = communityId ? `?communityId=${communityId}` : '';
    return this.request(`/public/listings${query}`, { headers: {} });
  }
  async getPublicListing(id) { 
    return this.request(`/public/listings/${id}`, { headers: {} }); 
  }
  async createPublicContact(data) { 
    return this.request('/public/contacts', { method: 'POST', body: data, headers: {} }); 
  }
}

// Create singleton instance
const apiService = new ApiService();

// Simplified DataService with localStorage fallback
export class DataService {
  // Community cache for instant access
  static communityCache = new Map();

  // ===== AUTHENTICATION METHODS =====
  static async login(email, password) {
    try {
      return await apiService.login(email, password);
    } catch (error) {
      console.error('Login failed:', error.message);
      throw error;
    }
  }

  static async verifyAuthentication() {
    try {
      return await apiService.verifyToken();
    } catch (error) {
      console.error('Token verification failed:', error.message);
      this.logout();
      throw error;
    }
  }

  static logout() {
    apiService.logout();
  }

  static isAuthenticated() {
    return apiService.isAuthenticated();
  }

  static getCurrentAdmin() {
    const adminUser = localStorage.getItem('adminUser');
    return adminUser ? JSON.parse(adminUser) : null;
  }

  static async changePassword(currentPassword, newPassword) {
    try {
      return await apiService.changePassword(currentPassword, newPassword);
    } catch (error) {
      console.error('Password change failed:', error.message);
      throw error;
    }
  }

  // ===== ADMIN MANAGEMENT METHODS =====
  static async getAdminUsers() {
    try {
      return await apiService.getAdminUsers();
    } catch (error) {
      console.error('Get admin users failed:', error.message);
      throw error;
    }
  }

  static async createAdminUser(email, password, role) {
    try {
      return await apiService.createAdminUser(email, password, role);
    } catch (error) {
      console.error('Create admin user failed:', error.message);
      throw error;
    }
  }

  static async deleteAdminUser(id) {
    try {
      return await apiService.deleteAdminUser(id);
    } catch (error) {
      console.error('Delete admin user failed:', error.message);
      throw error;
    }
  }

  // ===== COMMUNITY CACHE METHODS =====
  static async preloadAllCommunities() {
    try {
      const communities = await this.getCommunities();
      if (communities) {
        // Load full details for each community and cache them
        const preloadPromises = communities.map(async (community) => {
          const fullCommunity = await this.getCommunity(community.id);
          if (fullCommunity) {
            this.communityCache.set(community.id, fullCommunity);
          }
        });
        await Promise.all(preloadPromises);
      }
    } catch (error) {
      console.error('Error preloading communities:', error);
    }
  }

  static getCommunityFromCache(id) {
    return this.communityCache.get(id) || null;
  }

  static updateCommunityCache(community) {
    if (community && community.id) {
      this.communityCache.set(community.id, community);
    }
  }

  static deleteCommunityFromCache(id) {
    this.communityCache.delete(id);
  }

  // ===== COMMUNITY METHODS =====
  static async getCommunities() {
    try {
      return await apiService.getPublicCommunities();
    } catch (error) {
      console.error('API getCommunities failed:', error.message);
      // Fallback to localStorage
      return this.getCommunitiesFromLocalStorage();
    }
  }

  static async getCommunity(id) {
    try {
      return await apiService.getPublicCommunity(id);
    } catch (error) {
      console.error('API getCommunity failed:', error.message);
      return this.getCommunityFromLocalStorage(id);
    }
  }

  // ===== ADMIN COMMUNITY METHODS (Protected) =====
  static async getAdminCommunities() {
    try {
      return await apiService.getCommunities();
    } catch (error) {
      console.error('API getAdminCommunities failed:', error.message);
      throw error;
    }
  }

  static async getAdminCommunity(id) {
    try {
      return await apiService.getCommunity(id);
    } catch (error) {
      console.error('API getAdminCommunity failed:', error.message);
      throw error;
    }
  }

  static async saveCommunity(community) {
    try {
      let result;
      if (community.id && await apiService.getAdminCommunity(community.id)) {
        result = await apiService.updateCommunity(community.id, community);
      } else {
        result = await apiService.createCommunity(community);
      }
      // Update cache with the saved community
      if (result) {
        this.updateCommunityCache(result);
      }
      return result;
    } catch (error) {
      console.error('API saveCommunity failed:', error.message);
      const result = this.saveCommunityToLocalStorage(community);
      if (result) {
        this.updateCommunityCache(result);
      }
      return result;
    }
  }

  static async deleteCommunity(id) {
    try {
      const result = await apiService.deleteCommunity(id);
      // Remove from cache
      this.deleteCommunityFromCache(id);
      return result;
    } catch (error) {
      console.error('API deleteCommunity failed:', error.message);
      const result = this.deleteCommunityFromLocalStorage(id);
      if (result) {
        this.deleteCommunityFromCache(id);
      }
      return result;
    }
  }

  // ===== LISTING METHODS =====
  static async getListings() {
    try {
      return await apiService.getPublicListings();
    } catch (error) {
      console.error('API getListings failed:', error.message);
      return this.getListingsFromLocalStorage();
    }
  }

  static async getListing(id) {
    try {
      return await apiService.getPublicListing(id);
    } catch (error) {
      console.error('API getListing failed:', error.message);
      return this.getListingFromLocalStorage(id);
    }
  }

  // ===== ADMIN LISTING METHODS (Protected) =====
  static async getAdminListings() {
    try {
      return await apiService.getListings();
    } catch (error) {
      console.error('API getAdminListings failed:', error.message);
      throw error;
    }
  }

  static async getAdminListing(id) {
    try {
      return await apiService.getListing(id);
    } catch (error) {
      console.error('API getAdminListing failed:', error.message);
      throw error;
    }
  }

  static async saveListing(listing) {
    try {
      if (listing.id && await apiService.getAdminListing(listing.id)) {
        return await apiService.updateListing(listing.id, listing);
      } else {
        return await apiService.createListing(listing);
      }
    } catch (error) {
      console.error('API saveListing failed:', error.message);
      return this.saveListingToLocalStorage(listing);
    }
  }

  static async deleteListing(id) {
    try {
      return await apiService.deleteListing(id);
    } catch (error) {
      console.error('API deleteListing failed:', error.message);
      return this.deleteListingFromLocalStorage(id);
    }
  }

  static async getListingsByCommunity(communityId) {
    try {
      return await apiService.getPublicListings(communityId);
    } catch (error) {
      console.error('API getListingsByCommunity failed:', error.message);
      return this.getListingsByCommunityFromLocalStorage(communityId);
    }
  }

  // ===== PROPERTY METHODS =====
  static async getProperties() {
    try {
      return await apiService.getProperties();
    } catch (error) {
      console.error('API getProperties failed:', error.message);
      return this.getPropertiesFromLocalStorage();
    }
  }

  static async getProperty(id) {
    try {
      return await apiService.getProperty(id);
    } catch (error) {
      console.error('API getProperty failed:', error.message);
      return this.getPropertyFromLocalStorage(id);
    }
  }

  static async getAdminProperties() {
    try {
      return await apiService.getProperties();
    } catch (error) {
      console.error('API getAdminProperties failed:', error.message);
      throw error;
    }
  }

  static async getAdminProperty(id) {
    try {
      return await apiService.getProperty(id);
    } catch (error) {
      console.error('API getAdminProperty failed:', error.message);
      throw error;
    }
  }

  static async saveProperty(property) {
    try {
      if (property.id && await apiService.getProperty(property.id)) {
        return await apiService.updateProperty(property.id, property);
      } else {
        return await apiService.createProperty(property);
      }
    } catch (error) {
      console.error('API saveProperty failed:', error.message);
      return this.savePropertyToLocalStorage(property);
    }
  }

  static async deleteProperty(id) {
    try {
      return await apiService.deleteProperty(id);
    } catch (error) {
      console.error('API deleteProperty failed:', error.message);
      return this.deletePropertyFromLocalStorage(id);
    }
  }

  // ===== CONTACT METHODS =====
  static async getContacts() {
    try {
      return await apiService.getContacts();
    } catch (error) {
      console.error('API getContacts failed:', error.message);
      return this.getContactsFromLocalStorage();
    }
  }

  static async saveContact(contact) {
    try {
      return await apiService.createContact(contact);
    } catch (error) {
      console.error('API saveContact failed:', error.message);
      return this.saveContactToLocalStorage(contact);
    }
  }

  static async deleteContact(id) {
    try {
      return await apiService.deleteContact(id);
    } catch (error) {
      console.error('API deleteContact failed:', error.message);
      return this.deleteContactFromLocalStorage(id);
    }
  }

  static async clearAllContacts() {
    try {
      const contacts = await apiService.getContacts();
      await Promise.all(contacts.map(contact => apiService.deleteContact(contact.id)));
    } catch (error) {
      console.error('API clearAllContacts failed:', error.message);
      this.clearAllContactsFromLocalStorage();
    }
  }

  // ===== ADMIN CONTACT METHODS (Protected) =====
  static async getAdminContacts() {
    try {
      return await apiService.getContacts();
    } catch (error) {
      console.error('API getAdminContacts failed:', error.message);
      throw error;
    }
  }

  static async deleteAdminContact(id) {
    try {
      return await apiService.deleteContact(id);
    } catch (error) {
      console.error('API deleteAdminContact failed:', error.message);
      throw error;
    }
  }

  // ===== PUBLIC CONTACT METHODS =====
  static async createPublicContact(data) {
    try {
      return await apiService.createPublicContact(data);
    } catch (error) {
      console.error('API createPublicContact failed:', error.message);
      throw error;
    }
  }

  // ===== FALLBACK LOCALSTORAGE METHODS =====
  static getCommunitiesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('communities') || '[]');
  }

  static getCommunityFromLocalStorage(id) {
    const communities = this.getCommunitiesFromLocalStorage();
    return communities.find(community => community.id === id);
  }

  static saveCommunityToLocalStorage(community) {
    const communities = this.getCommunitiesFromLocalStorage();
    const index = communities.findIndex(c => c.id === community.id);
    
    if (index >= 0) {
      communities[index] = community;
    } else {
      communities.push(community);
    }
    
    localStorage.setItem('communities', JSON.stringify(communities));
    return community;
  }

  static deleteCommunityFromLocalStorage(id) {
    const communities = this.getCommunitiesFromLocalStorage();
    const filtered = communities.filter(c => c.id !== id);
    localStorage.setItem('communities', JSON.stringify(filtered));
  }

  static getListingsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('listings') || '[]');
  }

  static getListingFromLocalStorage(id) {
    const listings = this.getListingsFromLocalStorage();
    return listings.find(listing => listing.id === id);
  }

  static saveListingToLocalStorage(listing) {
    const listings = this.getListingsFromLocalStorage();
    const index = listings.findIndex(l => l.id === listing.id);
    
    if (index >= 0) {
      listings[index] = listing;
    } else {
      listings.push(listing);
    }
    
    localStorage.setItem('listings', JSON.stringify(listings));
    return listing;
  }

  static deleteListingFromLocalStorage(id) {
    const listings = this.getListingsFromLocalStorage();
    const filtered = listings.filter(l => l.id !== id);
    localStorage.setItem('listings', JSON.stringify(filtered));
  }

  static getListingsByCommunityFromLocalStorage(communityId) {
    const listings = this.getListingsFromLocalStorage();
    return listings.filter(listing => listing.communityId === communityId);
  }

  static getPropertiesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('properties') || '[]');
  }

  static getPropertyFromLocalStorage(id) {
    const properties = this.getPropertiesFromLocalStorage();
    return properties.find(property => property.id === id);
  }

  static savePropertyToLocalStorage(property) {
    const properties = this.getPropertiesFromLocalStorage();
    const index = properties.findIndex(p => p.id === property.id);
    
    if (index >= 0) {
      properties[index] = property;
    } else {
      properties.push(property);
    }
    
    localStorage.setItem('properties', JSON.stringify(properties));
    return property;
  }

  static deletePropertyFromLocalStorage(id) {
    const properties = this.getPropertiesFromLocalStorage();
    const filtered = properties.filter(p => p.id !== id);
    localStorage.setItem('properties', JSON.stringify(filtered));
  }

  static getContactsFromLocalStorage() {
    return JSON.parse(localStorage.getItem('contacts') || '[]');
  }

  static saveContactToLocalStorage(contact) {
    const contacts = this.getContactsFromLocalStorage();
    contacts.push(contact);
    localStorage.setItem('contacts', JSON.stringify(contacts));
    return contact;
  }

  static deleteContactFromLocalStorage(index) {
    const contacts = this.getContactsFromLocalStorage();
    contacts.splice(index, 1);
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }

  static clearAllContactsFromLocalStorage() {
    localStorage.removeItem('contacts');
  }

  // ===== INITIALIZATION =====
  static async initializeExampleData() {
    try {
      const communities = await this.getCommunities();
      if (communities.length === 0) {
        // Lazy load example data
        const { initializeExampleData } = await import('./exampleData.js');
        initializeExampleData();
      }
    } catch (error) {
      console.error('Error checking communities:', error.message);
    }
  }
}

export { apiService };
export default apiService; 