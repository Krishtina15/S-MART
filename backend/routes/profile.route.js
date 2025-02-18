import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import{ getUserProfile, updateUserProfile } from '../controllers/profile.controllers.js';


const router = express.Router();
// Get user profile
router.get('/:id',  getUserProfile);

// Update profile
router.put('/:id/update',updateUserProfile);

export default router;
