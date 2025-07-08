# MyHoustonHome - Real Estate Listing Platform

A modern, responsive real estate listing platform built with vanilla HTML, CSS, and JavaScript. The platform helps people identify the best communities and properties in Houston with a comprehensive admin portal for content management.

## Features

### 🏠 Core Functionality
- **Dynamic Community Pages**: Each community has its own themed page with customizable sections
- **Property Listings**: Detailed property information with contact forms
- **Admin Portal**: Comprehensive backend for managing communities and listings
- **Local Storage**: All data persisted in browser local storage (no database required)
- **Responsive Design**: Mobile-first approach with Material Design principles

### 🎨 Design Features
- **Material Design**: Modern UI with elevation shadows, proper spacing, and typography
- **Theme System**: Each community can have its own color scheme and border radius settings
- **Subtle Animations**: Smooth transitions and hover effects
- **Clean Typography**: Google Fonts (Roboto) for professional appearance
- **Accessibility**: Proper contrast ratios and keyboard navigation

### 🔧 Admin Features
- **Community Management**: Add, edit, and delete communities
- **Listing Management**: Create and manage property listings
- **Section Visibility**: Show/hide sections for each community
- **Theme Customization**: Set primary colors and border radius per community
- **Contact Management**: View and manage contact inquiries
- **Dynamic Content**: Add builders and home models to communities

## File Structure

```
├── index.html              # Main landing page
├── community.html          # Dynamic community page template
├── listing.html            # Dynamic listing page template
├── admin.html              # Admin portal
├── styles.css              # Main stylesheet with Material Design
├── script.js               # Core application logic and data services
├── community.js            # Community page controller
├── listing.js              # Listing page controller
├── admin.js                # Admin panel functionality
└── README.md               # This file
```

## Getting Started

1. **Clone or download** the project files
2. **Open index.html** in a web browser
3. **Access the admin portal** by clicking "Admin" in the navigation
4. **Add communities and listings** through the admin interface

## Page Overview

### Main Landing Page (`index.html`)
- Hero section with call-to-action buttons
- Featured communities grid
- Recent listings grid
- Smooth scrolling navigation

### Community Pages (`community.html`)
- Large hero section with community branding
- About section with amenities
- Available home models
- Featured builders
- Customizable theming per community
- Sections can be hidden/shown by admin

### Listing Pages (`listing.html`)
- Property details and specifications
- Contact form with pre-populated message
- Community information (if applicable)
- Responsive layout with sticky sidebar

### Admin Portal (`admin.html`)
- Three main sections: Communities, Listings, Contacts
- Rich form interfaces for content management
- Live preview of theme changes
- Dynamic form elements for builders and homes

## Data Models

### Community
- Basic information (name, location, description)
- Theme settings (colors, border radius)
- Section visibility controls
- Builders and home models
- Amenities list

### Listing
- Property details (title, address, description)
- Specifications (bedrooms, bathrooms, square footage)
- Pricing and status
- Optional community association

## Theme System

Each community can have its own theme with:
- **Primary Color**: Used for buttons, icons, and accents
- **Border Radius**: Controls corner rounding (small, medium, large, extra large)
- **Section Visibility**: Individual control over hero, about, homes, and builders sections

## Local Storage Structure

Data is stored in browser localStorage with the following keys:
- `communities`: Array of community objects
- `listings`: Array of listing objects
- `contacts`: Array of contact inquiry objects

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design works on all screen sizes

## Customization

### Adding New Themes
1. Open admin portal
2. Edit community settings
3. Choose new primary color
4. Select border radius preferences
5. Toggle section visibility

### Modifying Styles
- Edit `styles.css` for global changes
- CSS custom properties (variables) used throughout
- Material Design color palette implemented

### Extending Functionality
- Add new data models in `script.js`
- Create new page templates following existing patterns
- Extend admin forms for additional fields

## Example Data

The application includes one example community "Riverstone" with:
- Green color theme (#2e7d32)
- Larger border radius (12px/20px)
- Two builders (Lennar, KB Home)
- Two home models (The Madison, The Oakwood)
- Multiple amenities

## Security Note

This is a client-side application using localStorage. In a production environment, you would want to:
- Add server-side data persistence
- Implement user authentication
- Add form validation and sanitization
- Use HTTPS for all communications

## Future Enhancements

- Search and filtering functionality
- Map integration for property locations
- Photo galleries for properties
- User favorites and saved searches
- Email notifications for new listings
- Advanced reporting and analytics

## License

This project is provided as-is for educational and demonstration purposes. 