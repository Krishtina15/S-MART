import express from "express";
import { createCart,deleteCart,getUserCart } from "../controllers/cart.controller.js";

const router = express.Router();

router.delete("/:id", deleteCart); // Delete product
router.post("/",createCart);
router.get("/user/:userId/cart", getUserCart);
export default router;