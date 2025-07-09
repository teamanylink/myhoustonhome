# MyHoustonHome - React + iOS Design System

A modern real estate listing platform for Houston built with React, Vite, and iOS design principles.

## Features

### 🏠 Core Functionality
- **Dynamic Community Pages** - Each community has customizable theming (colors, border radius)
- **Property Listings** - Detailed property information with contact forms
- **Admin Portal** - Complete content management system
- **Local Storage** - All data persisted locally (no database required)
- **Responsive Design** - Mobile-first approach with iOS design patterns

### 🎨 Design System
- **iOS Design Language** - Apple's Human Interface Guidelines
- **San Francisco Font Stack** - System fonts for native feel
- **Dynamic Theming** - Per-community color schemes and styling
- **Smooth Animations** - Framer Motion for fluid interactions
- **Dark Mode Support** - Automatic system preference detection

### 📱 User Experience
- **Section Visibility Controls** - Admin can show/hide community sections
- **Contact Management** - Built-in lead capture and management
- **Touch-Friendly Interface** - 44px minimum touch targets
- **Accessibility** - WCAG compliant design patterns

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

```bash
# Clone and navigate to project
cd myhoustonhome-react

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
src/
├── components/           # Reusable UI components
│   └── Navigation.jsx   # Main navigation bar
├── pages/               # Page components
│   ├── HomePage.jsx     # Landing page with communities/listings
│   ├── CommunityPage.jsx # Dynamic community pages
│   ├── ListingPage.jsx  # Property detail pages
│   └── AdminPage.jsx    # Admin management portal
├── services/            # Business logic and data management
│   └── dataService.js   # localStorage management, data models
├── styles/              # Design system
│   └── ios-design-system.css # Complete iOS-inspired CSS framework
└── App.jsx             # Main app with routing
```

## Usage Guide

### 1. Admin Portal (`/admin`)

**Communities Management:**
- Create/edit communities with custom themes
- Set primary colors and border radius per community
- Configure section visibility (hero, about, homes, builders)
- Manage amenities, builders, and home models

**Listings Management:**
- Add/edit property listings
- Associate listings with communities
- Set property details (beds, baths, sqft, price)
- Manage listing status

**Contact Management:**
- View all contact form submissions
- Track leads from property inquiries
- Export contact information

### 2. Public Pages

**Home Page (`/`):**
- Hero section with call-to-action
- Featured communities grid
- Latest listings showcase

**Community Pages (`/community/:id`):**
- Dynamic theming based on community settings
- Customizable sections (hero, about, homes, builders)
- Available listings in the community
- Contact forms for inquiries

**Listing Pages (`/listing/:id`):**
- Property details and specifications
- Community information
- Contact agent modal
- Schedule tour functionality

## Customization

### Theming System
Each community can have its own theme:

```javascript
theme: {
  primaryColor: '#34C759',      // Custom brand color
  borderRadius: '12px',         // Card border radius
  borderRadiusLarge: '20px'     // Large element radius
}
```

### Section Visibility
Control which sections appear on community pages:

```javascript
sections: {
  hero: { visible: true, title: 'Custom Title', subtitle: 'Custom Subtitle' },
  about: { visible: true, content: 'Custom content...' },
  homes: { visible: true, title: 'Available Homes' },
  builders: { visible: true, title: 'Our Builders' }
}
```

## iOS Design Principles

### Typography Scale
- **Large Title** (34px) - Hero headlines
- **Title 1** (28px) - Page titles
- **Title 2** (24px) - Section headers
- **Title 3** (22px) - Card titles
- **Headline** (20px) - Prices, important info
- **Body** (17px) - Main content
- **Callout** (16px) - Descriptions
- **Subheadline** (15px) - Labels
- **Footnote** (14px) - Secondary info
- **Caption** (12-13px) - Metadata

### Color System
- iOS Blue (#007AFF) - Primary actions
- iOS Green (#34C759) - Success states
- iOS Red (#FF3B30) - Errors/warnings
- Adaptive gray scale for text hierarchy
- Automatic dark mode support

### Interaction Patterns
- 44px minimum touch targets
- Subtle hover animations (scale, shadow)
- Smooth page transitions
- iOS-style form elements
- Modal presentations with backdrop blur

## Data Models

### Community
```javascript
{
  id: string,
  name: string,
  description: string,
  location: string,
  priceRange: string,
  amenities: array,
  builders: array,
  homes: array,
  theme: object,
  sections: object
}
```

### Listing
```javascript
{
  id: string,
  title: string,
  description: string,
  price: number,
  address: string,
  bedrooms: number,
  bathrooms: number,
  sqft: number,
  communityId: string,
  type: string,
  status: string
}
```

## Technologies Used

- **React 18** - Component framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Framer Motion** - Animation library
- **CSS Custom Properties** - Dynamic theming
- **Local Storage API** - Data persistence

## Browser Support

- Safari 14+
- Chrome 90+
- Firefox 88+
- Edge 90+

## License

This project is open source and available under the MIT License.

## Example Data

The application comes with one example community "Riverstone" in Sugar Land, TX with green theming to demonstrate all features.
