import mongoose from "mongoose";
import multer from 'multer';
import Product from "../models/product.model.js";

// Configure Multer for file storage
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
	  cb(null, 'uploads/images'); // Specify the directory for uploaded images
	},
	filename: (req, file, cb) => {
	  cb(null, `${Date.now()}-${file.originalname}`);
	},
  });
  
  const upload = multer({
	storage,
	limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
	fileFilter: (req, file, cb) => {
	  if (file.mimetype.startsWith('image/')) {
		cb(null, true);
	  } else {
		cb(new Error('Only image files are allowed'));
	  }
	},
  });
  
export const uploadImages = upload.array('images', 5); // Limit to 5 images per product

export const getProducts = async (req, res) => {
	try {
		const products = await Product.find({});
		res.status(200).json({ success: true, data: products });
	} catch (error) {
		console.log("error in fetching products:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, quantity } = req.body;
    const imagePaths = req.files.map(file => file.path); // Get paths of uploaded images

    if (!name || !price || !imagePaths.length) {
      return res.status(400).json({ success: false, message: "Please provide all fields including images" });
    }
	
    const newProduct = new Product({
      name,
      price,
      description,
	  quantity,
      images: imagePaths, // Save image paths in the product document
    });

    await newProduct.save();
    res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    console.error("Error in Create product:", error.message);
    res.status(500).json({ success: false, message: error.massage });
  }
};


export const updateProduct = async (req, res) => {
	const { id } = req.params;

	const product = req.body;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Product Id" });
	}

	try {
		const updatedProduct = await Product.findByIdAndUpdate(id, product, { new: true });
		res.status(200).json({ success: true, data: updatedProduct });
	} catch (error) {
		res.status(500).json({ success: false, message: "Server Error" });
	}
};

export const deleteProduct = async (req, res) => {
	const { id } = req.params;

	if (!mongoose.Types.ObjectId.isValid(id)) {
		return res.status(404).json({ success: false, message: "Invalid Product Id" });
	}

	try {
		await Product.findByIdAndDelete(id);
		res.status(200).json({ success: true, message: "Product deleted" });
	} catch (error) {
		console.log("error in deleting product:", error.message);
		res.status(500).json({ success: false, message: "Server Error" });
	}
};