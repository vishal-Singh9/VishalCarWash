import { NextResponse } from 'next/server';

// Gallery API - Returns car wash gallery images
const galleryImages = [
  // Exterior Services
  {
    id: 1,
    url: '/images/nissan.jpeg',
    alt: 'Premium Car Wash',
    category: 'exterior',
    description: 'Complete exterior wash and shine service'
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1607860108855-64acf2078ed9?w=800&auto=format&fit=crop&q=80',
    alt: 'Foam Wash',
    category: 'exterior',
    description: 'High-pressure foam wash for deep cleaning'
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1503376785-2ccf7f504264?w=800&auto=format&fit=crop&q=80',
    alt: 'Hand Wash',
    category: 'exterior',
    description: 'Gentle hand wash for a perfect finish'
  },
  
  // Interior Services
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800&auto=format&fit=crop&q=80',
    alt: 'Interior Detailing',
    category: 'interior',
    description: 'Complete interior cleaning and detailing'
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1503376785-1-2a50b8e6e4e4?w=800&auto=format&fit=crop&q=80',
    alt: 'Leather Treatment',
    category: 'interior',
    description: 'Leather conditioning and protection'
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=800&auto=format&fit=crop&q=80',
    alt: 'Dashboard Polish',
    category: 'interior',
    description: 'Dashboard cleaning and UV protection'
  },
  
  // Engine Services
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1605559421013-8a07923e1910?w=800&auto=format&fit=crop&q=80',
    alt: 'Engine Cleaning',
    category: 'engine',
    description: 'Complete engine bay cleaning and detailing'
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1503376784-8babda2b5f5c?w=800&auto=format&fit=crop&q=80',
    alt: 'Engine Degreasing',
    category: 'engine',
    description: 'Deep degreasing and cleaning of engine components'
  },
  
  // Detailing Services
  {
    id: 9,
    url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&auto=format&fit=crop&q=80',
    alt: 'Paint Correction',
    category: 'detailing',
    description: 'Professional paint correction and restoration'
  },
  {
    id: 10,
    url: 'https://images.unsplash.com/photo-1503376785-3b9de3a62995?w=800&auto=format&fit=crop&q=80',
    alt: 'Ceramic Coating',
    category: 'detailing',
    description: 'Premium ceramic coating for long-lasting protection'
  },
  {
    id: 11,
    url: 'https://images.unsplash.com/photo-1607863685399-89bda2b9c9e5?w=800&auto=format&fit=crop&q=80',
    alt: 'Headlight Restoration',
    category: 'detailing',
    description: 'Professional headlight restoration service'
  },
  {
    id: 12,
    url: 'https://images.unsplash.com/photo-1503376785-2ccf7f504264?w=800&auto=format&fit=crop&q=80',
    alt: 'Wheel Detailing',
    category: 'detailing',
    description: 'Complete wheel cleaning and protection'
  }
];

export async function GET() {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return NextResponse.json(galleryImages);
  } catch (error) {
    console.error('Error in gallery API:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images', details: error.message },
      { status: 500 }
    );
  }
}
