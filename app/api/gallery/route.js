import { NextResponse } from 'next/server';

// Mock data - replace this with actual database queries in production
const galleryImages = [
  {
    id: 1,
    url: '/images/gallery/wash1.jpg',
    alt: 'Car wash service',
    category: 'exterior',
    description: 'Complete exterior wash and shine'
  },
  {
    id: 2,
    url: '/images/gallery/interior1.jpg',
    alt: 'Interior cleaning',
    category: 'interior',
    description: 'Professional interior detailing'
  },
  // Add more images as needed
];

export async function GET() {
  try {
    // In a real app, you would fetch this from your database
    return NextResponse.json(galleryImages);
  } catch (error) {
    console.error('Error fetching gallery images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch gallery images' },
      { status: 500 }
    );
  }
}
