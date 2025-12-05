require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('../models/Service');

const services = [
  {
    name: 'Basic Wash',
    description: 'Exterior hand wash, wheel and tire cleaning, window cleaning, and interior vacuuming.',
    price: 25.99,
    duration: 30,
    isActive: true,
  },
  {
    name: 'Deluxe Wash',
    description: 'Everything in Basic Wash plus interior cleaning, dashboard polish, and tire dressing.',
    price: 49.99,
    duration: 60,
    isActive: true,
  },
  {
    name: 'Premium Wash',
    description: 'Everything in Deluxe Wash plus waxing, interior shampoo, and engine cleaning.',
    price: 79.99,
    duration: 90,
    isActive: true,
  },
  {
    name: 'Interior Detailing',
    description: 'Deep cleaning of all interior surfaces, leather treatment, and odor removal.',
    price: 149.99,
    duration: 120,
    isActive: true,
  },
  {
    name: 'Full Detailing',
    description: 'Complete interior and exterior detailing including paint correction and ceramic coating.',
    price: 299.99,
    duration: 240,
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('Connected to MongoDB');

    // Clear existing services
    await Service.deleteMany({});
    console.log('Cleared existing services');

    // Insert new services
    await Service.insertMany(services);
    console.log('Seeded database with services');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
