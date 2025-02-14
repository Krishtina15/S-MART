import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import{ getUserProfile, updateUserProfile } from '../controllers/profile.controllers.js';


const router = express.Router();
// Get user profile
router.get('/:id', protectRoute, getUserProfile);

// Update profile
router.put('/:id/update', protectRoute, updateUserProfile);

export default router;
