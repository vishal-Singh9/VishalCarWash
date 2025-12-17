# API Configuration Guide

## 🎯 Overview

Your application now supports configurable API endpoints. You can use either:
- **Local Development:** `http://localhost:3001/api/*`
- **Production (Vercel):** `https://vishal-car-wash.vercel.app/api/*`

## 🔧 Configuration

### Environment Variables

Create or update `.env.local`:

```env
# API Base URL
# Leave empty for local development, or set to your production URL
NEXT_PUBLIC_API_URL=https://vishal-car-wash.vercel.app
```

### For Different Environments

#### Development (localhost)
```env
# .env.local
# Comment out or leave empty to use localhost
# NEXT_PUBLIC_API_URL=
```

#### Production (Vercel)
```env
# Set in Vercel Dashboard → Settings → Environment Variables
NEXT_PUBLIC_API_URL=https://vishal-car-wash.vercel.app
```

## 📡 Available API Endpoints

All endpoints are configured in `/lib/api-config.js`:

| Endpoint | URL | Methods |
|----------|-----|---------|
| **Services** | `${BASE_URL}/api/services` | GET |
| **Bookings** | `${BASE_URL}/api/bookings` | GET, POST |
| **User Update** | `${BASE_URL}/api/user/update` | PUT |
| **User Settings** | `${BASE_URL}/api/user/settings` | POST |
| **Sign Up** | `${BASE_URL}/api/auth/signup` | POST |
| **Gallery** | `${BASE_URL}/api/gallery` | GET |
| **Contact** | `${BASE_URL}/api/contact` | POST |

## 🚀 Usage

### In Your Components

#### Simple Fetch
```javascript
import { API_ENDPOINTS } from '@/lib/api-config';

// Fetch services
const response = await fetch(API_ENDPOINTS.services);
const services = await response.json();
```

#### With Query Parameters
```javascript
import { API_ENDPOINTS, buildApiUrl } from '@/lib/api-config';

// Fetch services with limit
const url = buildApiUrl(API_ENDPOINTS.services, { limit: 4 });
const response = await fetch(url);
const services = await response.json();
```

#### Using the API Fetch Wrapper
```javascript
import { apiFetch, API_ENDPOINTS } from '@/lib/api-config';

// Fetch with error handling
const response = await apiFetch(API_ENDPOINTS.services);
const services = await response.json();
```

#### POST Request
```javascript
import { apiFetch, API_ENDPOINTS } from '@/lib/api-config';

const response = await apiFetch(API_ENDPOINTS.bookings, {
  method: 'POST',
  body: JSON.stringify(bookingData),
});
const result = await response.json();
```

## 📝 Updated Files

The following files now use the centralized API configuration:

1. **`/lib/api-config.js`** - ✨ New configuration file
2. **`/app/hooks/useServices.js`** - Updated to use API_ENDPOINTS
3. **`/app/booking/page.js`** - Updated to use API_ENDPOINTS
4. **`/app/components/home/Services.js`** - Updated to use API_ENDPOINTS
5. **`/app/contact/page.js`** - Updated to use API_ENDPOINTS
6. **`/app/settings/page.js`** - Updated to use API_ENDPOINTS

## 🔍 How It Works

### Auto-Detection

The API configuration automatically detects the environment:

```javascript
const getApiBaseUrl = () => {
  // 1. Check environment variable (production)
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // 2. Use window.location in browser (fallback)
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // 3. Use NEXTAUTH_URL or localhost (server-side)
  return process.env.NEXTAUTH_URL || 'http://localhost:3001';
};
```

### Development vs Production

| Environment | NEXT_PUBLIC_API_URL | Resolved URL |
|-------------|---------------------|--------------|
| **Development** | Not set or empty | `http://localhost:3001` |
| **Production** | `https://vishal-car-wash.vercel.app` | `https://vishal-car-wash.vercel.app` |

## 🧪 Testing

### Test Local Development

1. Remove or comment out `NEXT_PUBLIC_API_URL` in `.env.local`:
```env
# NEXT_PUBLIC_API_URL=https://vishal-car-wash.vercel.app
```

2. Start your development server:
```bash
npm run dev
```

3. APIs will use: `http://localhost:3001/api/*`

### Test Production URL

1. Set `NEXT_PUBLIC_API_URL` in `.env.local`:
```env
NEXT_PUBLIC_API_URL=https://vishal-car-wash.vercel.app
```

2. Start your development server:
```bash
npm run dev
```

3. APIs will use: `https://vishal-car-wash.vercel.app/api/*`

### Verify Current Configuration

Open browser console and run:
```javascript
// Check current API base URL
console.log(process.env.NEXT_PUBLIC_API_URL);

// Or import and check
import { API_BASE_URL } from '@/lib/api-config';
console.log(API_BASE_URL);
```

