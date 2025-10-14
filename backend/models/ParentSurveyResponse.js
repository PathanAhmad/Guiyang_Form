const mongoose = require('mongoose');

const parentSurveyResponseSchema = new mongoose.Schema({
  // Consent
  consentParticipate: { type: Boolean, required: true },
  confirmAdult: { type: Boolean, required: true },

  // Respondent info
  name: { type: String, trim: true },
  contactEmail: { type: String, trim: true, lowercase: true },
  country: { type: String, trim: true },
  age: { type: Number, min: 18, max: 100 },

  // Section 1: Background Information
  contactPhone: { type: String, trim: true },
  relationship: { type: String, trim: true }, // parent | guardian | other
  relationshipOther: { type: String, trim: true },
  childAgeRange: { type: String, trim: true }, // 5-10 | 11-15 | 16-18 | above18 | preferNotSay
  schoolingLevel: { type: String, trim: true }, // primary | secondary | higherSecondary | university
  aiFamiliarity: { type: String, trim: true }, // notFamiliar | somewhat | familiar | very
  childDevices: [{ type: String, trim: true }],
  childDevicesOther: { type: String, trim: true },

  // Section 2A: Parent/Guardian AI usage
  parentAiUsageFrequency: { type: String, trim: true },
  parentAiExperience: { type: String, trim: true },
  parentAiConfidence: { type: String, trim: true },
  parentAiPurposes: [{ type: String, trim: true }],
  parentAiPurposesOther: { type: String, trim: true },

  // Section 2B: Current AI Usage by Child
  childAiUsageLocation: { type: String, trim: true },
  childAiFrequency: { type: String, trim: true },
  childAiPurposes: [{ type: String, trim: true }],
  childAiPurposesOther: { type: String, trim: true },
  childAiToolsOften: { type: String, trim: true },
  childObservedChanges: [{ type: String, trim: true }],
  childObservedChangesOther: { type: String, trim: true },
  childBenefits: [{ type: String, trim: true }],
  childBenefitsOther: { type: String, trim: true },
  childConcerns: [{ type: String, trim: true }],
  childConcernsOther: { type: String, trim: true },
  aiSupportTeachersParents: { type: String, trim: true },
  parentGuidanceConfidence: { type: String, trim: true },

  // Section 3: Perception and Expectations
  perceivedBenefits: { type: String, trim: true },
  perceivedConcerns: { type: String, trim: true },
  importanceHumanInvolvement: { type: String, trim: true },
  aiSupportEmotionalFocus: { type: String, trim: true },
  likelihoodEncourageAi: { type: String, trim: true },
  preferredGuardrails: [{ type: String, trim: true }],
  preferredGuardrailsOther: { type: String, trim: true },

  // Section 4: Experience Before and After Using AI
  preAiLearningHabits: { type: String, trim: true },
  preAiLearningHabitsOther: { type: String, trim: true },
  postAiImprovements: [{ type: String, trim: true }],
  engagingEnjoyable: { type: String, trim: true },
  aiInclusivity: { type: String, trim: true },
  specificLearningConsiderations: [{ type: String, trim: true }],

  // Section 5: Understanding SparkOS
  heardOfSparkOS: { type: String, trim: true }, // yes | no
  sparkosDistinctiveness: [{ type: String, trim: true }],
  sparkosDistinctivenessOther: { type: String, trim: true },
  importanceTrackingFocusEmotion: { type: String, trim: true },
  comfortableBehaviorAnalysis: { type: String, trim: true },
  trustFeatures: [{ type: String, trim: true }],
  trustFeaturesOther: { type: String, trim: true },
  expectedOutcomes: [{ type: String, trim: true }],
  likelihoodTrySparkOS: { type: Number, min: 0, max: 10 },

  // Section 6: Looking Ahead
  aiRoleNextFiveYears: { type: String, trim: true },
  aiRoleNextFiveYearsOther: { type: String, trim: true },
  considerSparkOSFuture: { type: String, trim: true },
  additionalThoughts: { type: String, trim: true },
  contactEmail: { type: String, trim: true, lowercase: true },

  // Optional Open Feedback
  supportTrainingNeeds: { type: String, trim: true },
  empathyFocusOpinion: { type: String, trim: true },
  idealAiCompanion: { type: String, trim: true },

  // Metadata
  submittedAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, {
  timestamps: true
});

parentSurveyResponseSchema.index({ submittedAt: -1 });

module.exports = mongoose.model('ParentSurveyResponse', parentSurveyResponseSchema);



