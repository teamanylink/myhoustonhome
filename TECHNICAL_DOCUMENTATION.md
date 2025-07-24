# MyHoustonHome - Technical Documentation

## 📋 Application Overview

**MyHoustonHome** is a modern real estate platform designed to showcase Houston-area communities and property listings. The application provides a comprehensive solution for real estate marketing with dynamic community pages, property management, and lead generation capabilities.

### 🎯 Core Purpose
- **Public-facing website** for potential homebuyers to explore communities and properties
- **Admin management system** for real estate agents and content managers
- **Lead generation platform** with contact form management
- **Dynamic theming system** allowing per-community branding customization

### 🏗️ Architecture
- **Frontend**: React SPA (Single Page Application) 
- **Backend**: Express.js API server
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Vercel (Serverless)
- **Data Flow**: RESTful API with JSON responses

---

## 🛠️ Technology Stack

### **Frontend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.1.0 | Component framework and UI library |
| **Vite** | 7.0.3 | Build tool and development server |
| **React Router** | 7.6.3 | Client-side routing and navigation |
| **Framer Motion** | 12.23.0 | Animation library for smooth interactions |
| **Tailwind CSS** | Custom | iOS-inspired design system |

### **Backend Technologies**
| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18.x | JavaScript runtime environment |
| **Express.js** | 5.1.0 | Web framework for API endpoints |
| **Prisma** | 6.12.0 | Database ORM and client |
| **PostgreSQL** | Latest | Primary database |
| **JWT** | 9.0.2 | Authentication tokens |
| **bcrypt** | 6.0.0 | Password hashing |

### **Infrastructure & Deployment**
| Technology | Purpose |
|------------|---------|
| **Vercel** | Serverless hosting platform |
| **Vercel Postgres** | Database hosting |
| **Vercel Blob** | File storage for images |

---

## 📊 Database Structure

### **Core Models**

#### **1. Community Model**
```sql
Table: communities
- id (String, Primary Key)           -- Unique community identifier
- name (String)                      -- Community display name
- description (Text)                 -- Marketing description
- location (String)                  -- Geographic location
- priceRange (String)                -- Price range (e.g., "$400K - $800K")
- image (String)                     -- Main community image URL
- amenities (String[])               -- Array of community features
- theme (JSON)                       -- Dynamic theming configuration
- sections (JSON)                    -- Page section visibility settings
- schools (String[])                 -- Associated school districts
- references (String[])              -- External reference URLs
- createdAt (DateTime)               -- Record creation timestamp
- updatedAt (DateTime)               -- Last modification timestamp
```

#### **2. Builder Model**
```sql
Table: builders
- id (String, Primary Key, CUID)     -- Unique builder identifier
- name (String)                      -- Builder company name
- description (String, Optional)     -- Builder description
- contact (String, Optional)         -- Contact information
- image (String, Optional)           -- Builder logo/image
- website (String, Optional)         -- Builder website URL
- communityId (String, Foreign Key)  -- Associated community
```

#### **3. Home Model**
```sql
Table: homes
- id (String, Primary Key, CUID)     -- Unique home model identifier
- name (String)                      -- Home model name
- sqft (Integer)                     -- Square footage
- bedrooms (Integer)                 -- Number of bedrooms
- bathrooms (Float)                  -- Number of bathrooms (allows .5)
- price (Integer)                    -- Base price in dollars
- image (String, Optional)           -- Model home image
- features (String[])                -- Array of home features
- communityId (String, Foreign Key)  -- Associated community
- builderId (String, Foreign Key)    -- Associated builder
- createdAt (DateTime)               -- Record creation timestamp
- updatedAt (DateTime)               -- Last modification timestamp
```

#### **4. Listing Model**
```sql
Table: listings
- id (String, Primary Key, CUID)     -- Unique listing identifier
- title (String)                     -- Listing title
- description (Text)                 -- Detailed description
- price (Integer)                    -- Listing price in dollars
- address (String)                   -- Property address
- bedrooms (Integer)                 -- Number of bedrooms
- bathrooms (Float)                  -- Number of bathrooms
- sqft (Integer)                     -- Square footage
- type (Enum)                        -- HOUSE, TOWNHOME, CONDO, APARTMENT
- status (Enum)                      -- AVAILABLE, PENDING, SOLD, UNAVAILABLE
- images (String[])                  -- Array of image URLs
- features (String[])                -- Array of property features
- communityId (String, Foreign Key)  -- Associated community (optional)
- createdAt (DateTime)               -- Record creation timestamp
- updatedAt (DateTime)               -- Last modification timestamp
```

