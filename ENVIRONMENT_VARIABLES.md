# Environment Variables Configuration Guide

This document provides a comprehensive guide for setting up all required environment variables for the Vishal Car Wash application.

## Required Environment Variables

Create a `.env.local` file in the root directory of your project and add the following variables:

### 1. MongoDB Configuration

```bash
# MongoDB Connection String
# Get your MongoDB connection string from MongoDB Atlas or your MongoDB instance
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/VishalCarWash?retryWrites=true&w=majority
```

**How to get your MongoDB URI:**
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a cluster or use an existing one
3. Click "Connect" > "Connect your application"
4. Copy the connection string and replace `<password>` with your database user password

---

### 2. NextAuth Configuration

```bash
# Secret key for encrypting JWT tokens
# Generate a secure secret with: openssl rand -base64 32
NEXTAUTH_SECRET=your-nextauth-secret-key-here

# Application URL
# Development: http://localhost:3001
# Production: https://yourdomain.com
NEXTAUTH_URL=http://localhost:3001

# Optional: Database name for NextAuth (defaults to database in MONGODB_URI)
NEXTAUTH_DATABASE=VishalCarWash
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

---

### 3. Google OAuth Configuration

```bash
# Google OAuth Credentials
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

**How to get Google OAuth credentials:**

1. **Go to Google Cloud Console:**
   - Visit: https://console.cloud.google.com/

2. **Create or Select a Project:**
   - Create a new project or select an existing one

3. **Enable Google+ API:**
   - Go to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it

4. **Create OAuth 2.0 Credentials:**
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Select "Web application"

5. **Configure OAuth Consent Screen:**
   - Add your app name and user support email
   - Add authorized domains

6. **Add Authorized Redirect URIs:**
   - Development: `http://localhost:3001/api/auth/callback/google`
   - Production: `https://yourdomain.com/api/auth/callback/google`

7. **Copy Credentials:**
   - Copy the Client ID and Client Secret
   - Add them to your `.env.local` file

---

### 4. API Configuration (Optional)

```bash
# Base URL for API calls
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

### 5. Email Configuration (For Password Reset)

**Option A: Gmail with App Password (Simple Setup)**

```bash
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=noreply@vishalcarwash.com
```

**How to get Gmail App Password:**
1. Go to your Google Account settings
2. Select Security
3. Enable 2-Step Verification if not already enabled
4. Go to "App passwords"
5. Generate a new app password for "Mail"
6. Use this password in EMAIL_PASSWORD

**Option B: SendGrid (Recommended for Production)**

```bash
SENDGRID_API_KEY=your-sendgrid-api-key
EMAIL_FROM=noreply@vishalcarwash.com
```

**How to get SendGrid API Key:**
1. Sign up at [SendGrid](https://sendgrid.com/)
2. Go to Settings > API Keys
3. Create a new API key with "Full Access"
4. Copy the key (you'll only see it once!)

---

### 6. Other Configuration

```bash
# Node Environment
NODE_ENV=development  # or 'production' for production builds
```

---

## Complete .env.local Template

```bash
# MongoDB
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/VishalCarWash?retryWrites=true&w=majority

# NextAuth
NEXTAUTH_SECRET=your-nextauth-secret-key-here
NEXTAUTH_URL=http://localhost:3001
NEXTAUTH_DATABASE=VishalCarWash

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret

# API
NEXT_PUBLIC_API_URL=http://localhost:3001

# Email (Choose one option)
# Option A: Gmail
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-gmail-app-password
EMAIL_FROM=noreply@vishalcarwash.com

# Option B: SendGrid
# SENDGRID_API_KEY=your-sendgrid-api-key
# EMAIL_FROM=noreply@vishalcarwash.com

# Environment
NODE_ENV=development
```

---

## Security Best Practices

1. **Never commit `.env.local` to version control**
   - Add it to `.gitignore` (should already be there)

2. **Use different secrets for development and production**
   - Generate new secrets for each environment

3. **Rotate secrets periodically**
   - Change your NEXTAUTH_SECRET and API keys regularly

4. **Use environment-specific URLs**
   - Development: `http://localhost:3001`
   - Production: `https://yourdomain.com`

5. **Keep credentials secure**
   - Don't share credentials via email or chat
   - Use secure password managers for team sharing

---

## Testing Your Configuration

After setting up your environment variables:

1. **Restart your development server:**
   ```bash
   npm run dev
   ```

2. **Test Database Connection:**
   ```bash
   npm run test-db
   ```

3. **Test Authentication:**
   - Try signing in with email/password
   - Try signing in with Google
   - Test password reset flow

4. **Check Console:**
   - Look for any connection errors
   - Verify no "undefined" environment variable warnings

---

## Troubleshooting

### MongoDB Connection Issues

**Error: "MongoNetworkError"**
- Check if your IP is whitelisted in MongoDB Atlas
- Verify your connection string is correct
- Check if your database user has proper permissions

### Google OAuth Issues

**Error: "redirect_uri_mismatch"**
- Make sure your redirect URI in Google Console matches exactly
- Check both development and production URLs
- Don't forget `/api/auth/callback/google` at the end

### NextAuth Errors

**Error: "NEXTAUTH_SECRET is not set"**
- Generate a new secret: `openssl rand -base64 32`
- Add it to your `.env.local` file
- Restart your server

### Email Issues

**Error: "Invalid login"**
- If using Gmail, make sure 2FA is enabled
- Use an App Password, not your regular password
- Check if "Less secure app access" is disabled (use App Password instead)

---

## Production Deployment

When deploying to production (Vercel, Netlify, etc.):

1. Add all environment variables to your hosting platform's dashboard
2. Update `NEXTAUTH_URL` to your production domain
3. Update Google OAuth redirect URIs to include production URL
4. Use production-grade email service (SendGrid, AWS SES)
5. Generate new `NEXTAUTH_SECRET` for production

---

## Need Help?

If you encounter issues:
1. Check the console for error messages
2. Verify all environment variables are set correctly
3. Ensure services (MongoDB, Google OAuth) are properly configured
4. Check the application logs for detailed error information

