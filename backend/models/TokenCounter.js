const mongoose = require('mongoose');

const tokenCounterSchema = new mongoose.Schema({
  formType: {
    type: String,
    required: true,
    unique: true,
    enum: ['demo', 'showcase', 'fasttrack']
  },
  count: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  prefix: {
    type: String,
    required: true,
    enum: ['D', 'S', 'F']
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Static method to get next token
tokenCounterSchema.statics.getNextToken = async function(formType) {
  const prefixMap = {
    'demo': 'D',
    'showcase': 'S',
    'fasttrack': 'F'
  };
  
  const prefix = prefixMap[formType];
  if (!prefix) {
    throw new Error('Invalid form type');
  }
  
  // Use findOneAndUpdate with upsert to atomically increment
  const counter = await this.findOneAndUpdate(
    { formType },
    { 
      $inc: { count: 1 },
      $set: { 
        prefix,
        lastUpdated: new Date()
      }
    },
    { 
      new: true, 
      upsert: true,
      setDefaultsOnInsert: true
    }
  );
  
  // Format token as prefix-XXX (e.g., D-001, S-025, F-142)
  const tokenNumber = counter.count.toString().padStart(3, '0');
  return `${prefix}-${tokenNumber}`;
};

// Index for better query performance
tokenCounterSchema.index({ formType: 1 });

module.exports = mongoose.model('TokenCounter', tokenCounterSchema);
