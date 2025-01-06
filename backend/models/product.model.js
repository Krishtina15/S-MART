import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
        required: true,
      },
      /*images: {
        type: [String], // Array to store multiple image paths
        required: true,
      }*/
    },{
    timestamps: true //CreatedAt, updatedAt
});

const Product = mongoose.model('Product', productSchema);

export default Product;