#### **5. Contact Model** ⚠️ **CRITICAL FOR LEAD MANAGEMENT**
```sql
Table: contacts
- id (String, Primary Key, CUID)     -- Unique contact identifier
- name (String)                      -- Contact full name
- email (String)                     -- Contact email address
- phone (String, Optional)           -- Contact phone number
- message (Text)                     -- Contact message/inquiry
- source (String, Optional)          -- Lead source tracking
- createdAt (DateTime)               -- Submission timestamp
```

---

## 🔐 Admin Backend Features

### **Authentication System**
- **JWT-based authentication** with secure token management
- **Default admin account**: `denis@denvagroup.com` (Password: `TempPassword123!`)
- **Session management** with automatic token refresh
- **Protected routes** requiring authentication for admin functions

### **Admin Dashboard (`/admin`)**
#### **Overview Statistics**
- Total communities count
- Total properties/listings count
- Recent activity log
- System health indicators

### **Community Management (`/admin/communities`)**
#### **✅ Features to Monitor:**
- **Community Creation/Editing**
  - Basic information (name, description, location, price range)
  - Theme customization (colors, border radius, fonts)
  - Section visibility controls
  - Amenities management
  - School district associations
  
- **Builder Management**
  - Add/edit builders per community
  - Contact information management
  - Builder-home associations
  
- **Home Models Management**
  - Create home floor plans
  - Pricing and specifications
  - Feature listings
  - Image uploads

#### **⚠️ Critical Checks Needed:**
1. **Data Sync**: Ensure all community updates properly save to PostgreSQL
2. **Theme Application**: Verify theme changes reflect on public pages
3. **Image Uploads**: Confirm images upload to Vercel Blob storage
4. **Relationships**: Validate builder-community and home-community associations

### **Listings Management (`/admin/listings`)**
#### **✅ Features to Monitor:**
- **Property Listing Creation/Editing**
  - Property details and specifications
  - Image gallery management
  - Status updates (Available, Pending, Sold)
  - Community associations
  
#### **⚠️ Critical Checks Needed:**
1. **Status Updates**: Ensure listing status changes reflect immediately
2. **Search Functionality**: Verify filtering and search work correctly
3. **Image Management**: Confirm multiple image uploads function properly

### **Contact Management (`/admin/contacts`)**
#### **✅ Features to Monitor:**
- **Lead Viewing**: Display all contact form submissions
- **Contact Details**: Name, email, phone, message, submission date
- **Lead Source Tracking**: Track which community/listing generated the lead
- **Contact Deletion**: Remove spam or test submissions

#### **⚠️ Critical Checks Needed:**
1. **Real-time Updates**: New contacts should appear immediately
2. **Data Integrity**: All form fields should save correctly
3. **Export Functionality**: Ability to export contact data for CRM integration

---

## 📝 Contact Form Integration & Database Sync

### **Contact Form Locations**
1. **Community Pages** (`/community/:id`) - Interest in specific communities
2. **Listing Pages** (`/listing/:id`) - Property-specific inquiries
3. **General Contact** (Home page footer) - General inquiries

### **Data Flow Process**
```
User Fills Form → Frontend Validation → API Call → Database Save → Admin Dashboard
```

### **Contact Form Fields**
```javascript
{
  name: String,          // Required - Full name
  email: String,         // Required - Email (validated format)
  phone: String,         // Optional - Phone number
  message: String,       // Required - Inquiry message
  interest: String,      // Auto-populated with community/listing name
  source: String         // Tracking field (community ID, listing ID, etc.)
}
```

### **⚠️ CRITICAL DATABASE SYNC REQUIREMENTS**

#### **1. Contact Form Submission Process**
- **API Endpoint**: `POST /api/contacts`
- **Authentication**: **NO AUTH REQUIRED** (public endpoint)
- **Database Service**: `DatabaseService.createContact()`
- **Response**: Success confirmation with contact ID

