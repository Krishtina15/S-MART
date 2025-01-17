import mongoose from "mongoose";

const saleSchema = new mongoose.Schema(
	{
		product_id:{
            type: mongoose.Schema.Types.ObjectId,
			ref: "Product",
        },
        sold_quantity:{
            type:Number,
            min:1,
        },
        discount:{
            type: Number,
            ref: "Product"
        }
	},{ timestamps:true}
);

const Sale = mongoose.model("Sale", saleSchema);

export default Conversation;