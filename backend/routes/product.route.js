import express from "express";

import { createProduct, deleteProduct, getProducts, updateProduct, uploadImages,getUserProducts} from "../controllers/product.controller.js";

const router = express.Router();

router.get("/", getProducts);
router.post("/",uploadImages,createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

router.get("/user/:userId/products", getUserProducts);
export default router;