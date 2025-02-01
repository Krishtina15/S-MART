import mongoose from 'mongoose';
import Product from "../models/product.model.js";
import User from "../models/user.model.js"; // Import User model
import multer from 'multer';
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
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    console.log("Uploading file:", file.originalname);
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
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

export const getProductById = async (req, res) => {
    const { id } = req.params;

    console.log("Received request for product ID:", id);

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }

    try {
        const product = await Product.findById(id);
        console.log("Fetched product:", product);

        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found" });
        }

        res.status(200).json({ success: true, data: product });
    } catch (error) {
        console.error("Error fetching product:", error.message);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};



export const getUserProducts = async (req, res) => {
	const { userId } = req.params;
  
	try {
	  // Find user and populate products with detailed product info
	  const user = await User.findById(userId).populate('products');
	  
	  if (!user) {
		return res.status(404).json({ success: false, message: "User not found" });
	  }
  
	  res.status(200).json({ success: true, data: user.products });
	} catch (error) {
	  console.error("Error in fetching user products:", error.message);
	  res.status(500).json({ success: false, message: "Server Error" });
	}
  };
  

export const createProduct = async (req, res) => {
	try {
	  const { productName, price, description, details, userId } = req.body;
	  const images = req.files;
  
	  if (!productName || !price || !images || !userId || images.length === 0) {
		return res.status(400).json({ success: false, message: "Please provide all fields including images" });
	  }
  
	  let parsedDetails = [];
	  if (details) {
		parsedDetails = JSON.parse(details);
	  }
  
	  // Create the new product
	  const newProduct = new Product({
		productName,
		price,
		description,
		details: parsedDetails,
		images: images.map(file => file.path),
		userId,  // Reference the userId who created the product
	  });
  
	  // Save the product
	  await newProduct.save();
  
	  // Add the new product to the user's "products" array
	  await User.findByIdAndUpdate(
		userId,
		{ $push: { products: newProduct._id } }, // Push the new product's ID to the user's products array
		{ new: true }
	  );
  
	  res.status(201).json({ success: true, data: newProduct });
	} catch (error) {
	  console.error("Error in Create product:", error.message);
	  res.status(500).json({ success: false, message: error.message });
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
    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    console.log("error in deleting product:", error.message);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
