import express from "express";
import protectRoute from "../middleware/protectRoute.js";
import {createOffer, getOffersForProduct, getOffersByUser, sellProduct, acceptOffer,updateOffer,findOffer,deleteOffer} from '../controllers/offer.controller.js';
const router = express.Router();


// Route to create an offer
router.post("/make-offer", protectRoute,createOffer);

// Route to get offers for a specific product
router.get("/offers/:productId", getOffersForProduct);

//Route to get all the offres for the product
router.get("/offers/user/:id", protectRoute, getOffersByUser);

router.put("/offers/edit/:offerId", protectRoute, updateOffer);

router.post("/offers/accept/:offerId", protectRoute, acceptOffer);

router.post("/sell-product", protectRoute, sellProduct);

router.get("/offers/find/:productId", protectRoute, findOffer);

router.delete("/offers/:offerId", deleteOffer);

export default router;