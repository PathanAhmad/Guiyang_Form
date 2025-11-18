const mongoose = require('mongoose');

const deploymentAccessKeySchema = new mongoose.Schema(
  {
    // Key identification
    keyName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    accessKey: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    
    // School reference
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'School',
      required: true,
      index: true,
    },
    
    // Role assignment
    roleType: {
      type: String,
      required: true,
      enum: ['school', 'educator', 'learner', 'special'],
      index: true,
    },
    
    // Expiration and usage limits
    expiresAt: {
      type: Date,
      default: null, // null means never expires
    },
    maxUses: {
      type: Number,
      default: null, // null means unlimited uses
      min: 1,
    },
    usageCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    // Status
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    
    // Admin tracking
    createdBy: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Additional metadata
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Instance method: Check if key is valid for use
deploymentAccessKeySchema.methods.isValid = function() {
  // Check if key is active
  if (!this.isActive) {
    return { valid: false, reason: 'Key is deactivated' };
  }
  
  // Check if key has expired
  if (this.expiresAt && new Date() > this.expiresAt) {
    return { valid: false, reason: 'Key has expired' };
  }
  
  // Check if max uses exceeded
  if (this.maxUses !== null && this.usageCount >= this.maxUses) {
    return { valid: false, reason: 'Maximum uses reached' };
  }
  
  return { valid: true };
};

// Instance method: Increment usage count
deploymentAccessKeySchema.methods.incrementUsage = async function() {
  this.usageCount += 1;
  await this.save();
  return this;
};

// Instance method: Deactivate key
deploymentAccessKeySchema.methods.deactivate = async function() {
  this.isActive = false;
  await this.save();
  return this;
};

// Instance method: Reactivate key
deploymentAccessKeySchema.methods.reactivate = async function() {
  this.isActive = true;
  await this.save();
  return this;
};

// Static method: Generate a random access key
deploymentAccessKeySchema.statics.generateKey = function(length = 16) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = '';
  for (let i = 0; i < length; i++) {
    if (i > 0 && i % 4 === 0) {
      key += '-';
    }
    key += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return key;
};

// Compound indexes for faster queries
deploymentAccessKeySchema.index({ accessKey: 1, isActive: 1 });
deploymentAccessKeySchema.index({ roleType: 1, isActive: 1 });
deploymentAccessKeySchema.index({ schoolId: 1, roleType: 1, createdAt: -1 });
deploymentAccessKeySchema.index({ schoolId: 1, isActive: 1 });

module.exports = mongoose.model('DeploymentAccessKey', deploymentAccessKeySchema);

