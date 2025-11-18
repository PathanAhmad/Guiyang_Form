const express = require('express');
const router = express.Router();
const School = require('../models/School');
const DeploymentAccessKey = require('../models/DeploymentAccessKey');
const { authenticateAdmin } = require('./auth');

// Protected route: Create new school (Admin only)
router.post('/', authenticateAdmin, async (req, res) => {
  try {
    const { schoolName, description, metadata } = req.body;

    // Validate request
    if (!schoolName || typeof schoolName !== 'string' || !schoolName.trim()) {
      return res.status(400).json({
        success: false,
        error: 'School name is required',
      });
    }

    // Check if school name already exists
    const existing = await School.findOne({ schoolName: schoolName.trim() });
    if (existing) {
      return res.status(400).json({
        success: false,
        error: 'A school with this name already exists',
      });
    }

    // Create the school
    const newSchool = new School({
      schoolName: schoolName.trim(),
      description: description?.trim() || '',
      metadata: metadata || {},
    });

    await newSchool.save();

    console.log(`✅ School created: ${newSchool.schoolName}`);

    return res.status(201).json({
      success: true,
      message: 'School created successfully',
      data: {
        id: newSchool._id,
        schoolName: newSchool.schoolName,
        description: newSchool.description,
        isActive: newSchool.isActive,
        createdAt: newSchool.createdAt,
      },
    });
  } catch (error) {
    console.error('❌ Error creating school:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message,
    });
  }
});

// Protected route: List all schools with key counts (Admin only)
router.get('/', authenticateAdmin, async (req, res) => {
  try {
    const schools = await School.getAllWithKeyCounts();

    return res.status(200).json({
      success: true,
      data: schools,
      count: schools.length,
    });
  } catch (error) {
    console.error('❌ Error listing schools:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message,
    });
  }
});

// Protected route: Get single school with all its keys (Admin only)
router.get('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const school = await School.findById(id);
    if (!school) {
      return res.status(404).json({
        success: false,
        error: 'School not found',
      });
    }

    // Get all keys for this school
    const keys = await DeploymentAccessKey.find({ schoolId: id })
      .sort({ createdAt: -1 })
      .select('-__v')
      .lean();

    // Add computed status to keys
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
      data: {
        school: school.toObject(),
        keys: keysWithStatus,
        keyCount: keysWithStatus.length,
      },
    });
  } catch (error) {
    console.error('❌ Error getting school:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message,
    });
  }
});

// Protected route: Update school details (Admin only)
router.patch('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { schoolName, description, isActive, metadata } = req.body;

    const school = await School.findById(id);
    if (!school) {
      return res.status(404).json({
        success: false,
        error: 'School not found',
      });
    }

    // Update fields if provided
    if (schoolName !== undefined) {
      const trimmedName = schoolName.trim();
      if (!trimmedName) {
        return res.status(400).json({
          success: false,
          error: 'School name cannot be empty',
        });
      }
      
      // Check if new name conflicts with existing school
      const existing = await School.findOne({ 
        schoolName: trimmedName,
        _id: { $ne: id }
      });
      if (existing) {
        return res.status(400).json({
          success: false,
          error: 'A school with this name already exists',
        });
      }
      
      school.schoolName = trimmedName;
    }

    if (description !== undefined) {
      school.description = description.trim();
    }

    if (isActive !== undefined) {
      school.isActive = Boolean(isActive);
    }

    if (metadata !== undefined) {
      school.metadata = { ...school.metadata, ...metadata };
    }

    await school.save();

    console.log(`✅ School updated: ${school.schoolName}`);

    return res.status(200).json({
      success: true,
      message: 'School updated successfully',
      data: school.toObject(),
    });
  } catch (error) {
    console.error('❌ Error updating school:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message,
    });
  }
});

// Protected route: Delete school (Admin only)
router.delete('/:id', authenticateAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const school = await School.findById(id);
    if (!school) {
      return res.status(404).json({
        success: false,
        error: 'School not found',
      });
    }

    // Check if school has any access keys
    const keyCount = await DeploymentAccessKey.countDocuments({ schoolId: id });
    if (keyCount > 0) {
      return res.status(400).json({
        success: false,
        error: `Cannot delete school with existing access keys. Please delete all ${keyCount} key(s) first.`,
        keyCount,
      });
    }

    await School.findByIdAndDelete(id);

    console.log(`✅ School deleted: ${school.schoolName}`);

    return res.status(200).json({
      success: true,
      message: 'School deleted successfully',
    });
  } catch (error) {
    console.error('❌ Error deleting school:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error',
      details: error.message,
    });
  }
});

module.exports = router;




