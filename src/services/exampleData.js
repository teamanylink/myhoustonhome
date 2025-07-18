// Example data for the application
// This is separated from the main data service to keep it lightweight

export const EXAMPLE_COMMUNITIES = [
  {
    id: 'riverstone',
    name: 'Riverstone',
    description: 'A master-planned community featuring beautiful homes, top-rated schools, and resort-style amenities.',
    location: 'Sugar Land, TX',
    priceRange: '$400K - $800K',
    image: '/images/communities/riverstone.jpg',
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
        subtitle: 'Your dream home awaits in this premier Sugar Land community',
        backgroundType: 'image', // 'color', 'image', 'video'
        backgroundColor: '#ffffff',
        backgroundImage: '/images/communities/riverstone.jpg',
        backgroundVideo: '',
        backgroundOpacity: 1.0,
        overlayColor: '#ffffff',
        overlayOpacity: 0.85
      },
      about: { 
        visible: true, 
        content: 'Riverstone offers the perfect blend of luxury living and family-friendly amenities. With over 200 acres of parks, lakes, and recreational facilities, this master-planned community provides an exceptional quality of life for residents of all ages.' 
      },
      homes: { visible: true, title: 'Available Home Models' },
      builders: { visible: true, title: 'Featured Builders' }
    }
  },
  {
    id: 'brookewater',
    name: 'Brookewater',
    description: 'Brookewater is an 850-acre master-planned community in Rosenberg, TX, offering elevated living with resort-style amenities, lakes, parks, and top builders. Zoned to Lamar CISD, Brookewater features a variety of home options and abundant green space for families and outdoor enthusiasts.',
    location: 'Rosenberg, TX',
    priceRange: '$300K - $600K+',
    image: '/images/communities/brookewater.jpg',
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
      primaryColor: '#1A73E8',
      borderRadius: '16px',
      borderRadiusLarge: '24px'
    },
    sections: {
      hero: {
        visible: true,
        title: 'Elevated Living in Rosenberg',
        subtitle: 'Discover Brookewater: 850 acres of parks, lakes, and resort-style amenities in Fort Bend County.',
        backgroundType: 'image',
        backgroundColor: '#ffffff',
        backgroundImage: '/images/communities/brookewater.jpg',
        backgroundVideo: '',
        backgroundOpacity: 1.0,
        overlayColor: '#ffffff',
        overlayOpacity: 0.85
      },
      about: {
        visible: true,
        content: 'Brookewater is a new master-planned community in Rosenberg, TX, featuring 2,400 single-family homes, a resort-style pool, over 200 acres of parks and open space, and top-rated schools in Lamar CISD. Enjoy lakes, walking trails, nature preserves, and a vibrant lifestyle close to Houston.'
      },
      homes: { visible: true, title: 'Available Home Models' },
      builders: { visible: true, title: 'Featured Builders' }
    }
  },
  {
    id: 'stonecreek-estates',
    name: 'StoneCreek Estates',
    description: 'StoneCreek Estates is a premier master-planned community in Richmond, TX, offering a blend of luxury and value with modern amenities, top builders, and a family-friendly environment. Residents enjoy parks, trails, community centers, and access to top-rated Lamar CISD schools, all within a beautifully landscaped setting.',
    location: 'Richmond, TX',
    priceRange: '$460K - $600K+',
    image: '/images/communities/stonecreek-estates.jpg',
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
        subtitle: 'Luxury living in Richmond, TX with top amenities and builders.',
        backgroundType: 'image',
        backgroundColor: '#ffffff',
        backgroundImage: '/images/communities/stonecreek-estates.jpg',
        backgroundVideo: '',
        backgroundOpacity: 1.0,
        overlayColor: '#ffffff',
        overlayOpacity: 0.85
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
    ]
  },
  {
    id: 'austin-point',
    name: 'Austin Point',
    description: 'Austin Point is a visionary 4,700-acre master-planned community in Fort Bend County, southwest of Houston. It features over 14,000 homes, extensive green spaces, modern amenities, and a vibrant mix of residential, commercial, and recreational opportunities. The community is designed for modern living, energy efficiency, and strong connectivity to Houston\'s urban core.',
    location: 'Fort Bend County, TX',
    priceRange: '$200K - $600K+',
    image: '/images/communities/austin-point.jpg',
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
      'DOE Zero Energy Ready Home™ & ENERGY STAR® standards'
    ],
    builders: [
      { name: 'CastleRock Communities', description: 'Quality homes with innovative designs', contact: '(281) 555-0130' },
      { name: 'Beazer Homes', description: 'Personalized homebuilding experience', contact: '(281) 555-0131' },
      { name: 'Perry Homes', description: 'Quality homes with innovative designs', contact: '(281) 555-0132' },
      { name: 'David Weekley Homes', description: 'Award-winning homebuilder with variety of floorplans', contact: '(281) 555-0133' }
    ],
    homes: [
      { name: 'Classic Series', bedrooms: 3, bathrooms: 2, sqft: 1157, price: 200000 },
      { name: 'Premier Series', bedrooms: 4, bathrooms: 3, sqft: 2900, price: 430000 }
    ],
    theme: {
      primaryColor: '#1A73E8',
      borderRadius: '16px',
      borderRadiusLarge: '24px'
    },
    sections: {
      hero: {
        visible: true,
        title: 'Welcome to Austin Point',
        subtitle: 'A visionary master-planned community in Fort Bend County, TX.',
        backgroundType: 'image',
        backgroundColor: '#ffffff',
        backgroundImage: '/images/communities/austin-point.jpg',
        backgroundVideo: '',
        backgroundOpacity: 1.0,
        overlayColor: '#ffffff',
        overlayOpacity: 0.85
      },
      about: {
        visible: true,
        content: 'Austin Point offers a dynamic lifestyle with vast green spaces, modern amenities, and a vibrant mix of homes and commercial opportunities. Enjoy energy-efficient living, top schools, and easy access to Houston.'
      },
      homes: { visible: true, title: 'Available Home Models' },
      builders: { visible: true, title: 'Featured Builders' }
    },
    schools: [
      'Lamar Consolidated ISD',
      'George Ranch High School',
      'Reading Jr. High School',
      'Velasquez Elementary School'
    ]
  },
  {
    id: 'emberly',
    name: 'Emberly',
    description: 'Emberly is a 933-acre master-planned community in Fort Bend County, designed for family-friendly living with a unique hometown charm. It features a dynamic lifestyle, year-round community events, modern amenities, and a diverse selection of homes from top builders. Residents enjoy resort-style amenities, energy-efficient homes, and access to top-rated schools, all within a vibrant, growing neighborhood.',
    location: 'Fort Bend County, TX',
    priceRange: 'High $200s - $500K+',
    image: '/images/communities/emberly.jpg',
    amenities: [
      'Resort-style pool & splash pad',
      'Event lawn for gatherings',
      'Dedicated dog park',
      'Pickleball courts',
      'Hiking & biking trails',
      'Community parks & playgrounds',
      'On-site Lifestyle Director',
      'Energy-efficient home technologies'
    ],
    builders: [
      { name: 'Lennar', description: 'Quality homes with innovative designs', contact: '(281) 555-0140' },
      { name: 'LGI Homes', description: 'Affordable luxury homes', contact: '(281) 555-0141' },
      { name: 'DSLD Homes', description: 'Custom home building experience', contact: '(281) 555-0142' },
      { name: 'Tricoast Homes', description: 'Modern home designs', contact: '(281) 555-0143' },
      { name: 'Davidson Homes', description: 'Family-focused home builder', contact: '(281) 555-0144' },
      { name: 'CastleRock Communities', description: 'Premium community builder', contact: '(281) 555-0145' }
    ],
    homes: [
      { name: 'Plan 1438', bedrooms: 3, bathrooms: 2, sqft: 1438, price: 269990 },
      { name: 'Plan 2817', bedrooms: 5, bathrooms: 3, sqft: 2817, price: 403207 }
    ],
    theme: {
      primaryColor: '#E4572E',
      borderRadius: '16px',
      borderRadiusLarge: '24px'
    },
    sections: {
      hero: {
        visible: true,
        title: 'Welcome to Emberly',
        subtitle: 'A vibrant, family-friendly master-planned community in Fort Bend County, TX.',
        backgroundType: 'image',
        backgroundColor: '#ffffff',
        backgroundImage: '/images/communities/emberly.jpg',
        backgroundVideo: '',
        backgroundOpacity: 1.0,
        overlayColor: '#ffffff',
        overlayOpacity: 0.85
      },
      about: {
        visible: true,
        content: 'Emberly offers a unique blend of modern amenities, community events, and quality homes from top builders. Enjoy resort-style living, energy-efficient homes, and a welcoming neighborhood atmosphere.'
      },
      homes: { visible: true, title: 'Available Home Models' },
      builders: { visible: true, title: 'Featured Builders' }
    },
    schools: [
      'Lamar CISD',
      'Beasley Elementary School',
      'Navarro Middle School',
      'George Junior High School',
      'Terry High School'
    ]
  },
  {
    id: 'indigo',
    name: 'Indigo',
    description: 'Indigo is a modern, master-planned community in Richmond, TX, designed for holistic living with a focus on walkability, green spaces, and vibrant amenities. Residents enjoy a blend of single-family homes, townhomes, and cottages from top builders, with access to lakes, trails, a working urban farm, and a lively town center. Indigo offers a lifestyle of inclusivity, sustainability, and connectivity, all within reach of Houston\'s best schools and attractions.',
    location: 'Richmond, TX',
    priceRange: '$278K - $600K+',
    image: '/images/communities/indigo.jpg',
    amenities: [
      'Town center with retail, dining, and event spaces',
      'Community gathering areas',
      'Walking, biking, jogging, and hiking trails',
      'Lake and fishing pond',
      '42-acre working urban farm',
      'Parks and open green spaces',
      'Proximity to Grand Parkway, shopping, and entertainment'
    ],
    builders: [
      { name: 'David Weekley Homes', description: 'Award-winning homebuilder with a variety of floorplans', contact: '(281) 555-0150' },
      { name: 'Highland Homes', description: 'Premier builder in the Houston metroplex', contact: '(281) 555-0151' },
      { name: 'Empire Communities', description: 'Modern, sustainable homes, mid $400Ks+', contact: '(281) 555-0152' }
    ],
    homes: [
      { name: 'Anders (35\' site)', bedrooms: 3, bathrooms: 2, sqft: 1600, price: 278000 },
      { name: 'Crowson (50\' site)', bedrooms: 4, bathrooms: 3, sqft: 2500, price: 459990 },
      { name: 'Bellini (40\' site)', bedrooms: 3, bathrooms: 2, sqft: 1800, price: 355990 },
      { name: 'Matisse (50\' site)', bedrooms: 4, bathrooms: 3, sqft: 2600, price: 468990 },
      { name: 'Cardinal (Cluster)', bedrooms: 3, bathrooms: 2, sqft: 1500, price: 300000 },
      { name: 'Ruby (Duet)', bedrooms: 3, bathrooms: 2, sqft: 1600, price: 320000 },
      { name: 'Maple (Townhome)', bedrooms: 3, bathrooms: 2, sqft: 1700, price: 330000 }
    ],
    theme: {
      primaryColor: '#2D6A4F',
      borderRadius: '16px',
      borderRadiusLarge: '24px'
    },
    sections: {
      hero: {
        visible: true,
        title: 'Welcome to Indigo',
        subtitle: 'A vibrant, connected master-planned community in Richmond, TX.',
        backgroundType: 'image',
        backgroundColor: '#ffffff',
        backgroundImage: '/images/communities/indigo.jpg',
        backgroundVideo: '',
        backgroundOpacity: 1.0,
        overlayColor: '#ffffff',
        overlayOpacity: 0.85
      },
      about: {
        visible: true,
        content: 'Indigo blends modern living, green spaces, and vibrant amenities for a lifestyle of inclusivity, sustainability, and connection. Enjoy lakes, trails, a working farm, and a lively town center—all close to Houston\'s best schools and attractions.'
      },
      homes: { visible: true, title: 'Available Home Models' },
      builders: { visible: true, title: 'Featured Builders' }
    },
    schools: [
      'Fort Bend ISD',
      'James Neill Elementary',
      'James Bowie Middle School',
      'Travis High School'
    ]
  }
];

