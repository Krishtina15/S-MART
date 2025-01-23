import mongoose from "mongoose";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import Product from "../models/product.model.js";
import logger from '../config/logger.js'; // Assuming you've set up Winston logger

// Enhanced Storage Configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(process.cwd(), 'uploads', 'products');
        
        try {
            fs.mkdirSync(uploadDir, { recursive: true });
            cb(null, uploadDir);
        } catch (err) {
            logger.error('Directory Creation Error', { 
                message: err.message, 
                stack: err.stack 
            });
            cb(err, null);
        }
    },
    filename: (req, file, cb) => {
        try {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            const filename = `product-${uniqueSuffix}${path.extname(file.originalname)}`;
            cb(null, filename);
        } catch (err) {
            logger.error('Filename Generation Error', { 
                message: err.message, 
                stack: err.stack 
            });
            cb(err, null);
        }
    }
});

// Comprehensive File Filter
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/i;
    
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Multer Upload Configuration
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { 
        fileSize: 5 * 1024 * 1024, // 5MB per file
        files: 5 // Maximum 5 files
    }
});

// Enhanced Upload Middleware
export const uploadImages = (req, res, next) => {
    const multerUpload = upload.array('images', 5);
    
    multerUpload(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            logger.error('Multer Upload Error', {
                code: err.code,
                message: err.message,
                field: err.field
            });
            return res.status(400).json({
                success: false,
                message: `Upload error: ${err.message}`,
                code: err.code
            });
        } else if (err) {
            logger.error('Unknown Upload Error', {
                message: err.message,
                stack: err.stack
            });
            return res.status(500).json({
                success: false,
                message: 'File upload failed',
                details: err.message
            });
        }
        next();
    });
};

// Validation Helper Function
const validateProductData = (data) => {
    const errors = [];

    if (!data.name || data.name.trim() === '') {
        errors.push('Product name is required');
    }

    if (!data.price || isNaN(parseFloat(data.price))) {
        errors.push('Valid price is required');
    }

    if (!data.files || data.files.length === 0) {
        errors.push('At least one image is required');
    }

    return errors;
};

// Parse Details Helper Function
const parseProductDetails = (details) => {
    try {
        return typeof details === 'string' 
            ? JSON.parse(details) 
            : details;
    } catch (parseError) {
        logger.error('Details Parsing Error', {
            originalDetails: details,
            errorMessage: parseError.message
        });
        throw new Error('Invalid details format');
    }
};

export const createProduct = async (req, res) => {
    // Log incoming request details
    logger.info('Create Product Request', {
        body: req.body,
        files: req.files?.length
    });

    try {
        // Destructure request data
        const { 
            name, 
            price, 
            description = '', 
            details = '[]' 
        } = req.body;

        const files = req.files;

        // Validate input data
        const validationErrors = validateProductData({ 
            name, 
            price, 
            files 
        });

        if (validationErrors.length > 0) {
            logger.warn('Product Creation Validation Failed', {
                errors: validationErrors
            });
            return res.status(400).json({
                success: false,
                message: 'Validation Failed',
                errors: validationErrors
            });
        }

        // Parse product details
        let processedDetails;
        try {
            processedDetails = parseProductDetails(details);
        } catch (parseError) {
            return res.status(400).json({
                success: false,
                message: parseError.message
            });
        }

        // Prepare image paths
        const imagePaths = files.map((file, index) => {
            if (!file.path) {
                throw new Error(`Invalid file upload for file ${index}`);
            }
            return path.relative(process.cwd(), file.path);
        });

        // Prepare product data
        const productData = {
            productName: name.trim(),
            price: parseFloat(price),
            description: description.trim(),
            details: processedDetails.filter(detail => 
                detail.key && detail.value
            ),
            images: imagePaths
        };

        // Create and validate product
        const newProduct = new Product(productData);
        
        // Validate product
        try {
            await newProduct.validate();
        } catch (validationError) {
            logger.error('Product Validation Error', {
                errors: validationError.errors
            });
            return res.status(400).json({
                success: false,
                message: "Product validation failed",
                errors: Object.values(validationError.errors).map(err => err.message)
            });
        }

        // Save product
        const savedProduct = await newProduct.save();

        logger.info('Product created successfully', {
            productId: savedProduct._id
        });
        
        return res.status(201).json({ 
            success: true, 
            message: "Product created successfully", 
            product: savedProduct 
        });

    } catch (error) {
        // Log critical error
        logger.error('Product Creation Critical Error', {
            message: error.message,
            name: error.name,
            stack: error.stack
        });

        // Clean up uploaded files
        if (req.files) {
            req.files.forEach(file => {
                try {
                    fs.unlinkSync(file.path);
                } catch (unlinkError) {
                    logger.error('File Cleanup Error', {
                        message: unlinkError.message
                    });
                }
            });
        }

        // Handle specific error types
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                success: false,
                message: "Validation Error",
                errors: Object.values(error.errors).map(err => err.message)
            });
        }

        return res.status(500).json({ 
            success: false, 
            message: "Server error occurred",
            error: error.message 
        });
    }
};

export const deletedProduct=()=>{}
// Other controllers remain the same
export const getProducts = async (req, res) => {
    try {
        const products = await Product.find({});
        
        // Transform products to include full image URLs
        const transformedProducts = products.map(product => ({
            ...product.toObject(),
            images: product.images.map(imagePath => 
                `${req.protocol}://${req.get('host')}/${imagePath}`
            )
        }));

        res.status(200).json({ 
            success: true, 
            data: transformedProducts 
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error" 
        });
    }
};

// Get single product by ID
export const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        // Transform product to include full image URLs
        const transformedProduct = {
            ...product.toObject(),
            images: product.images.map(imagePath => 
                `${req.protocol}://${req.get('host')}/${imagePath}`
            )
        };

        res.status(200).json({ 
            success: true, 
            data: transformedProduct 
        });
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error" 
        });
    }
};

// Update Product
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedProduct = await Product.findByIdAndUpdate(
            id, 
            updateData, 
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: "Product updated successfully", 
            data: updatedProduct 
        });
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error" 
        });
    }
};

// Delete Product
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedProduct = await Product.findByIdAndDelete(id);

        if (!deletedProduct) {
            return res.status(404).json({ 
                success: false, 
                message: "Product not found" 
            });
        }

        // Optionally, delete associated images from the filesystem
        deletedProduct.images.forEach(imagePath => {
            fs.unlink(imagePath, (unlinkError) => {
                if (unlinkError) console.error('Cleanup Error:', unlinkError);
            });
        });

        res.status(200).json({ 
            success: true, 
            message: "Product deleted successfully" 
        });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ 
            success: false, 
            message: "Server Error" 
        });
    }
};