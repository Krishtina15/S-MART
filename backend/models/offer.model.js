
import mongoose from "mongoose";

const offerSchema = new mongoose.Schema(
    {
        sellerId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        buyerId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        productId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        price:{
            type: Number,
            required:true,
        },
        status: {
            type: String,
            enum: ["pending", "accepted", "rejected","completed"],
            default: "pending",
          },
    },
    { timestamps: true }
);

const Offer = mongoose.model("Offer", offerSchema);

export default Offer;
