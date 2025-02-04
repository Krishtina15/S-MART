import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {createOffer, getOffersForProduct, getOffersByUser, sellProduct, acceptOffer,updateOffer,findOffer} from '../controllers/offer.controller.js';
const router = express.Router();


// Route to create an offer
router.post("/make-offer", protectRoute,createOffer);

// Route to get offers for a specific product
router.get("/offers/:productId", getOffersForProduct);

//Route to get all the offres for the product
router.get("/offers/user", protectRoute, getOffersByUser);

router.put("/offers/edit/:offerId", protectRoute, updateOffer);

router.post("/offers/accept/:id", protectRoute, acceptOffer);

router.post("/sell-product", protectRoute, sellProduct);

router.get("/offers/find", protectRoute, findOffer);

export default router;