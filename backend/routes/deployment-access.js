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
    const { keyName, roleType, duration, maxUses, schoolId } = req.body;

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

    if (!schoolId || typeof schoolId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'School ID is required',
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
      schoolId,
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

// Protected route: Create multiple access keys (Admin only)
router.post('/create-bulk', authenticateAdmin, async (req, res) => {
  try {
    const { keys, schoolId, duration, maxUses } = req.body;

    // Validate request
    if (!Array.isArray(keys) || keys.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Keys array is required and must not be empty',
      });
    }

    if (!schoolId || typeof schoolId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'School ID is required',
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

    // Validate each key entry
    for (const key of keys) {
      if (!key.keyName || typeof key.keyName !== 'string') {
        return res.status(400).json({
          success: false,
          error: 'Each key must have a valid key name',
        });
      }
      if (!key.roleType || !['school', 'educator', 'learner', 'special'].includes(key.roleType)) {
        return res.status(400).json({
          success: false,
          error: 'Each key must have a valid role type',
        });
      }
    }

    // Generate and create all keys
    const createdKeys = [];
    const errors = [];

    for (const keyData of keys) {
      try {
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
          errors.push({
            keyName: keyData.keyName,
            error: 'Failed to generate unique access key',
          });
          continue;
        }

        // Create the key
        const newKey = new DeploymentAccessKey({
          keyName: keyData.keyName,
          accessKey,
          schoolId,
          roleType: keyData.roleType,
          expiresAt,
          maxUses: maxUsesValue,
          createdBy: req.user.userid,
          metadata: {
            duration: duration || 'never',
            originalMaxUses: maxUses || 'unlimited',
            bulkCreated: true,
          },
        });

        await newKey.save();
        createdKeys.push({
          id: newKey._id,
          keyName: newKey.keyName,
          accessKey: newKey.accessKey,
          roleType: newKey.roleType,
        });

        console.log(`✅ Bulk access key created: ${newKey.keyName} (${newKey.roleType})`);
      } catch (error) {
        errors.push({
          keyName: keyData.keyName,
          error: error.message,
        });
      }
    }

    return res.status(201).json({
      success: true,
      message: `Successfully created ${createdKeys.length} access key(s)`,
      data: {
        created: createdKeys,
        errors: errors.length > 0 ? errors : undefined,
        totalRequested: keys.length,
        totalCreated: createdKeys.length,
        totalFailed: errors.length,
      },
    });
  } catch (error) {
    console.error('❌ Error creating bulk access keys:', error);
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
    const { schoolId } = req.query;
    const School = require('../models/School');
    
    // Build query filter
    const filter = schoolId ? { schoolId } : {};
    
    const keys = await DeploymentAccessKey.find(filter)
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();

    // Get unique school IDs (safely handle keys without schoolId)
    const schoolIds = [
      ...new Set(
        keys
          .filter(k => k.schoolId)
          .map(k => k.schoolId.toString())
      ),
    ];
    const schools = await School.find({ _id: { $in: schoolIds } }).lean();
    const schoolMap = {};
    schools.forEach(school => {
      schoolMap[school._id.toString()] = school;
    });

    // Add computed fields and school information
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

      // Safely resolve school for keys that may not have a schoolId
      if (!key.schoolId) {
        console.warn('⚠️ Access key without schoolId:', key._id);
      }
      const schoolIdStr = key.schoolId ? key.schoolId.toString() : null;
      const school = schoolIdStr ? schoolMap[schoolIdStr] : null;

      return {
        ...key,
        status,
        isExpired,
        isMaxedOut,
        school: school ? {
          id: school._id,
          schoolName: school.schoolName,
          isActive: school.isActive,
        } : null,
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

