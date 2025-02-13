

import express from "express";
import {recordSale ,getSalesBySeller ,getWeeklySalesRevenue} from "../controllers/productSale.controllers.js"

const router = express.Router();

router.post('/sales-record',recordSale);
router.get('/salesBy/:sellerId',getSalesBySeller);
router.get('/weeklySales/:sellerId', getWeeklySalesRevenue);

export default router;