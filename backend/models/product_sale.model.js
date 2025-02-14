import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
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
        
	},{ timestamps:true}
);

const Sale = mongoose.model("Sale", saleSchema);

export default Sale;