import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  role: { type: String, default: 'Customer' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  content: { type: String, required: true },
  status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  image: { type: String, default: '/images/avatar-default.jpg' },
  color: { type: String, default: 'from-gray-500 to-gray-600' },
  bgColor: { type: String, default: 'bg-gray-50' }
}, { timestamps: true });

// Create a model or use the existing one if it's already been defined
export default mongoose.models.Review || mongoose.model('Review', reviewSchema);
