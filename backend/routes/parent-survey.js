const express = require('express');
const router = express.Router();
const ParentSurveyResponse = require('../models/ParentSurveyResponse');
const { validationSchemas } = require('../middleware/validation');

// Lightweight middleware using existing validation map
const validateParentSurvey = (req, res, next) => {
  const schema = validationSchemas.parentSurvey;
  const { error, value } = schema.validate(req.body, { abortEarly: false, stripUnknown: true });
  if (error) {
    const details = error.details.map(d => ({ field: d.path.join('.'), message: d.message }));
    return res.status(400).json({ success: false, error: 'Validation failed', details });
  }
  req.validated = value;
  next();
};

// Submit parent/guardian survey
router.post('/', validateParentSurvey, async (req, res) => {
  try {
    const doc = await ParentSurveyResponse.create(req.validated);
    return res.status(201).json({ success: true, data: { id: doc._id, submittedAt: doc.createdAt } });
  } catch (err) {
    console.error('❌ Error saving parent survey:', err);
    return res.status(500).json({ success: false, error: 'Failed to save survey' });
  }
});

module.exports = router;





