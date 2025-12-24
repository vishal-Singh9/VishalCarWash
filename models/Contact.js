import mongoose from 'mongoose';

const contactSchema = new mongoose.Schema({
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
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [200, 'Subject cannot be more than 200 characters']
  },
  message: {
    type: String,
    required: [true, 'Message is required'],
    trim: true,
    maxlength: [2000, 'Message cannot be more than 2000 characters']
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'resolved', 'spam'],
    default: 'new'
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
contactSchema.index({
  name: 'text',
  email: 'text',
  subject: 'text',
  message: 'text'
});

// Pre-save hook to clean data
contactSchema.pre('save', function(next) {
  // Trim all string fields
  Object.keys(this.schema.paths).forEach(field => {
    if (this[field] && this.schema.paths[field].instance === 'String') {
      this[field] = this[field].trim();
    }
  });
  next();
});

// Static method to create a new contact
contactSchema.statics.createContact = async function(contactData, req) {
  const contact = new this({
    ...contactData,
    ipAddress: req?.ip || req?.connection?.remoteAddress,
    userAgent: req?.headers?.['user-agent']
  });
  return await contact.save();
};

// Check if model exists before compiling it
const Contact = mongoose.models.Contact || mongoose.model('Contact', contactSchema);

export default Contact;