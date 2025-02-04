import express from "express";
import {login, logout, signup} from '../controllers/auth.controller.js';
import { uploadImages } from "../controllers/auth.controller.js";
const router = express.Router();

router.post("/signup",uploadImages,signup);

router.post("/login",login);

router.post("/logout",logout);

export default router;