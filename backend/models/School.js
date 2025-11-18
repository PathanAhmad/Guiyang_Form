const mongoose = require('mongoose');

const schoolSchema = new mongoose.Schema(
  {
    schoolName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      maxlength: 200,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
schoolSchema.index({ isActive: 1, createdAt: -1 });

// Instance method: Deactivate school
schoolSchema.methods.deactivate = async function() {
  this.isActive = false;
  await this.save();
  return this;
};

// Instance method: Activate school
schoolSchema.methods.activate = async function() {
  this.isActive = true;
  await this.save();
  return this;
};

// Static method: Get school with key counts
schoolSchema.statics.getWithKeyCounts = async function(schoolId) {
  const DeploymentAccessKey = require('./DeploymentAccessKey');
  
  const school = await this.findById(schoolId).lean();
  if (!school) return null;
  
  // Count keys by role type
  const keys = await DeploymentAccessKey.find({ schoolId }).lean();
  const keyCounts = {
    total: keys.length,
    byRole: {
      school: keys.filter(k => k.roleType === 'school').length,
      educator: keys.filter(k => k.roleType === 'educator').length,
      learner: keys.filter(k => k.roleType === 'learner').length,
      special: keys.filter(k => k.roleType === 'special').length,
    },
    active: keys.filter(k => k.isActive).length,
  };
  
  return {
    ...school,
    keyCounts,
  };
};

// Static method: Get all schools with key counts
schoolSchema.statics.getAllWithKeyCounts = async function() {
  const DeploymentAccessKey = require('./DeploymentAccessKey');
  
  const schools = await this.find().sort({ createdAt: -1 }).lean();
  
  // Get all keys grouped by school
  const allKeys = await DeploymentAccessKey.find().lean();
  const keysBySchool = {};
  
  allKeys.forEach(key => {
    // Skip keys without schoolId (safety check)
    if (!key.schoolId) {
      console.warn('⚠️ Found deployment key without schoolId:', key._id);
      return;
    }
    
    const schoolId = key.schoolId.toString();
    if (!keysBySchool[schoolId]) {
      keysBySchool[schoolId] = [];
    }
    keysBySchool[schoolId].push(key);
  });
  
  // Attach key counts to each school
  return schools.map(school => {
    const schoolId = school._id.toString();
    const keys = keysBySchool[schoolId] || [];
    
    return {
      ...school,
      keyCounts: {
        total: keys.length,
        byRole: {
          school: keys.filter(k => k.roleType === 'school').length,
          educator: keys.filter(k => k.roleType === 'educator').length,
          learner: keys.filter(k => k.roleType === 'learner').length,
          special: keys.filter(k => k.roleType === 'special').length,
        },
        active: keys.filter(k => k.isActive).length,
      },
    };
  });
};

module.exports = mongoose.model('School', schoolSchema);




