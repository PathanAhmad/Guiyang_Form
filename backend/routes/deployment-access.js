const express = require('express');
const router = express.Router();
const DeploymentAccessKey = require('../models/DeploymentAccessKey');
const { authenticateAdmin } = require('./auth');

// Public route: Validate access key
router.post('/validate', async (req, res) => {
  try {
    const { accessKey, roleType } = req.body;

    // Validate request
    if (!accessKey || typeof accessKey !== 'string') {
      return res.status(400).json({
        success: false,
        valid: false,
        error: 'Access key is required',
      });
    }

    if (!roleType || !['school', 'educator', 'learner', 'special'].includes(roleType)) {
      return res.status(400).json({
        success: false,
        valid: false,
        error: 'Valid role type is required',
      });
    }

    // Find the key
    const key = await DeploymentAccessKey.findOne({
      accessKey: accessKey.trim(),
      roleType: roleType,
    });

    if (!key) {
      return res.status(200).json({
        success: false,
        valid: false,
        error: 'Invalid access key for this role',
      });
    }

    // Check if key is valid
    const validationResult = key.isValid();
    if (!validationResult.valid) {
      return res.status(200).json({
        success: false,
        valid: false,
        error: validationResult.reason,
      });
    }

    // Increment usage count
    await key.incrementUsage();

    // Return success
    return res.status(200).json({
      success: true,
      valid: true,
      data: {
        keyName: key.keyName,
        roleType: key.roleType,
        usageCount: key.usageCount,
        maxUses: key.maxUses,
        expiresAt: key.expiresAt,
      },
    });
  } catch (error) {
    console.error('❌ Error validating deployment access key:', error);
    return res.status(500).json({
      success: false,
      valid: false,
      error: 'Server error',
    });
  }
});

// Protected route: Create new access key (Admin only)
router.post('/create', authenticateAdmin, async (req, res) => {
  try {
    const { keyName, roleType, duration, maxUses } = req.body;

    // Validate request
    if (!keyName || typeof keyName !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Key name is required',
      });
    }

    if (!roleType || !['school', 'educator', 'learner', 'special'].includes(roleType)) {
      return res.status(400).json({
        success: false,
        error: 'Valid role type is required',
      });
    }

    // Calculate expiration date based on duration
    let expiresAt = null;
    if (duration && duration !== 'never') {
      const durationMap = {
        '1day': 1,
        '1week': 7,
        '1month': 30,
        '3months': 90,
        '6months': 180,
        '1year': 365,
      };
      const days = durationMap[duration];
      if (days) {
        expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + days);
      }
    }

    // Parse max uses
    let maxUsesValue = null;
    if (maxUses && maxUses !== 'unlimited') {
      maxUsesValue = parseInt(maxUses, 10);
      if (isNaN(maxUsesValue) || maxUsesValue < 1) {
        return res.status(400).json({
          success: false,
          error: 'Invalid max uses value',
        });
      }
    }

    // Generate unique access key
    let accessKey;
    let isUnique = false;
    let attempts = 0;
    while (!isUnique && attempts < 10) {
      accessKey = DeploymentAccessKey.generateKey();
      const existing = await DeploymentAccessKey.findOne({ accessKey });
      if (!existing) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate unique access key',
      });
    }

    // Create the key
    const newKey = new DeploymentAccessKey({
      keyName,
      accessKey,
      roleType,
      expiresAt,
      maxUses: maxUsesValue,
      createdBy: req.user.userid,
      metadata: {
        duration: duration || 'never',
        originalMaxUses: maxUses || 'unlimited',
      },
    });

    await newKey.save();

    console.log(`✅ Deployment access key created: ${keyName} (${roleType})`);

    return res.status(201).json({
      success: true,
      message: 'Access key created successfully',
      data: {
        id: newKey._id,
        keyName: newKey.keyName,
        accessKey: newKey.accessKey,
        roleType: newKey.roleType,
        expiresAt: newKey.expiresAt,
        maxUses: newKey.maxUses,
        usageCount: newKey.usageCount,
        isActive: newKey.isActive,
        createdAt: newKey.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ Error creating deployment access key:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message,
    });
  }
});

// Protected route: List all access keys (Admin only)
router.get('/keys', authenticateAdmin, async (req, res) => {
  try {
    const keys = await DeploymentAccessKey.find()
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();

    // Add computed fields
    const keysWithStatus = keys.map((key) => {
      const now = new Date();
      const isExpired = key.expiresAt && now > new Date(key.expiresAt);
      const isMaxedOut = key.maxUses !== null && key.usageCount >= key.maxUses;
      const status = !key.isActive
        ? 'deactivated'
        : isExpired
        ? 'expired'
        : isMaxedOut
        ? 'maxed-out'
        : 'active';

      return {
        ...key,
        status,
        isExpired,
        isMaxedOut,
      };
    });

    return res.status(200).json({
      success: true,
      data: keysWithStatus,
      count: keysWithStatus.length,
    });
  } catch (error) {
    console.error('❌ Error listing deployment access keys:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message,
    });
  }
});

// Protected route: Deactivate access key (Admin only)
router.patch('/:id/deactivate', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const key = await DeploymentAccessKey.findById(id);
    if (!key) {
      return res.status(404).json({
        success: false,
        error: 'Access key not found',
      });
    }

    await key.deactivate();

    console.log(`✅ Deployment access key deactivated: ${key.keyName} (${key.roleType})`);

    return res.status(200).json({
      success: true,
      message: 'Access key deactivated successfully',
      data: {
        id: key._id,
        keyName: key.keyName,
        isActive: key.isActive,
      },
    });
  } catch (error) {
    console.error('❌ Error deactivating deployment access key:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message,
    });
  }
});

// Protected route: Delete access key (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const key = await DeploymentAccessKey.findByIdAndDelete(id);
    if (!key) {
      return res.status(404).json({
        success: false,
        error: 'Access key not found',
      });
    }

    console.log(`✅ Deployment access key deleted: ${key.keyName} (${key.roleType})`);

    return res.status(200).json({
      success: true,
      message: 'Access key deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting deployment access key:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message,
    });
  }
});

module.exports = router;

