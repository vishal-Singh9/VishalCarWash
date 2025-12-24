import dotenv from "dotenv";
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Load environment variables from .env.local
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, "../.env.local") });

// Define Service schema inline to avoid module issues
const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    duration: {
      type: Number,
      required: true,
      min: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
    },
  },
  { timestamps: true }
);

const Service =
  mongoose.models.Service || mongoose.model("Service", serviceSchema);

const services = [
  {
    name: "Basic Wash",
    description:
      "Exterior hand wash, wheel and tire cleaning, window cleaning, and interior vacuuming.",
    price: 25.99,
    duration: 30,
    isActive: true,
  },
  {
    name: "Deluxe Wash",
    description:
      "Everything in Basic Wash plus interior cleaning, dashboard polish, and tire dressing.",
    price: 49.99,
    duration: 60,
    isActive: true,
  },
  {
    name: "Premium Wash",
    description:
      "Everything in Deluxe Wash plus waxing, interior shampoo, and engine cleaning.",
    price: 79.99,
    duration: 90,
    isActive: true,
  },
  {
    name: "Interior Detailing",
    description:
      "Deep cleaning of all interior surfaces, leather treatment, and odor removal.",
    price: 149.99,
    duration: 120,
    isActive: true,
  },
  {
    name: "Full Detailing",
    description:
      "Complete interior and exterior detailing including paint correction and ceramic coating.",
    price: 299.99,
    duration: 240,
    isActive: true,
  },
];

const seedDatabase = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    // Clear existing services
    await Service.deleteMany({});

    // Insert new services
    await Service.insertMany(services);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error.message);
    process.exit(1);
  }
};

seedDatabase();
