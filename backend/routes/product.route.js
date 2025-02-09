import express from "express";

import { createProduct, deleteProduct, getProducts, updateProduct, uploadImages,getUserProducts, getProductById,searchProducts} from "../controllers/product.controller.js";

const router = express.Router();

router.get('/search', searchProducts); // Search route FIRST
router.get('/:id', getProductById); // Product by ID
router.get("/user/:userId/products", getUserProducts); // Products by user
router.put("/:id", updateProduct); // Update product
router.delete("/:id", deleteProduct); // Delete product
router.post("/",uploadImages,createProduct); // Create product
router.get("/", getProducts); // Get all products (LEAST SPECIFIC)
export default router;
