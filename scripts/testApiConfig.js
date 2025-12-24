require('dotenv').config({ path: '.env.local' });

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};



// Simulate the API config logic
const getApiBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return process.env.NEXTAUTH_URL || 'http://localhost:3001';
};

const API_BASE_URL = getApiBaseUrl();

const API_ENDPOINTS = {
  services: `${API_BASE_URL}/api/services`,
  bookings: `${API_BASE_URL}/api/bookings`,
  userUpdate: `${API_BASE_URL}/api/user/update`,
  userSettings: `${API_BASE_URL}/api/user/settings`,
  signup: `${API_BASE_URL}/api/auth/signup`,
  gallery: `${API_BASE_URL}/api/gallery`,
  contact: `${API_BASE_URL}/api/contact`,
  reviews: `${API_BASE_URL}/api/reviews`,
};



// Display all endpoints
Object.entries(API_ENDPOINTS).forEach(([key, url]) => {
  console.log(`   ${colors.yellow}${key.padEnd(15)}${colors.reset} → ${colors.blue}${url}${colors.reset}`);
});

// Test buildApiUrl function

const buildApiUrl = (endpoint, params = {}) => {
  const url = new URL(endpoint);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

const testUrl = buildApiUrl(API_ENDPOINTS.services, { limit: 4, category: 'premium' });
console.log(`   Input: ${colors.yellow}API_ENDPOINTS.services${colors.reset}`);
console.log(`   Params: ${colors.yellow}{ limit: 4, category: 'premium' }${colors.reset}`);
console.log(`   Result: ${colors.green}${testUrl}${colors.reset}`);

// Test environment detection
console.log(`\n${colors.cyan}🔍 Environment Detection:${colors.reset}`);

if (process.env.NEXT_PUBLIC_API_URL) {
  if (process.env.NEXT_PUBLIC_API_URL.includes('localhost')) {
    console.log(`   ${colors.yellow}⚠️  Warning: NEXT_PUBLIC_API_URL points to localhost${colors.reset}`);
    console.log(`   ${colors.yellow}   This is fine for development, but change for production${colors.reset}`);
  } else if (process.env.NEXT_PUBLIC_API_URL.includes('vercel.app')) {
    console.log(`   ${colors.green}✅ Production URL detected (Vercel)${colors.reset}`);
    console.log(`   ${colors.green}   All API calls will go to: ${API_BASE_URL}${colors.reset}`);
  } else {
    console.log(`   ${colors.blue}ℹ️  Custom API URL detected${colors.reset}`);
    console.log(`   ${colors.blue}   Using: ${API_BASE_URL}${colors.reset}`);
  }
} else {
  console.log(`   ${colors.blue}ℹ️  No NEXT_PUBLIC_API_URL set${colors.reset}`);
  console.log(`   ${colors.blue}   Using default: ${API_BASE_URL}${colors.reset}`);
  console.log(`   ${colors.blue}   This is normal for local development${colors.reset}`);
}

// Show usage examples
console.log(`\n${colors.cyan}📝 Usage Examples:${colors.reset}\n`);

console.log(`${colors.yellow}1. Simple Fetch:${colors.reset}`);
console.log(`   ${colors.blue}import { API_ENDPOINTS } from '@/lib/api-config';${colors.reset}`);
console.log(`   ${colors.blue}const response = await fetch(API_ENDPOINTS.services);${colors.reset}\n`);

console.log(`${colors.yellow}2. With Query Parameters:${colors.reset}`);
console.log(`   ${colors.blue}import { buildApiUrl, API_ENDPOINTS } from '@/lib/api-config';${colors.reset}`);
console.log(`   ${colors.blue}const url = buildApiUrl(API_ENDPOINTS.services, { limit: 4 });${colors.reset}\n`);

console.log(`${colors.yellow}3. POST Request:${colors.reset}`);
console.log(`   ${colors.blue}import { apiFetch, API_ENDPOINTS } from '@/lib/api-config';${colors.reset}`);
console.log(`   ${colors.blue}const response = await apiFetch(API_ENDPOINTS.bookings, {${colors.reset}`);
console.log(`   ${colors.blue}  method: 'POST', body: JSON.stringify(data)${colors.reset}`);
console.log(`   ${colors.blue}});${colors.reset}\n`);

// Recommendations
console.log(`${colors.cyan}💡 Recommendations:${colors.reset}\n`);

if (!process.env.NEXT_PUBLIC_API_URL) {
  console.log(`   ${colors.yellow}→ For production, set NEXT_PUBLIC_API_URL in Vercel:${colors.reset}`);
  console.log(`     ${colors.blue}NEXT_PUBLIC_API_URL=https://vishal-car-wash.vercel.app${colors.reset}\n`);
}

if (process.env.NEXT_PUBLIC_API_URL && process.env.NEXT_PUBLIC_API_URL.includes('localhost')) {
  console.log(`   ${colors.yellow}→ Remember to update NEXT_PUBLIC_API_URL for production${colors.reset}\n`);
}

console.log(`   ${colors.green}→ All API endpoints are now centralized in /lib/api-config.js${colors.reset}`);
console.log(`   ${colors.green}→ Use API_ENDPOINTS instead of hardcoded paths${colors.reset}`);
console.log(`   ${colors.green}→ Configuration is environment-aware${colors.reset}\n`);

console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║  ✅ API Configuration Test Complete                       ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

