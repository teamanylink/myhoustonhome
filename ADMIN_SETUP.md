# Admin User Management Guide

## Overview

The MyHoustonHome application includes a comprehensive admin system with role-based access control. This guide covers how to set up, manage, and use admin accounts.

## Default Admin Account

When the backend server starts for the first time, a default admin account is automatically created:

- **Email**: `denis@denvagroup.com`
- **Password**: `TempPassword123!`
- **Role**: `super_admin`

⚠️ **Important**: Change this password immediately after your first login!

## Admin Roles

### Super Admin
- Can manage all content (communities, listings, contacts)
- Can create, edit, and delete other admin users
- Can access all admin features
- Cannot be deleted by other admins

### Admin
- Can manage content (communities, listings, contacts)
- Cannot manage other admin users
- Cannot access admin user management

## Backend API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `GET /api/admin/verify` - Verify authentication token
- `POST /api/admin/change-password` - Change admin password

### Admin Management (Super Admin Only)
- `GET /api/admin/users` - Get all admin users
- `POST /api/admin/users` - Create new admin user
- `DELETE /api/admin/users/:id` - Delete admin user

### Content Management
- Communities: `GET`, `POST`, `PUT`, `DELETE /api/communities`
- Listings: `GET`, `POST`, `PUT`, `DELETE /api/listings`
- Contacts: `GET`, `DELETE /api/contacts`

## Frontend Admin Interface

### Accessing the Admin Panel
1. Navigate to `/admin/login`
2. Enter your admin credentials
3. You'll be redirected to the admin dashboard

### Admin Dashboard Features
- **Dashboard**: Overview of system statistics
- **Communities**: Manage community information
- **Listings**: Manage property listings
- **Admin Users**: Manage admin accounts (Super Admin only)
- **Settings**: Configure system settings

### Admin Users Management
Located at `/admin/admin-users` (Super Admin only)

**Features:**
- View all admin users
- Create new admin accounts
- Delete admin accounts (except Super Admin)
- See user roles and creation dates

**Creating a New Admin:**
1. Click "Add Admin" button
2. Enter email address
3. Set password (minimum 8 characters)
4. Choose role (Admin or Super Admin)
5. Click "Create Admin"

## Security Best Practices

### Password Requirements
- Minimum 8 characters
- Use strong, unique passwords
- Change default password immediately

### Access Control
- Only Super Admins can manage admin users
- Regular admins can only manage content
- JWT tokens expire after 24 hours

### Environment Variables
Set these in production:
- `JWT_SECRET`: Strong secret key for JWT signing
- `PORT`: Server port (default: 4000)

## Development Setup

### Starting the Backend
```bash
cd api
npm install
npm start
```

### Default Admin Creation
The default admin is created automatically when the server starts:
```javascript
// From api/index.js
const initializeDefaultAdmin = async () => {
  if (admins.length === 0) {
    const hashedPassword = await bcrypt.hash('TempPassword123!', SALT_ROUNDS);
    admins.push({
      id: 'admin-1',
      email: 'denis@denvagroup.com',
      password: hashedPassword,
      role: 'super_admin',
      createdAt: new Date().toISOString(),
      isActive: true
    });
  }
};
```

### Testing Admin Endpoints
```bash
# Login
curl -X POST http://localhost:4000/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"denis@denvagroup.com","password":"TempPassword123!"}'

# Get admin users (requires token)
curl -X GET http://localhost:4000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create new admin (requires super admin token)
curl -X POST http://localhost:4000/api/admin/users \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{"email":"newadmin@example.com","password":"SecurePass123!","role":"admin"}'
```

## Troubleshooting

### Common Issues

**"Access denied. No token provided"**
- Make sure you're logged in
- Check if your token has expired (24-hour limit)
- Try logging in again

**"Super admin access required"**
- Only Super Admins can manage admin users
- Contact your Super Admin for access

**"Admin with this email already exists"**
- Each email can only be used once
- Use a different email address

**"Cannot delete your own account"**
- Super Admins cannot delete themselves
- Have another Super Admin delete your account if needed

### Password Reset
If you forget your password and are a Super Admin:
1. Stop the server
2. Delete the admin from the `admins` array in `api/index.js`
3. Restart the server to recreate the default admin
4. Log in with default credentials and change password

## Production Deployment

### Environment Variables
```bash
JWT_SECRET=your-super-secure-jwt-secret-key
PORT=4000
```

### Security Considerations
- Use HTTPS in production
- Set a strong JWT_SECRET
- Regularly rotate admin passwords
- Monitor admin access logs
- Consider implementing rate limiting
- Use environment variables for sensitive data

### Database Integration
Currently, admin users are stored in memory. For production:
- Consider moving to database storage
- Implement proper user management
- Add password reset functionality
- Add audit logging

## Support

For technical support or questions about admin management:
- Check the console logs for error messages
- Verify your authentication token is valid
- Ensure you have the correct permissions for the action
- Contact the development team for assistance 