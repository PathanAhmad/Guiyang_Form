const mongoose = require('mongoose');

const globalCounterSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: 'global'
  },
  count: {
    type: Number,
    required: true,
    default: 0,
    min: 0
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Ensure counter exists and is at least a minimum value
globalCounterSchema.statics.ensureAtLeast = async function(minValue) {
  const counter = await this.findOneAndUpdate(
    { _id: 'global' },
    {
      $max: { count: minValue },
      $set: { lastUpdated: new Date() }
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );
  return counter.count;
};

// Static method to atomically get the next global number
globalCounterSchema.statics.getNextNumber = async function() {
  const counter = await this.findOneAndUpdate(
    { _id: 'global' },
    {
      $inc: { count: 1 },
      $set: { lastUpdated: new Date() }
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true
    }
  );

  return counter.count;
};

module.exports = mongoose.model('GlobalCounter', globalCounterSchema);


