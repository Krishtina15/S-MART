// import express from "express";

// import { createProduct, deleteProduct, getProducts, updateProduct, uploadImages,getUserProducts, getProductById,searchProducts,incrementView } from "../controllers/product.controller.js";

// const router = express.Router();

// router.get('/search', searchProducts); // Search route FIRST
// router.get('/:id', getProductById); // Product by ID
// router.get("/user/:userId/products", getUserProducts); // Products by user
// router.put("/:id", updateProduct); // Update product
// router.delete("/:id", deleteProduct); // Delete product
// router.post("/",uploadImages,createProduct); // Create product
// router.get("/", getProducts); // Get all products (LEAST SPECIFIC)
// export default router;

import express from "express";
import {recordSale ,getSalesBySeller ,getWeeklySalesRevenue} from "../controllers/productSale.controllers.js"

const router = express.Router();

router.post('/sales-record',recordSale);
router.get('/salesBy/:sellerId',getSalesBySeller);
router.get('/weeklySales/:sellerId', getWeeklySalesRevenue);

export default router;