const express = require('express');
const router = express.Router();
const SchoolOrganization = require('../models/SchoolOrganization');

const ALLOWED_TYPES = new Set(['management', 'educators', 'learners']);

router.post('/validate', async (req, res) => {
  try {
    const { accessKey, surveyType } = req.body || {};

    if (!accessKey || typeof accessKey !== 'string') {
      return res.status(400).json({ success: false, valid: false, error: 'Access key is required' });
    }
    if (!ALLOWED_TYPES.has(surveyType)) {
      return res.status(400).json({ success: false, valid: false, error: 'Invalid survey type' });
    }

    const query = {};
    query[`accessKeys.${surveyType}`] = accessKey.trim();

    const org = await SchoolOrganization.findOne(query).select('schoolName').lean();
    if (!org) {
      return res.status(200).json({ success: false, valid: false, error: 'Invalid access key' });
    }

    return res.status(200).json({ success: true, valid: true, schoolName: org.schoolName });
  } catch (error) {
    console.error('❌ Error validating survey access key:', error);
    return res.status(500).json({ success: false, valid: false, error: 'Server error' });
  }
});

module.exports = router;


