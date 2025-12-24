import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot be more than 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      'Please enter a valid email address'
    ]
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  category: {
    type: String,
    enum: ['service', 'quality', 'staff', 'pricing', 'overall', 'other'],
    default: 'overall'
  },
  feedback: {
    type: String,
    required: [true, 'Feedback is required'],
    trim: true,
    maxlength: [1000, 'Feedback cannot be more than 1000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'reviewed', 'resolved', 'archived'],
    default: 'new'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  ipAddress: {
    type: String,
    trim: true
  },
  userAgent: {
    type: String,
    trim: true
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Add text index for search functionality
feedbackSchema.index({
  name: 'text',
  email: 'text',
  feedback: 'text'
});

// Add compound index for filtering
feedbackSchema.index({ status: 1, rating: -1, createdAt: -1 });

// Pre-save hook to clean data
feedbackSchema.pre('save', function(next) {
  // Trim all string fields
  Object.keys(this.schema.paths).forEach(field => {
    if (this[field] && this.schema.paths[field].instance === 'String') {
      this[field] = this[field].trim();
    }
  });
  next();
});

// Static method to create a new feedback
feedbackSchema.statics.createFeedback = async function(feedbackData, req) {
  const feedback = new this({
    ...feedbackData,
    ipAddress: req?.ip || req?.connection?.remoteAddress,
    userAgent: req?.headers?.['user-agent']
  });
  return await feedback.save();
};

// Static method to get average rating
feedbackSchema.statics.getAverageRating = async function() {
  const result = await this.aggregate([
    { $match: { status: { $ne: 'archived' } } },
    {
      $group: {
        _id: null,
        avgRating: { $avg: '$rating' },
        totalFeedbacks: { $sum: 1 }
      }
    }
  ]);
  
  return result.length > 0 ? result[0] : { avgRating: 0, totalFeedbacks: 0 };
};

// Check if model exists before compiling it
const Feedback = mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);

export default Feedback;

