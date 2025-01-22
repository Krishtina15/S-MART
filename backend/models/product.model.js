import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    productName: {
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
      details:[
        {
          key:{type:String},
          value:{type:String},
        },
      ],
      images: {
        type: [String], // Array to store multiple image paths
        required: true,
      }
    },{
    timestamps: true //CreatedAt, updatedAt
});

const Product = mongoose.model('Product', productSchema);

export default Product;