#### **2. Data Validation Requirements**
- **Name**: Must be non-empty string
- **Email**: Must pass regex validation `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- **Message**: Must be non-empty string
- **Phone**: Optional, no validation required
- **Source**: Auto-populated based on form location

#### **3. Admin Backend Integration**
- **Viewing Contacts**: `GET /api/contacts` (requires admin auth)
- **Contact Display**: Show in admin dashboard with formatting
- **Delete Contacts**: `DELETE /api/contacts/:id` (admin only)
- **Real-time Updates**: New contacts should appear without page refresh

#### **4. Essential Monitoring Points**

**🔍 Weekly Checks Required:**
1. **Form Submissions**: Test contact forms from all pages
2. **Database Storage**: Verify contacts save to PostgreSQL `contacts` table
3. **Admin Visibility**: Confirm new contacts appear in admin dashboard
4. **Email Notifications**: Check if email alerts to agents are working
5. **Data Export**: Test ability to export contact data

**🚨 Critical Failure Points:**
- **Form submission errors** → Lost leads
- **Database connection issues** → Data loss
- **Admin dashboard not updating** → Missed opportunities
- **Email validation failures** → Invalid contact data

#### **5. Integration Testing Checklist**

**✅ Daily Verification:**
- [ ] Submit test contact from community page
- [ ] Verify contact appears in admin dashboard
- [ ] Check all form fields save correctly
- [ ] Test contact deletion from admin

**✅ Weekly Verification:**
- [ ] Test contact forms from all page types
- [ ] Verify source tracking works correctly
- [ ] Check database performance with multiple contacts
- [ ] Test admin search/filter functionality

**✅ Monthly Verification:**
- [ ] Export contact data and verify completeness
- [ ] Check database storage limits
- [ ] Verify contact form spam protection
- [ ] Test backup and recovery procedures

---

## 🚀 Deployment & Environment

### **Production Environment**
- **Frontend**: Deployed on Vercel serverless
- **API**: Serverless functions on Vercel
- **Database**: Vercel Postgres with connection pooling
- **Storage**: Vercel Blob for image assets

### **Environment Variables Required**
```bash
DATABASE_URL=postgresql://...           # Postgres connection string
JWT_SECRET=your-secret-key             # JWT signing secret
ADMIN_EMAIL=denis@denvagroup.com       # Default admin email
ADMIN_PASSWORD=TempPassword123!        # Default admin password (change immediately)
```

### **Development Setup**
```bash
# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Push database schema
npx prisma db push

# Start development servers
npm run dev        # Frontend (Vite)
npm run api        # Backend (Express)
```

---

## 📈 Performance & Monitoring

### **Key Metrics to Track**
1. **Contact Form Conversion Rate**
2. **Page Load Times** (especially community pages)
3. **Database Query Performance**
4. **API Response Times**
5. **Error Rates** in contact submissions

### **Backup Strategy**
- **Database**: Automated daily backups via Vercel
- **Code**: Version controlled via GitHub
- **Images**: Stored in Vercel Blob with CDN

---

## 🆘 Troubleshooting Common Issues

### **Contact Form Issues**
1. **Forms not submitting**: Check API endpoint connectivity
2. **Contacts not appearing in admin**: Verify database connection
3. **Missing form data**: Check frontend validation logic

### **Admin Dashboard Issues**
1. **Login failures**: Verify JWT token generation
2. **Data not loading**: Check authentication headers
3. **Updates not saving**: Verify Prisma client connection

### **Community Page Issues**
1. **Theme not applying**: Check CSS variable injection
2. **Images not loading**: Verify Vercel Blob configuration
3. **Content not updating**: Check cache invalidation

---

## 📞 Support & Maintenance

### **Critical Contact Points**
- **Database Issues**: Monitor PostgreSQL connection health
- **Form Submissions**: Set up alerts for submission failures
- **Admin Access**: Ensure admin credentials remain secure
- **API Performance**: Monitor response times and error rates

### **Regular Maintenance Tasks**
- **Weekly**: Review contact submissions and test forms
- **Monthly**: Update dependencies and security patches  
- **Quarterly**: Review and optimize database performance
- **Annually**: Security audit and credential rotation

---

*This documentation should be updated whenever new features are added or existing functionality is modified.* 