import mongoose from 'mongoose';
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import Offer from "../models/offer.model.js";
import {io} from "../socket/socket.js";
import Notification from "../models/notification.model.js";

// POST request to create a new offer
export const createOffer = async (req, res) => {
  const { productId, price } = req.body;
  const buyerId = req.user._id;

  try {
    // Check if the buyer and product exist
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    // Check if the buyer has already made an offer for this product
    const existingOffer = await Offer.findOne({ buyerId, productId });
    if (existingOffer) {
      return res.status(400).json({ success: false, message: "You have already made an offer for this product" });
    }

    // Create the offer
    const offer = new Offer({
      buyerId,
      sellerId: product.userId, // Assuming the seller is the product's userId
      productId,
      price,
      status: 'pending', // Set the initial status of the offer to pending
    });

    

    // Save the offer to the database
    await offer.save();
    // Create a notification for the seller
    const notification = new Notification({
      userId: product.userId, // Seller's ID
      message: `You have a new offer for ${product.productName} from ${req.user.username}.`,
      type: "newOffer",
      metadata: { offerId: offer._id, productId: product._id },
    });

    await notification.save();

    // Emit the notification to the seller in real time
    io.to(product.userId).emit("newNotification", notification);
    res.status(201).json({ success: true, data: offer });
  } catch (error) {
    console.error("Error creating offer:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get offers for a specific product
export const getOffersForProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const offers = await Offer.find({ productId })
      .populate("buyerId", "username email") // Populate buyer details
      .populate("sellerId", "username email") // Populate seller details
      .populate("productId", "productName price"); // Populate product details

    if (offers.length === 0) {
      return res.status(404).json({ message: "No offers found for this product" });
    }

    return res.status(200).json({ message: "Offers fetched successfully", data: offers });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error fetching offers", error });
  }
};

// Update offer price
export const updateOffer = async (req, res) => {
    const { offerId } = req.params;
    const { price } = req.body;
    try {
      // Find the specific offer using both productId and orderId and update its price
      
  
      const offer = await Offer.findByIdAndUpdate(
            offerId,
            { price },
            { new: true }
        );

        if (!offer) {
            return res.status(404).json({ success: false, message: "Offer not found" });
        }

        res.status(200).json({ success: true, data: offer });
    }  catch (error) {
      console.error("Error updating offer:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };
  
// Accept an offer (seller's action)
export const acceptOffer = async (req, res) => {
  const { offerId } = req.params;
  console.log(offerId);
  try {
    // Fetch the offer and check if it's valid
    const offer = await Offer.findById(offerId).populate("productId");
    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }
    const productId= offer.productId;
    const buyerId = offer.buyerId;

    // Ensure only the seller can accept the offer
    if (offer.sellerId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: "You are not authorized to accept this offer" });
    }

    // Update the offer status to accepted
    offer.status = "accepted";
    await offer.save();

    await Product.findByIdAndUpdate(
      productId,
      { $set: { buyerId: buyerId } }, // Push the new product's ID to the user's products array
      { new: true }
      );
    
// Reject all other offers for the same product
await Offer.updateMany(
  { productId, _id: { $ne: offerId } },
  { status: "rejected" }
);

// Create a notification for the accepted buyer
const acceptedNotification = new Notification({
  userId: offer.buyerId,
  message: `Your offer for ${offer.productId.productName} has been accepted! Please proceed with the payment.`,
  type: "offerAccepted",
  metadata: { offerId: offer._id, productId: productId },
});

await acceptedNotification.save();
io.to(offer.buyerId).emit("newNotification", acceptedNotification);



// Create notifications for rejected buyers
const otherOffers = await Offer.find({ productId, _id: { $ne: offerId } });
for (const otherOffer of otherOffers) {
  const rejectedNotification = new Notification({
    userId: otherOffer.buyerId,
    message: `Sorry, your offer for ${otherOffer.productId.productName} has been rejected.`,
    type: "offerRejected",
    metadata: { offerId: otherOffer._id, productId: productId },
  });

  await rejectedNotification.save();
  io.to(otherOffer.buyerId).emit("newNotification", rejectedNotification);
}

    res.status(200).json({ success: true, message: "Offer accepted", data: offer });
  } catch (error) {
    console.error("Error accepting offer:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Mark product as sold and notify the buyer (this is where you would handle the transaction)
export const sellProduct = async (req, res) => {
  const { productId } = req.body;

  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ success: false, message: "Offer or Product not found" });
    }

    // Mark the product as sold
    product.sold = true;
    await product.save();

    // Optionally, notify the buyer (This could be done via email or in-app notification)
    const buyer = await User.findById(offer.buyerId);
    // Send notification (pseudo-code, needs to be implemented)
    // sendNotification(buyer, `You successfully bought the product: ${product.productName}`);

    res.status(200).json({ success: true, message: "Product sold successfully" });
  } catch (error) {
    console.error("Error selling product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get all offers made by the authenticated user
export const getOffersByUser = async (req, res) => {
    const { id } = req.params;
  try {
    const offers = await Offer.find({ buyerId: id })
      
      .populate("productId", "productName price"); // Populate product details

    if (offers.length === 0) {
      return res.status(404).json({ message: "No offers found" });
    }
    return res.status(200).json({ data: offers });
  } catch (error) {
    res.status(500).json({ message: "Error fetching offers", error });
  }
};

export const findOffer = async (req,res)=>{
    const { productId } = req.params;
    const buyerId = req.user._id;
    console.log(productId)
    console.log(buyerId)
    if (!productId || !buyerId) {
        return res.status(400).json({ success: false, message: "Missing parameters" });
    }
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ success: false, message: "Invalid productId format" });
      }
    try {
        const offer = await Offer.findOne({ 
            productId: productId,
            buyerId: buyerId
        });
        console.log(offer)
        if (!offer) {
            return res.status(404).json({ success: false, message: "Offer not found" });
        }

        res.json({ success: true, offerId: offer._id, offer });
    } catch (error) {
        console.log(error)
        //res.status(500).json({ success: false, message: "Server error", error });
    }
};


export const deleteOffer = async (req, res) => {
  const { offerId } = req.params;

  try {
    const offer = await Offer.findByIdAndDelete(offerId);
    if (!offer) {
      return res.status(404).json({ success: false, message: "Offer not found" });
    }
    res.status(200).json({ success: true, message: "Offer deleted" });
  } catch (error) {
    console.error("Error deleting offer:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
