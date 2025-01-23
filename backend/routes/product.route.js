import express from 'express';

import { uploadImages, createProduct, deleteProduct, getProducts, getProductById, updateProduct } from "../controllers/product.controller.js";


const router = express.Router();


// Product routes

router.post('/products', uploadImages, createProduct);

router.get('/products', getProducts);

router.get('/products/:id', getProductById);

router.put('/products/:id', updateProduct);

router.delete('/products/:id', deleteProduct);


export default router;