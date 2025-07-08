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
class Community {
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
            primaryColor: '#1976d2',
            borderRadius: '8px',
            borderRadiusLarge: '16px'
        };
        this.sections = data.sections || {
            hero: { visible: true, title: '', subtitle: '' },
            about: { visible: true, content: '' },
            homes: { visible: true, title: 'Available Homes' },
            builders: { visible: true, title: 'Our Builders' }
        };
        this.createdAt = data.createdAt || new Date().toISOString();
    }
}

class Listing {
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

// Data service
class DataService {
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
}

// UI utilities
class UIUtils {
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

    static createCard(type, item) {
        const card = document.createElement('div');
        card.className = `${type}-card`;
        card.onclick = () => this.navigateTo(type, item.id);
        
        if (type === 'community') {
            card.innerHTML = `
                <h3 class="card-title">${item.name}</h3>
                <p class="card-subtitle">${item.location}</p>
                <p class="card-description">${item.description}</p>
                <div class="card-meta">
                    <div class="card-meta-item">
                        <span class="material-icons">home</span>
                        <span>${item.homes.length} homes</span>
                    </div>
                    <div class="card-meta-item">
                        <span class="material-icons">business</span>
                        <span>${item.builders.length} builders</span>
                    </div>
                </div>
                <div class="card-price">${item.priceRange}</div>
            `;
        } else if (type === 'listing') {
            card.innerHTML = `
                <h3 class="card-title">${item.title}</h3>
                <p class="card-subtitle">${item.address}</p>
                <p class="card-description">${item.description}</p>
                <div class="card-meta">
                    <div class="card-meta-item">
                        <span class="material-icons">hotel</span>
                        <span>${item.bedrooms} bed</span>
                    </div>
                    <div class="card-meta-item">
                        <span class="material-icons">bathtub</span>
                        <span>${item.bathrooms} bath</span>
                    </div>
                    <div class="card-meta-item">
                        <span class="material-icons">square_foot</span>
                        <span>${item.sqft.toLocaleString()} sqft</span>
                    </div>
                </div>
                <div class="card-price">${this.formatPrice(item.price)}</div>
            `;
        }
        
        return card;
    }

    static navigateTo(type, id) {
        if (type === 'community') {
            window.location.href = `community.html?id=${id}`;
        } else if (type === 'listing') {
            window.location.href = `listing.html?id=${id}`;
        }
    }

    static showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 16px 24px;
            border-radius: 8px;
            color: white;
            font-weight: 500;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            transform: translateX(100%);
            transition: transform 0.3s ease;
        `;
        
        if (type === 'success') {
            notification.style.backgroundColor = '#4caf50';
        } else if (type === 'error') {
            notification.style.backgroundColor = '#f44336';
        }
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Main application logic
class App {
    constructor() {
        this.init();
    }

    init() {
        this.initializeExampleData();
        this.renderContent();
        this.setupEventListeners();
    }

    initializeExampleData() {
        // Only create example data if none exists
        const existingCommunities = DataService.getCommunities();
        if (existingCommunities.length === 0) {
            const exampleCommunity = new Community({
                name: 'Riverstone',
                description: 'A master-planned community featuring beautiful homes, top-rated schools, and resort-style amenities.',
                location: 'Sugar Land, TX',
                priceRange: '$400K - $800K',
                amenities: ['Swimming Pool', 'Tennis Courts', 'Playground', 'Walking Trails', 'Clubhouse'],
                builders: [
                    { name: 'Lennar', description: 'Quality homes with innovative designs', contact: '(281) 555-0123' },
                    { name: 'KB Home', description: 'Personalized homebuilding experience', contact: '(281) 555-0124' }
                ],
                homes: [
                    { name: 'The Madison', sqft: 2500, bedrooms: 4, bathrooms: 3, price: 450000 },
                    { name: 'The Oakwood', sqft: 3200, bedrooms: 5, bathrooms: 4, price: 650000 }
                ],
                theme: {
                    primaryColor: '#2e7d32',
                    borderRadius: '12px',
                    borderRadiusLarge: '20px'
                },
                sections: {
                    hero: { 
                        visible: true, 
                        title: 'Welcome to Riverstone', 
                        subtitle: 'Your dream home awaits in this premier Sugar Land community' 
                    },
                    about: { 
                        visible: true, 
                        content: 'Riverstone offers the perfect blend of luxury living and family-friendly amenities. With over 200 acres of parks, lakes, and recreational facilities, this master-planned community provides an exceptional quality of life for residents of all ages.' 
                    },
                    homes: { visible: true, title: 'Available Home Models' },
                    builders: { visible: true, title: 'Featured Builders' }
                }
            });
            
            DataService.saveCommunity(exampleCommunity);
        }
    }

    renderContent() {
        this.renderCommunities();
        this.renderListings();
    }

    renderCommunities() {
        const communitiesGrid = document.getElementById('communities-grid');
        if (!communitiesGrid) return;
        
        const communities = DataService.getCommunities();
        communitiesGrid.innerHTML = '';
        
        communities.forEach(community => {
            const card = UIUtils.createCard('community', community);
            communitiesGrid.appendChild(card);
        });
    }

    renderListings() {
        const listingsGrid = document.getElementById('listings-grid');
        if (!listingsGrid) return;
        
        const listings = DataService.getListings();
        listingsGrid.innerHTML = '';
        
        listings.forEach(listing => {
            const card = UIUtils.createCard('listing', listing);
            listingsGrid.appendChild(card);
        });
    }

    setupEventListeners() {
        // Navigation smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(anchor.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
}

// Navigation functions
function navigateToSection(section) {
    const element = document.getElementById(section);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new App();
});

// Export for use in other files
window.DataService = DataService;
window.UIUtils = UIUtils;
window.Community = Community;
window.Listing = Listing; 