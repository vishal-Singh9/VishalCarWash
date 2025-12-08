'use client';

import Link from 'next/link';
import Stats from './components/home/Stats';
import Features from './components/home/Features';
import Services from './components/home/Services';
import { CTA } from './components/home/CTA';
import { Testimonials } from './components/home/Testimonials';
import { Gallery } from './components/home/Gallery';
import { Pricing } from './components/home/Pricing';
import { Contact } from './components/home/Contact';
import { Newsletter } from './components/home/Newsletter';
import { useServices } from '../hooks/useServices';
import Hero from './components/home/Hero';
import Footer from './components/Footer';

export default function Home() {
  const { services, loading, error } = useServices(6);
  
  const stats = [
    { number: '10,000+', label: 'Happy Customers' },
    { number: '15+', label: 'Years Experience' },
    { number: '50+', label: 'Expert Team' },
    { number: '4.9', label: 'Rating' }
  ];

  return (
    <div className="overflow-hidden">
      <Hero />
      <Stats stats={stats} />
      <Features />
      <Services services={services} loading={loading} error={error} />
      <Testimonials />
      <Gallery />
      <Pricing />
      <Newsletter />
      <Contact />
      <CTA />
      <Footer />
    </div>
  );
}
