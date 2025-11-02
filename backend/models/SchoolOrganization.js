const mongoose = require('mongoose');

const accessKeysSchema = new mongoose.Schema(
  {
    management: { type: String, trim: true, index: true, unique: true, sparse: true },
    educators: { type: String, trim: true, index: true, unique: true, sparse: true },
    learners: { type: String, trim: true, index: true, unique: true, sparse: true },
  },
  { _id: false }
);

const schoolOrganizationSchema = new mongoose.Schema(
  {
    schoolName: { type: String, required: true, trim: true },
    accessKeys: { type: accessKeysSchema, default: {} },
  },
  { timestamps: true }
);

// Compound indexes for faster lookups (optional but helpful for analytics)
schoolOrganizationSchema.index({ 'accessKeys.management': 1 });
schoolOrganizationSchema.index({ 'accessKeys.educators': 1 });
schoolOrganizationSchema.index({ 'accessKeys.learners': 1 });

module.exports = mongoose.model('SchoolOrganization', schoolOrganizationSchema);


