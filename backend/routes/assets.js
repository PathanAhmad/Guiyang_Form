const express = require('express');
const router = express.Router();
const config = require('../config/environment');
const cloudinaryService = require('../services/cloudinaryService');

router.get('/config', (req, res) => {
  const isCloudinaryConfigured = cloudinaryService.isConfigured();
  const deliveryBase = cloudinaryService.getDeliveryBase();

  res.json({
    success: true,
    cloudinary: {
      configured: isCloudinaryConfigured,
      cloudName: config.CLOUDINARY.cloudName || '',
      deliveryBase,
      folder: config.CLOUDINARY.folder || '',
    },
  });
});

module.exports = router;



