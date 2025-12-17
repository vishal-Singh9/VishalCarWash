import { useState, useEffect } from 'react';
import { API_ENDPOINTS, buildApiUrl } from '@/lib/api-config';

// Fallback data in case the API is not available
const FALLBACK_SERVICES = [
  { id: 1, name: 'Basic Wash', price: 15, duration: '30 min' },
  { id: 2, name: 'Premium Wash', price: 30, duration: '45 min' },
  { id: 3, name: 'Interior Detailing', price: 50, duration: '2 hours' },
  { id: 4, name: 'Full Service', price: 75, duration: '3 hours' },
];

export function useServices(limit = 4) {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Try to fetch from API first using configured endpoint
        const apiUrl = buildApiUrl(API_ENDPOINTS.services, { limit });
        const response = await fetch(apiUrl, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        if (response.ok) {
          const data = await response.json();
          setServices(data);
        } else {
          // If API fails, use fallback data
          console.warn('Using fallback services data');
          setServices(FALLBACK_SERVICES.slice(0, limit));
        }
      } catch (err) {
        console.error('Error fetching services, using fallback data:', err);
        setServices(FALLBACK_SERVICES.slice(0, limit));
        setError('Using fallback data: ' + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [limit]);

  return { services, loading, error };
}
