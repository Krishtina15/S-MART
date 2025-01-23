import mongoose from 'mongoose';


const detailSchema = new mongoose.Schema({
    key: {
        type: String,
        trim: true,
        required: [true, 'Detail key is required']
    },
    value: {
        type: String,
        trim: true,
        required: [true, 'Detail value is required']
    }
}, { _id: false });

const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        minlength: [2, 'Product name must be at least 2 characters long']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number']
    },
    description: {
        type: String,
        trim: true,
        default: ''
    },
    details: {
        type: [detailSchema],  // Corrected from [det ailSchema]
        default: []
    },
    images: {
        type: [String],
        required: [true, 'At least one image is required']
    }
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);

export default Product;