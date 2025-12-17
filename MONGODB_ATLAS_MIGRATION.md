# MongoDB Atlas Migration Guide

## Changes Made

### 1. Updated Database Connection (`/lib/db.js`)
✅ **Fixed**: Removed hardcoded MongoDB Atlas connection string
✅ **Security**: Now uses environment variable `MONGODB_URI`
✅ **Status**: All APIs now properly configured to use environment variables

### 2. Database Connection Files
Your application uses two MongoDB connection files:

- **`/lib/db.js`**: Mongoose connection (used by most APIs)
  - Used by: Bookings API, Services API, User API, Auth signup
  - ✅ Fixed to use environment variables

- **`/lib/mongodb.js`**: Native MongoDB client (used by NextAuth)
  - Used by: NextAuth MongoDB adapter
  - ✅ Already properly configured with environment variables

## Setup Instructions

### Step 1: Create Environment Variables File

Create a `.env.local` file in the root directory with your MongoDB Atlas connection string:

```bash
# Copy and paste this into .env.local
MONGODB_URI=mongodb+srv://vishalsng9_db_user:ciWTTF5LlLAp9be2@cluster0.avgsrgl.mongodb.net/VishalCarWash?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-here
NEXTAUTH_URL=http://localhost:3001

# Google OAuth (optional, if using Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Node Environment
NODE_ENV=development
```

**Important**: Replace the credentials with your actual MongoDB Atlas credentials if different.

### Step 2: Generate NextAuth Secret

Run this command to generate a secure NextAuth secret:

```bash
openssl rand -base64 32
```

Copy the output and replace `your-nextauth-secret-here` in your `.env.local` file.

### Step 3: Verify MongoDB Atlas Configuration

1. Log in to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to your cluster (Cluster0)
3. Click "Connect" → "Connect your application"
4. Copy your connection string and update `MONGODB_URI` in `.env.local`

**Connection String Format:**
```
mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

### Step 4: Configure Network Access

In MongoDB Atlas, ensure your IP address is whitelisted:

1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Add your current IP or use `0.0.0.0/0` for testing (⚠️ not recommended for production)

### Step 5: Seed Your Database (Optional)

If you need to seed your services data:

```bash
node scripts/seedServices.js
```

### Step 6: Start Your Application

```bash
npm run dev
```

Your application will now connect to MongoDB Atlas at: `http://localhost:3001`

## API Routes Overview

All these routes now use MongoDB Atlas:

| Route | Method | Connection | Database |
|-------|--------|------------|----------|
| `/api/bookings` | GET, POST | Mongoose (`/lib/db.js`) | VishalCarWash |
| `/api/services` | GET | Mongoose (`/lib/db.js`) | VishalCarWash |
| `/api/auth/signup` | POST | Mongoose (`/lib/db.js`) | VishalCarWash |
| `/api/user/update` | PUT | Mongoose (`/lib/db.js`) | VishalCarWash |
| `/api/auth/[...nextauth]` | GET, POST | Both connections | carwash (adapter) + VishalCarWash (auth) |
| `/api/gallery` | GET | No DB (static data) | N/A |

## Database Schema

### Collections in VishalCarWash Database:

1. **users** - User accounts
   - Fields: name, email, password, role, timestamps
   
2. **bookings** - Service bookings
   - Fields: user (ref), service, date, time, status, vehicle info, customer info
   
3. **services** - Available services
   - Fields: name, description, price, duration, isActive

### NextAuth Collections (in carwash database):

- **accounts** - OAuth accounts
- **sessions** - User sessions
- **users** - OAuth user data
- **verification_tokens** - Email verification

## Troubleshooting

### Connection Error

If you see "Please define the MONGODB_URI environment variable":
- Ensure `.env.local` file exists in the root directory
- Check that `MONGODB_URI` is properly set
- Restart your development server

### Authentication Issues

If authentication fails:
- Ensure both databases exist in MongoDB Atlas
- Verify NextAuth secret is set
- Check that Google OAuth credentials are correct (if using)

### Database Not Found

MongoDB Atlas will automatically create databases when you first write data. If collections don't exist:
- Run the seed script: `node scripts/seedServices.js`
- Create a user account to initialize the users collection
- Make a test booking to initialize the bookings collection

## Data Migration (if needed)

If you have existing data in a local MongoDB instance:

### Option 1: Export/Import (Recommended)

```bash
# Export from local MongoDB
mongodump --uri="mongodb://localhost:27017/VishalCarWash" --out=./backup

# Import to MongoDB Atlas
mongorestore --uri="mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/VishalCarWash" ./backup/VishalCarWash
```

### Option 2: MongoDB Compass

1. Download [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Connect to your local MongoDB
3. Export collections as JSON
4. Connect to MongoDB Atlas
5. Import the JSON files

## Security Best Practices

✅ **Implemented:**
- Credentials stored in environment variables
- `.env.local` is gitignored
- Connection string not exposed in code

⚠️ **Recommended:**
- Use strong, unique passwords for MongoDB users
- Restrict Network Access in MongoDB Atlas
- Rotate credentials periodically
- Use different credentials for development and production
- Never commit `.env.local` to version control

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add environment variables in your hosting platform's dashboard
2. Update `NEXTAUTH_URL` to your production domain
3. Update MongoDB Atlas Network Access for production IPs
4. Use a different NEXTAUTH_SECRET for production

## Need Help?

- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- NextAuth Docs: https://next-auth.js.org/
- Next.js Environment Variables: https://nextjs.org/docs/basic-features/environment-variables

