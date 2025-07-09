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

  // Initialize with example data if none exists
  static initializeExampleData() {
    const existingCommunities = this.getCommunities();
    if (existingCommunities.length === 0) {
      const exampleCommunity = new Community({
        id: 'riverstone',
        name: 'Riverstone',
        description: 'A master-planned community featuring beautiful homes, top-rated schools, and resort-style amenities.',
        location: 'Sugar Land, TX',
        priceRange: '$400K - $800K',
        amenities: ['Swimming Pool', 'Tennis Courts', 'Playground', 'Walking Trails', 'Clubhouse', 'Golf Course'],
        builders: [
          { name: 'Lennar', description: 'Quality homes with innovative designs', contact: '(281) 555-0123' },
          { name: 'KB Home', description: 'Personalized homebuilding experience', contact: '(281) 555-0124' }
        ],
        homes: [
          { name: 'The Madison', sqft: 2500, bedrooms: 4, bathrooms: 3, price: 450000 },
          { name: 'The Oakwood', sqft: 3200, bedrooms: 5, bathrooms: 4, price: 650000 }
        ],
        theme: {
          primaryColor: '#34C759',
          borderRadius: '16px',
          borderRadiusLarge: '24px'
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
      
      this.saveCommunity(exampleCommunity);
      
      // Add Brookewater community
      const brookewaterCommunity = new Community({
        id: 'brookewater',
        name: 'Brookewater',
        description: 'Brookewater is an 850-acre master-planned community in Rosenberg, TX, offering elevated living with resort-style amenities, lakes, parks, and top builders. Zoned to Lamar CISD, Brookewater features a variety of home options and abundant green space for families and outdoor enthusiasts.',
        location: 'Rosenberg, TX',
        priceRange: '$300K - $600K+',
        amenities: [
          'Resort-Style Pool',
          'Water Amenity',
          'Parks',
          'Recreation',
          'Lakes',
          'Open Space',
          'Walking Trails',
          'Nature Preserves',
          'Playgrounds'
        ],
        builders: [
          { name: 'Brightland Homes', description: 'Thoughtful design elements and quality construction.', contact: '' },
          { name: 'David Weekley Homes', description: 'Award-winning homebuilder with a variety of floorplans.', contact: '' },
          { name: 'Highland Homes', description: 'Premier builder in the Houston metroplex.', contact: '' },
          { name: 'Taylor Morrison', description: 'Build your dream home with Taylor Morrison.', contact: '' },
          { name: 'Chesmar Homes', description: 'Comfort, luxury, and convenience in every home.', contact: '' },
          { name: 'Perry Homes', description: 'Quality homes with innovative designs.', contact: '' },
          { name: 'Westin Homes', description: 'Luxury homes with elegant features.', contact: '' },
          { name: 'Ashton Woods', description: 'Personalized homebuilding experience.', contact: '' }
        ],
        homes: [
          { name: 'Premier - Beech', sqft: 1610, bedrooms: 3, bathrooms: 2, price: 309990 },
          { name: 'Premier - Mahogany', sqft: 1850, bedrooms: 3, bathrooms: 2, price: 323990 },
          { name: 'Premier - Palm', sqft: 1970, bedrooms: 4, bathrooms: 3, price: 332990 },
          { name: 'Premier - Laurel', sqft: 2020, bedrooms: 4, bathrooms: 2, price: 336990 },
          { name: 'Premier - Juniper', sqft: 2170, bedrooms: 5, bathrooms: 3, price: 349990 }
        ],
        theme: {
          primaryColor: '#1A73E8', // A blue shade for Brookewater
          borderRadius: '16px',
          borderRadiusLarge: '24px'
        },
        sections: {
          hero: {
            visible: true,
            title: 'Elevated Living in Rosenberg',
            subtitle: 'Discover Brookewater: 850 acres of parks, lakes, and resort-style amenities in Fort Bend County.'
          },
          about: {
            visible: true,
            content: 'Brookewater is a new master-planned community in Rosenberg, TX, featuring 2,400 single-family homes, a resort-style pool, over 200 acres of parks and open space, and top-rated schools in Lamar CISD. Enjoy lakes, walking trails, nature preserves, and a vibrant lifestyle close to Houston.'
          },
          homes: { visible: true, title: 'Available Home Models' },
          builders: { visible: true, title: 'Featured Builders' }
        }
      });
      this.saveCommunity(brookewaterCommunity);
      
      // Add example listings
      const exampleListings = [
        new Listing({
          title: 'Stunning 4BR Home in Riverstone',
          description: 'Beautiful single-family home featuring an open floor plan, gourmet kitchen with granite countertops, spacious master suite, and private backyard. Located in the prestigious Riverstone community with access to world-class amenities.',
          price: 485000,
          address: '1234 Riverstone Pkwy, Sugar Land, TX 77479',
          bedrooms: 4,
          bathrooms: 3,
          sqft: 2650,
          communityId: 'riverstone',
          type: 'house',
          status: 'available'
        }),
        new Listing({
          title: 'Luxury 5BR Estate Home',
          description: 'Exceptional two-story home with premium finishes throughout. Features include a grand foyer, formal dining room, chef\'s kitchen with island, game room, and covered patio. Perfect for entertaining.',
          price: 675000,
          address: '5678 Riverstone Blvd, Sugar Land, TX 77479',
          bedrooms: 5,
          bathrooms: 4,
          sqft: 3450,
          communityId: 'riverstone',
          type: 'house',
          status: 'available'
        }),
        new Listing({
          title: 'Modern 3BR Townhome',
          description: 'Contemporary townhome with sleek design and premium amenities. Open concept living with high ceilings, modern kitchen, and rooftop terrace with community views.',
          price: 425000,
          address: '9012 Riverstone Way, Sugar Land, TX 77479',
          bedrooms: 3,
          bathrooms: 2.5,
          sqft: 2100,
          communityId: 'riverstone',
          type: 'townhome',
          status: 'available'
        })
      ];
      
      exampleListings.forEach(listing => this.saveListing(listing));

      // Add StoneCreek Estates community
      const stonecreekEstatesCommunity = new Community({
        id: 'stonecreek-estates',
        name: 'StoneCreek Estates',
        description: 'StoneCreek Estates is a premier master-planned community in Richmond, TX, offering a blend of luxury and value with modern amenities, top builders, and a family-friendly environment. Residents enjoy parks, trails, community centers, and access to top-rated Lamar CISD schools, all within a beautifully landscaped setting.',
        location: 'Richmond, TX',
        priceRange: '$460K - $600K+',
        amenities: [
          'Parks & Green Spaces',
          'Walking/Biking Trails',
          'Community Center',
          'Playgrounds',
          'Sports Courts',
          'Fitness Center',
          'Event Venues',
          'Water Features',
          'Gated Access',
          'HOA & Community Patrol'
        ],
        builders: [
          { name: 'Toll Brothers', description: 'Luxury homes, upper $500Ks+', contact: '' },
          { name: 'Ashton Woods', description: 'Modern, sustainable homes, mid $400Ks+', contact: '' },
          { name: 'Perry Homes', description: '$460Ks+, wide variety', contact: '' }
        ],
        homes: [
          { name: '60\' Homesite', sqft: 2800, bedrooms: 4, bathrooms: 3, price: 580000 },
          { name: '50\' Homesite', sqft: 2300, bedrooms: 4, bathrooms: 3, price: 460000 }
        ],
        theme: {
          primaryColor: '#1A73E8',
          borderRadius: '16px',
          borderRadiusLarge: '24px'
        },
        sections: {
          hero: {
            visible: true,
            title: 'Welcome to StoneCreek Estates',
            subtitle: 'Luxury living in Richmond, TX with top amenities and builders.'
          },
          about: {
            visible: true,
            content: 'StoneCreek Estates offers a vibrant lifestyle with modern amenities, beautiful homes, and a strong sense of community. Enjoy parks, trails, and events, all in a safe, well-planned neighborhood.'
          },
          homes: { visible: true, title: 'Available Home Models' },
          builders: { visible: true, title: 'Featured Builders' }
        },
        schools: [
          'Don Carter Elementary',
          'Reading Jr High / Ryon Middle',
          'George Ranch High School'
        ],
        references: [
          'https://stonecreekestates.net/amenities/',
          'https://www.perryhomes.com/new-homes/texas/houston/stonecreek-estates/stonecreek-estates-60',
          'https://www.tollbrothers.com/luxury-homes-for-sale/Texas/Toll-Brothers-at-StoneCreek',
          'https://www.ashtonwoods.com/houston/stonecreek-estates',
          'https://myhoustonhome.org/community/stonecreek-estates'
        ]
      });
      this.saveCommunity(stonecreekEstatesCommunity);

      // Add Austin Point community
      const austinPointCommunity = new Community({
        id: 'austin-point',
        name: 'Austin Point',
        description: 'Austin Point is a visionary 4,700-acre master-planned community in Fort Bend County, southwest of Houston. It features over 14,000 homes, extensive green spaces, modern amenities, and a vibrant mix of residential, commercial, and recreational opportunities. The community is designed for modern living, energy efficiency, and strong connectivity to Houston’s urban core.',
        location: 'Fort Bend County, TX',
        priceRange: '$200K - $600K+',
        amenities: [
          '1,000 acres of parks & green spaces',
          'Jogging & biking trails',
          'Community parks',
          'Fitness centers',
          'Swimming pools',
          'Event & social gathering spaces',
          'Canal paths',
          'Commercial & mixed-use spaces',
          'Local cafés & retailers',
          'DOE Zero Energy Ready Home™ & ENERGY STAR® standards',
        ],
        builders: [
          'CastleRock Communities',
          'Beazer Homes',
          'Perry Homes',
          'David Weekley Homes',
        ],
        homes: [
          {
            name: 'Classic Series',
            bedrooms: 3,
            bathrooms: 2,
            sqft: 1157,
            price: '$200K+',
          },
          {
            name: 'Premier Series',
            bedrooms: 4,
            bathrooms: 3,
            sqft: 2900,
            price: '$430K+',
          },
        ],
        theme: {
          primaryColor: '#1A73E8',
          borderRadius: '16px',
          borderRadiusLarge: '24px',
        },
        sections: {
          hero: {
            visible: true,
            title: 'Welcome to Austin Point',
            subtitle: 'A visionary master-planned community in Fort Bend County, TX.',
          },
          about: {
            visible: true,
            content: 'Austin Point offers a dynamic lifestyle with vast green spaces, modern amenities, and a vibrant mix of homes and commercial opportunities. Enjoy energy-efficient living, top schools, and easy access to Houston.',
          },
          homes: {
            visible: true,
            title: 'Available Home Models',
          },
          builders: {
            visible: true,
            title: 'Featured Builders',
          },
        },
        schools: [
          'Lamar Consolidated ISD',
          'George Ranch High School',
          'Reading Jr. High School',
          'Velasquez Elementary School',
        ],
        references: [
          'https://www.austinpoint.com/',
          'https://www.signorellicompany.com/austin-point',
          'https://www.c-rock.com/community-detail/austin-point',
          'https://www.beazer.com/houston-tx/austin-point',
          'https://www.perryhomes.com/new-homes/texas/houston/austin-point',
          'https://www.davidweekleyhomes.com/new-homes/tx/houston/richmond/austin-point',
        ],
      });
      this.saveCommunity(austinPointCommunity);

      // Add Emberly community
      const emberlyCommunity = new Community({
        id: 'emberly',
        name: 'Emberly',
        description: 'Emberly is a 933-acre master-planned community in Fort Bend County, designed for family-friendly living with a unique hometown charm. It features a dynamic lifestyle, year-round community events, modern amenities, and a diverse selection of homes from top builders. Residents enjoy resort-style amenities, energy-efficient homes, and access to top-rated schools, all within a vibrant, growing neighborhood.',
        location: 'Fort Bend County, TX',
        priceRange: 'High $200s - $500K+',
        amenities: [
          'Resort-style pool & splash pad',
          'Event lawn for gatherings',
          'Dedicated dog park',
          'Pickleball courts',
          'Hiking & biking trails',
          'Community parks & playgrounds',
          'On-site Lifestyle Director',
          'Energy-efficient home technologies',
        ],
        builders: [
          'Lennar',
          'LGI Homes',
          'DSLD Homes',
          'Tricoast Homes',
          'Davidson Homes',
          'CastleRock Communities',
        ],
        homes: [
          {
            name: 'Plan 1438',
            bedrooms: 3,
            bathrooms: 2,
            sqft: 1438,
            price: '$269,990+',
          },
          {
            name: 'Plan 2817',
            bedrooms: 5,
            bathrooms: 3,
            sqft: 2817,
            price: '$403,207+',
          },
        ],
        theme: {
          primaryColor: '#E4572E',
          borderRadius: '16px',
          borderRadiusLarge: '24px',
        },
        sections: {
          hero: {
            visible: true,
            title: 'Welcome to Emberly',
            subtitle: 'A vibrant, family-friendly master-planned community in Fort Bend County, TX.',
          },
          about: {
            visible: true,
            content: 'Emberly offers a unique blend of modern amenities, community events, and quality homes from top builders. Enjoy resort-style living, energy-efficient homes, and a welcoming neighborhood atmosphere.',
          },
          homes: {
            visible: true,
            title: 'Available Home Models',
          },
          builders: {
            visible: true,
            title: 'Featured Builders',
          },
        },
        schools: [
          'Lamar CISD',
          'Beasley Elementary School',
          'Navarro Middle School',
          'George Junior High School',
          'Terry High School',
        ],
        references: [
          'https://emberlytexas.com/',
          'https://www.davidsonhomes.com/states/texas/houston-market-area/beasley/emberly',
          'https://www.lgihomes.com/texas/houston/emberly',
          'https://www.tricoasthomes.com/communities/beasley-tx/emberly-45',
          'https://www.dsldhomes.com/communities/texas/houston/emberly',
        ],
      });
      this.saveCommunity(emberlyCommunity);

      // Add Indigo community
      const indigoCommunity = new Community({
        id: 'indigo',
        name: 'Indigo',
        description: 'Indigo is a modern, master-planned community in Richmond, TX, designed for holistic living with a focus on walkability, green spaces, and vibrant amenities. Residents enjoy a blend of single-family homes, townhomes, and cottages from top builders, with access to lakes, trails, a working urban farm, and a lively town center. Indigo offers a lifestyle of inclusivity, sustainability, and connectivity, all within reach of Houston’s best schools and attractions.',
        location: 'Richmond, TX',
        priceRange: '$278K - $600K+',
        amenities: [
          'Town center with retail, dining, and event spaces',
          'Community gathering areas',
          'Walking, biking, jogging, and hiking trails',
          'Lake and fishing pond',
          '42-acre working urban farm',
          'Parks and open green spaces',
          'Proximity to Grand Parkway, shopping, and entertainment',
        ],
        builders: [
          { name: 'David Weekley Homes', description: 'Award-winning homebuilder with a variety of floorplans.', contact: '' },
          { name: 'Highland Homes', description: 'Premier builder in the Houston metroplex.', contact: '' },
          { name: 'Empire Communities', description: 'Modern, sustainable homes, mid $400Ks+', contact: '' }
        ],
        homes: [
          {
            name: 'Anders (35’ site)',
            bedrooms: 3,
            bathrooms: 2,
            sqft: 1600,
            price: '$278,000+',
          },
          {
            name: 'Crowson (50’ site)',
            bedrooms: 4,
            bathrooms: 3,
            sqft: 2500,
            price: '$459,990+',
          },
          {
            name: 'Bellini (40’ site)',
            bedrooms: 3,
            bathrooms: 2,
            sqft: 1800,
            price: '$355,990+',
          },
          {
            name: 'Matisse (50’ site)',
            bedrooms: 4,
            bathrooms: 3,
            sqft: 2600,
            price: '$468,990+',
          },
          {
            name: 'Cardinal (Cluster)',
            bedrooms: 3,
            bathrooms: 2,
            sqft: 1500,
            price: '$300,000+',
          },
          {
            name: 'Ruby (Duet)',
            bedrooms: 3,
            bathrooms: 2,
            sqft: 1600,
            price: '$320,000+',
          },
          {
            name: 'Maple (Townhome)',
            bedrooms: 3,
            bathrooms: 2,
            sqft: 1700,
            price: '$330,000+',
          },
        ],
        theme: {
          primaryColor: '#2D6A4F',
          borderRadius: '16px',
          borderRadiusLarge: '24px',
        },
        sections: {
          hero: {
            visible: true,
            title: 'Welcome to Indigo',
            subtitle: 'A vibrant, connected master-planned community in Richmond, TX.',
          },
          about: {
            visible: true,
            content: 'Indigo blends modern living, green spaces, and vibrant amenities for a lifestyle of inclusivity, sustainability, and connection. Enjoy lakes, trails, a working farm, and a lively town center—all close to Houston’s best schools and attractions.',
          },
          homes: {
            visible: true,
            title: 'Available Home Models',
          },
          builders: {
            visible: true,
            title: 'Featured Builders',
          },
        },
        schools: [
          'Fort Bend ISD',
          'James Neill Elementary',
          'James Bowie Middle School',
          'Travis High School',
        ],
        references: [
          'https://www.indigocommunity.com/',
          'https://jome.com/master-planned-community/tx/2047-indigo',
          'https://empirecommunities.com/houston/community/indigo/community/',
          'https://www.highlandhomes.com/houston/richmond/indigo/50ft-lots/section',
          'https://www.davidweekleyhomes.com/',
          'https://www.facebook.com/thefranklinteamhouston/videos/',
        ],
      });
      this.saveCommunity(indigoCommunity);
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