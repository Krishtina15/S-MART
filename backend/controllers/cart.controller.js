import mongoose from 'mongoose';
import Product from "../models/product.model.js";
import User from "../models/user.model.js"; 
import Cart from '../models/cart.model.js';

export const createCart = async (req, res) => {
	try {
	  const {  userId,productId } = req.body;
  
	  if (!productId || !userId  === 0) {
		return res.status(400).json({ success: false, message: "Please provide all fields including images" });
	  }
  
	  
  
	  // Create the new product
	  const newCart= new Cart({
		productId, 
        userId
	  });
  
	  // Save the product
	  await newCart.save();
  
	  // Add the new product to the user's "products" array
	  await User.findByIdAndUpdate(
		userId,
		{ $push: { products: newCart._id } }, // Push the new product's ID to the user's products array
		{ new: true }
	  );
  
	  res.status(201).json({ success: true, data: newCart });
	} catch (error) {
	  console.error("Error in Add Cart:", error.message);
	  res.status(500).json({ success: false, message: error.message });
	}
  };

  export const deleteCart = async (req, res) => {
    const { id } = req.params; 
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ success: false, message: "Invalid Cart Id" });
    }
  
    try {
      const cart = await Cart.findById(id);
      if (!cart) {
        return res.status(404).json({ success: false, message: "Cart not found" });
      }
      const userId = cart.userId;
      await User.findByIdAndUpdate(
        userId,
        { $pull: { cart: id } }, // Remove the product ID from the user's products array
        { new: true }
      );
  
      
      const deletedCart = await Cart.findByIdAndDelete(id);
      if (!deletedCart) {
        return res.status(404).json({ success: false, message: "Cart not found" });
      }
      res.status(200).json({ success: true, message: "Cart deleted" });
    } catch (error) {
      console.log("error in deleting cart:", error.message);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  };

  export const getUserCart = async (req, res) => {
	const { userId } = req.params;
  
	try {
	  // Find user and populate products with detailed product info
	  const cart = await Cart.find({userId}).populate("productId", "productName price");;
	  
	  if (!cart) {
		return res.status(404).json({ success: false, message: "User not found" });
	  }
  
	  res.status(200).json({ success: true,data: cart });
	} catch (error) {
	  console.error("Error in fetching user cart:", error.message);
	  res.status(500).json({ success: false, message: "Server Error" });
	}
  };