export const EXAMPLE_LISTINGS = [
  {
    id: 'listing-1',
    title: 'Stunning 4BR Home in Riverstone',
    description: 'Beautiful single-family home featuring an open floor plan, gourmet kitchen with granite countertops, spacious master suite, and private backyard. Located in the prestigious Riverstone community with access to world-class amenities.',
    price: 485000,
    address: '1234 Riverstone Pkwy, Sugar Land, TX 77479',
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2650,
    communityId: 'riverstone',
    type: 'house',
    status: 'available',
    createdAt: new Date().toISOString()
  },
  {
    id: 'listing-2',
    title: 'Luxury 5BR Estate Home',
    description: 'Exceptional two-story home with premium finishes throughout. Features include a grand foyer, formal dining room, chef\'s kitchen with island, game room, and covered patio. Perfect for entertaining.',
    price: 675000,
    address: '5678 Riverstone Blvd, Sugar Land, TX 77479',
    bedrooms: 5,
    bathrooms: 4,
    sqft: 3450,
    communityId: 'riverstone',
    type: 'house',
    status: 'available',
    createdAt: new Date().toISOString()
  },
  {
    id: 'listing-3',
    title: 'Modern 3BR Townhome',
    description: 'Contemporary townhome with sleek design and premium amenities. Open concept living with high ceilings, modern kitchen, and rooftop terrace with community views.',
    price: 425000,
    address: '9012 Riverstone Way, Sugar Land, TX 77479',
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 2100,
    communityId: 'riverstone',
    type: 'townhome',
    status: 'available',
    createdAt: new Date().toISOString()
  }
];

// Function to initialize example data when needed
export function initializeExampleData() {
  const existingCommunities = JSON.parse(localStorage.getItem('communities') || '[]');
  
  if (existingCommunities.length === 0) {
    localStorage.setItem('communities', JSON.stringify(EXAMPLE_COMMUNITIES));
    localStorage.setItem('listings', JSON.stringify(EXAMPLE_LISTINGS));
    console.log('Example data initialized');
  }
} 