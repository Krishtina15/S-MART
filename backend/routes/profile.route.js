const express = require('express');
const router = express.Router();
const auth = require('../middleware/protectRoute');
const { getUserProfile, updateUserProfile } = require('../controllers/profile.controllers');

// Get user profile
router.get('/', auth, getUserProfile);

// Update profile
router.put('/', auth, updateUserProfile);

module.exports = router;
