// app/sitemap.js
export default async function sitemap() {
  const baseUrl = 'https://vishal-car-wash.vercel.app' // Fallback to your domain
  const now = new Date()

  // Static routes with priority and change frequency
  const staticRoutes = [
    { url: '/', lastModified: now, priority: 1.0, changeFrequency: 'daily' },
    { url: '/about', lastModified: now, priority: 0.8, changeFrequency: 'weekly' },
    { url: '/booking', lastModified: now, priority: 0.9, changeFrequency: 'daily' },
    { url: '/help', lastModified: now, priority: 0.7, changeFrequency: 'monthly' },
    { url: '/privacy', lastModified: now, priority: 0.3, changeFrequency: 'yearly' },
    { url: '/terms', lastModified: now, priority: 0.3, changeFrequency: 'yearly' },
    { url: '/profile', lastModified: now, priority: 0.5, changeFrequency: 'weekly' },
    { url: '/settings', lastModified: now, priority: 0.4, changeFrequency: 'weekly' },
  ]

  // You can add dynamic routes here if needed
  // For example, if you have dynamic blog posts or services:
  /*
  const services = await getServices()
  const serviceRoutes = services.map(service => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: service.updatedAt || now,
    priority: 0.8,
    changeFrequency: 'weekly',
  }))
  */

  return [
    ...staticRoutes.map(route => ({
      url: `${baseUrl}${route.url}`,
      lastModified: route.lastModified,
      priority: route.priority,
      changeFrequency: route.changeFrequency,
    })),
    // ...serviceRoutes,
  ]
}
