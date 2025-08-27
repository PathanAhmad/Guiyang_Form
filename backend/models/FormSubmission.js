const mongoose = require('mongoose');

const formSubmissionSchema = new mongoose.Schema({
  // Common fields for all form types
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
  },
  phone: {
    type: String,
    trim: true,
    maxlength: 20
  },
  
  // Form type identifier
  formType: {
    type: String,
    required: true,
    enum: ['demo', 'showcase', 'fasttrack']
  },
  
  // Generated token
  token: {
    type: String,
    required: true,
    unique: true
  },
  
  // Extra fields for Fast-Track form
  company: {
    type: String,
    trim: true,
    maxlength: 100
  },
  role: {
    type: String,
    trim: true,
    maxlength: 100
  },
  message: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  
  // Status tracking
  status: {
    type: String,
    default: 'waiting',
    enum: ['waiting', 'contacted', 'completed', 'cancelled']
  },
  
  // Discord message tracking
  discordSent: {
    type: Boolean,
    default: false
  },
  discordError: {
    type: String
  },
  
  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
formSubmissionSchema.index({ formType: 1, submittedAt: -1 });
formSubmissionSchema.index({ token: 1 });
formSubmissionSchema.index({ email: 1 });

module.exports = mongoose.model('FormSubmission', formSubmissionSchema);