## 📦 API Configuration Module

### Available Exports

```javascript
import { 
  API_BASE_URL,      // Base URL for all APIs
  API_ENDPOINTS,     // Object with all endpoint URLs
  buildApiUrl,       // Function to build URL with params
  apiFetch          // Fetch wrapper with error handling
} from '@/lib/api-config';
```

### API_ENDPOINTS Object

```javascript
{
  services: 'https://vishal-car-wash.vercel.app/api/services',
  bookings: 'https://vishal-car-wash.vercel.app/api/bookings',
  userUpdate: 'https://vishal-car-wash.vercel.app/api/user/update',
  userSettings: 'https://vishal-car-wash.vercel.app/api/user/settings',
  signup: 'https://vishal-car-wash.vercel.app/api/auth/signup',
  gallery: 'https://vishal-car-wash.vercel.app/api/gallery',
  contact: 'https://vishal-car-wash.vercel.app/api/contact',
}
```

### buildApiUrl Function

Builds URLs with query parameters:

```javascript
const url = buildApiUrl(API_ENDPOINTS.services, { 
  limit: 4, 
  category: 'premium' 
});
// Result: https://vishal-car-wash.vercel.app/api/services?limit=4&category=premium
```

### apiFetch Function

Wrapper for fetch with error handling:

```javascript
try {
  const response = await apiFetch(API_ENDPOINTS.services);
  const data = await response.json();
} catch (error) {
  console.error('API Error:', error.message);
}
```

## 🚢 Deployment

### Vercel Deployment

1. **Add Environment Variable in Vercel Dashboard:**
   - Go to your project settings
   - Navigate to Environment Variables
   - Add: `NEXT_PUBLIC_API_URL` = `https://vishal-car-wash.vercel.app`
   - Save and redeploy

2. **Or use Vercel CLI:**
```bash
vercel env add NEXT_PUBLIC_API_URL
# Enter: https://vishal-car-wash.vercel.app
```

3. **Redeploy:**
```bash
vercel --prod
```

### Other Hosting Platforms

#### Netlify
```bash
# netlify.toml
[build.environment]
  NEXT_PUBLIC_API_URL = "https://vishal-car-wash.vercel.app"
```

#### Railway
Add environment variable in Railway dashboard:
```
NEXT_PUBLIC_API_URL=https://vishal-car-wash.vercel.app
```

## 🔒 CORS Configuration

If you're calling APIs from a different domain, ensure CORS is configured:

```javascript
// In your API routes (if needed)
export async function GET(request) {
  const response = NextResponse.json(data);
  
  // Add CORS headers
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  
  return response;
}
```

## 📊 Benefits

✅ **Centralized Configuration** - One place to manage all API endpoints  
✅ **Environment Flexibility** - Easy switching between dev and prod  
✅ **Type Safety** - Consistent endpoint references  
✅ **Error Handling** - Built-in error handling with apiFetch  
✅ **Query Parameters** - Easy URL building with buildApiUrl  
✅ **Maintainability** - Update one file instead of many  

## 🐛 Troubleshooting

### Issue: APIs returning 404

**Check:**
1. Verify `NEXT_PUBLIC_API_URL` is set correctly
2. Check console for the actual URL being called
3. Ensure the API route exists on the server

```javascript
// Debug in browser console
console.log('API Base:', process.env.NEXT_PUBLIC_API_URL);
```

### Issue: CORS errors

**Solution:**
- Check if the API server has CORS configured
- Ensure credentials are included for authenticated requests:

```javascript
const response = await fetch(API_ENDPOINTS.bookings, {
  credentials: 'include'
});
```

### Issue: Environment variable not updating

**Solutions:**
1. Restart the development server: `npm run dev`
2. Clear Next.js cache:
```bash
rm -rf .next
npm run dev
```
3. Check if the variable is prefixed with `NEXT_PUBLIC_`

## 📚 Additional Resources

- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [Vercel Environment Variables](https://vercel.com/docs/concepts/projects/environment-variables)
- [CORS Guide](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS)

## ✅ Checklist

- [x] Created `/lib/api-config.js`
- [x] Updated all components to use API_ENDPOINTS
- [x] Added `NEXT_PUBLIC_API_URL` to `.env.local`
- [x] Tested local development
- [x] Documented usage
- [ ] Deploy to production
- [ ] Set environment variables in Vercel
- [ ] Test production APIs

## 🎉 Success!

Your application now supports flexible API configuration. You can:
- ✅ Call your Vercel API from anywhere
- ✅ Switch between development and production easily
- ✅ Maintain clean, centralized API configuration
- ✅ Use consistent error handling across your app

---

**Last Updated:** December 17, 2025  
**Version:** 1.0.0  
**Status:** ✅ Complete

