# Environment Variables Setup

## Required Environment Variables

You need to set up the following environment variables in your Vercel dashboard:

### 1. Database Configuration
```
DATABASE_URL="postgresql://username:password@host:port/database?sslmode=require"
```

### 2. JWT Secret
```
JWT_SECRET="your-super-secret-jwt-key-make-it-long-and-random"
```

### 3. Prisma Configuration (already in vercel.json)
```
PRISMA_GENERATE_DATAPROXY="true"
PRISMA_GENERATE_ACCELERATE="true" 
```

## Setting up Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Navigate to your project
3. Go to Settings → Environment Variables
4. Add each variable listed above

## Database Setup Options

### Option 1: Vercel Postgres (Recommended)
1. In your Vercel dashboard, go to Storage
2. Create a new Postgres database
3. Copy the connection string to DATABASE_URL

### Option 2: External PostgreSQL
Use any PostgreSQL provider (Supabase, Railway, etc.) and add the connection string.

## JWT Secret Generation
Generate a secure random string for JWT_SECRET:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
``` 