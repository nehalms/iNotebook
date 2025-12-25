const express = require('express');
const fetchuser = require('../middleware/fetchuser');
const router = express.Router();

// Import all models
const User = require('../models/User');
const Notes = require('../models/Notes');
const Task = require('../models/Task');
const GameDetails = require('../models/GameDetails');
const LoginHistory = require('../models/LoginHistory');
const UserHistory = require('../models/UserHistory');
const SecurityPin = require('../models/SecurityPin');
const Events = require('../models/Events');
const PermissionRequest = require('../models/PermissionRequest');
const AuthOTP = require('../models/AuthOTP');
const NormalOTP = require('../models/NormalOTP');
const LiveUser = require('../models/LiveUser');

// Map of collection names to models
const collections = {
  'users': User,
  'notes': Notes,
  'tasks': Task,
  'gameDetails': GameDetails,
  'loginHistory': LoginHistory,
  'userHistory': UserHistory,
  'securityPin': SecurityPin,
  'events': Events,
  'permissionRequests': PermissionRequest,
  'authOTPs': AuthOTP,
  'normalOTPs': NormalOTP,
  'liveUsers': LiveUser,
};

// Get counts for all collections
router.get('/counts', fetchuser, async (req, res) => {
  try {
    // Check if user is admin
    const adminUser = await User.findById(req.user.id).select('isAdmin').lean();
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not Authorized' 
      });
    }

    // Get counts for all collections in parallel
    const counts = await Promise.all(
      Object.entries(collections).map(async ([name, Model]) => {
        try {
          const count = await Model.countDocuments();
          return { name, count };
        } catch (error) {
          console.error(`Error counting ${name}:`, error);
          return { name, count: 0, error: error.message };
        }
      })
    );

    // Convert to object format
    const countsObj = {};
    counts.forEach(({ name, count, error }) => {
      countsObj[name] = { count, error: error || null };
    });

    res.json({
      success: true,
      counts: countsObj,
    });
  } catch (err) {
    console.error('Error in /counts:', err.message);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal Server Error' 
    });
  }
});

// Delete all data from a collection
router.delete('/:collectionName', fetchuser, async (req, res) => {
  try {
    // Check if user is admin
    const adminUser = await User.findById(req.user.id).select('isAdmin').lean();
    if (!adminUser || !adminUser.isAdmin) {
      return res.status(403).json({ 
        success: false, 
        error: 'Not Authorized' 
      });
    }

    const { collectionName } = req.params;

    // Validate collection name
    if (!collections[collectionName]) {
      return res.status(400).json({ 
        success: false, 
        error: `Invalid collection name: ${collectionName}` 
      });
    }

    // Prevent deletion of critical collections (optional safety check)
    const criticalCollections = ['users'];
    if (criticalCollections.includes(collectionName)) {
      return res.status(400).json({ 
        success: false, 
        error: `Cannot delete critical collection: ${collectionName}` 
      });
    }

    const Model = collections[collectionName];

    // Delete all documents from the collection
    const result = await Model.deleteMany({});

    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} documents from ${collectionName}`,
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error(`Error deleting ${req.params.collectionName}:`, err.message);
    return res.status(500).json({ 
      success: false, 
      error: 'Internal Server Error' 
    });
  }
});

module.exports = router;

