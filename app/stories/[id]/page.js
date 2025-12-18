'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Star, Quote } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// This would typically come from an API or data source
const stories = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Car Enthusiast',
    image: '/images/avatar1.jpg',
    rating: 5,
    content: 'The best car wash service I&apos;ve ever experienced! My car looks brand new after every visit. The attention to detail is incredible. The team is always professional and goes above and beyond to ensure customer satisfaction. I particularly love how they handle classic cars with such care. The interior detailing is exceptional - they get into every nook and cranny. The eco-friendly products they use are also a big plus for me. I wouldn&apos;t trust anyone else with my vehicle!',
    fullContent: `I've been a loyal customer for over two years now, and I can confidently say that this car wash service is in a league of its own. What started as a one-time service has turned into a regular appointment in my calendar.

## First Impressions

From the very first visit, I was impressed by the attention to detail. The team didn't just wash my car - they treated it like it was their own. The waiting area is always clean and comfortable, and the staff is incredibly friendly and knowledgeable.

## The Service

Their premium package is worth every penny. The exterior wash is thorough, and the hand-drying ensures no water spots. The interior detailing is where they really shine - they get into every nook and cranny, and the leather treatment leaves my seats looking and smelling like new.

## The Results

My car looks showroom-fresh after every visit. The paintwork has maintained its shine, and the interior looks as good as the day I bought it. I've received countless compliments from friends and colleagues about how well-maintained my car looks.

## Final Thoughts

If you're looking for a car wash service that treats your vehicle with the care it deserves, look no further. The team's professionalism, attention to detail, and commitment to customer satisfaction are unmatched. I can't recommend them enough!`,
    date: '2 weeks ago',
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50'
  },
  // ... other stories with fullContent added
];

const StarRating = ({ rating, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  return (
    <div className="flex items-center">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star 
          key={star} 
          className={`${sizeClasses[size]} ${star <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'}`} 
        />
      ))}
    </div>
  );
};

export default function StoryDetail({ params }) {
  const router = useRouter();
  const story = stories.find(s => s.id === parseInt(params.id));

  if (!story) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Story Not Found</h1>
          <p className="text-gray-600 mb-6">The story you&apos;re looking for doesn&apos;t exist or has been removed.</p>
          <Link 
            href="/stories" 
            className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Stories
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Back Button */}
      <div className="container mx-auto px-4 py-6">
        <button 
          onClick={() => router.back()}
          className="flex items-center text-blue-600 hover:text-blue-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Stories
        </button>
      </div>

      {/* Story Content */}
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.article 
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className={`h-3 w-full bg-gradient-to-r ${story.color}`}></div>
          
          <div className="p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
              <div className="flex items-center mb-4 md:mb-0">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${story.color} flex items-center justify-center text-white text-2xl font-bold mr-4`}>
                  {story.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{story.name}</h1>
                  <p className="text-gray-600">{story.role}</p>
                  <div className="mt-1">
                    <StarRating rating={story.rating} size="sm" />
                  </div>
                </div>
              </div>
              <div className="text-sm text-gray-500">{story.date}</div>
            </div>

            <div className="prose max-w-none">
              <blockquote className="text-xl italic text-gray-700 border-l-4 border-blue-500 pl-4 mb-8">
                &quot;{story.content}&quot;
              </blockquote>
              
              <div className="border-t border-gray-100 pt-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Full Story</h2>
                <div className="space-y-6 text-gray-700 leading-relaxed">
                  {story.fullContent.split('\n\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-12 pt-8 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Was this review helpful?</h3>
              <div className="flex space-x-4">
                <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors">
                  Yes, thanks!
                </button>
                <button className="px-4 py-2 bg-gray-50 text-gray-600 rounded-lg hover:bg-gray-100 transition-colors">
                  Not really
                </button>
              </div>
            </div>
          </div>
        </motion.article>

        <div className="mt-12 text-center">
          <Link 
            href="/stories" 
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to All Stories
          </Link>
        </div>
      </div>
    </div>
  );
}
