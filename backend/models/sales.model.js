import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
	{
		product_id:{
            type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
        },
        quantity:{
            type:Number,
        }
        
	},
);

const Sale = mongoose.model("Sale", saleSchema);

export default Conversation;