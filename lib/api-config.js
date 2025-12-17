/**
 * API Configuration
 * Centralized API URL management for development and production
 */

// Get the API base URL from environment variable or use default
const getApiBaseUrl = () => {
  // In production (Vercel), use the custom API URL if provided
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  
  // In browser, use window.location if available
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // Fallback for server-side rendering
  return process.env.NEXTAUTH_URL || 'http://localhost:3001';
};

export const API_BASE_URL = getApiBaseUrl();

/**
 * API Endpoints configuration
 */
export const API_ENDPOINTS = {
  // Services
  services: `${API_BASE_URL}/api/services`,
  
  // Bookings
  bookings: `${API_BASE_URL}/api/bookings`,
  
  // User
  userUpdate: `${API_BASE_URL}/api/user/update`,
  userSettings: `${API_BASE_URL}/api/user/settings`,
  
  // Auth
  signup: `${API_BASE_URL}/api/auth/signup`,
  
  // Gallery
  gallery: `${API_BASE_URL}/api/gallery`,
  
  // Contact
  contact: `${API_BASE_URL}/api/contact`,
};

/**
 * Helper function to build API URL with query parameters
 * @param {string} endpoint - The endpoint URL
 * @param {Object} params - Query parameters
 * @returns {string} Full URL with query parameters
 */
export const buildApiUrl = (endpoint, params = {}) => {
  const url = new URL(endpoint);
  Object.keys(params).forEach(key => {
    if (params[key] !== undefined && params[key] !== null) {
      url.searchParams.append(key, params[key]);
    }
  });
  return url.toString();
};

/**
 * Fetch wrapper with error handling
 * @param {string} url - The URL to fetch
 * @param {Object} options - Fetch options
 * @returns {Promise} Fetch response
 */
export const apiFetch = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: response.statusText }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }
    
    return response;
  } catch (error) {
    console.error('API Fetch Error:', error);
    throw error;
  }
};

export default {
  API_BASE_URL,
  API_ENDPOINTS,
  buildApiUrl,
  apiFetch,
};

