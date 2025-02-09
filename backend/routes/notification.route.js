import express from "express";
import { getNotifications, markAsRead } from "../controllers/notification.controller.js";
import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

router.get("/notifications/:userId", protectRoute,getNotifications);
router.put("/notifications/:notificationId/read", protectRoute,markAsRead);
export default router;