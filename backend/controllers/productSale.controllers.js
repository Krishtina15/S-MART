import mongoose from 'mongoose';
import Product from "../models/product.model.js"; // Double-check this path!
import Sale from "../models/product_sale.model.js";

export const recordSale = async (req, res) => {
    const { sellerId, buyerId, productId } = req.body;

    if (!sellerId || !buyerId || !productId) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return res.status(400).json({ success: false, message: "Invalid Product ID" });
    }
    if (!mongoose.Types.ObjectId.isValid(buyerId)) {
        return res.status(400).json({ success: false, message: "Invalid buyerId" });
    }
    if (!mongoose.Types.ObjectId.isValid(sellerId)) {
        return res.status(400).json({ success: false, message: "Invalid sellerId" });
    }

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(400).json({ success: false, message: "Product Not Found" });
        }

        // Check for existing sale (prevent duplicates)
        const existingSale = await Sale.findOne({ sellerId, buyerId, productId });
        if (existingSale) {
            return res.status(400).json({ success: false, message: "Sale already recorded" });
        }

        const session = await mongoose.startSession();  // Start a MongoDB session for transaction
        session.startTransaction();

        try {
            const newSale = new Sale({ sellerId, buyerId, productId });
            await newSale.save({ session }); // Pass the session

            product.soldCount += 1;
            await product.save({ session }); // Pass the session

            await session.commitTransaction();
            session.endSession();

            res.status(201).json({ success: true, message: "Sale recorded" });
        } catch (transactionError) {
            await session.abortTransaction();
            session.endSession();

            console.error("Error during transaction:", transactionError); // Log the full error object
            res.status(500).json({ success: false, message: "Error recording sale (transaction failed)" });
        }

    } catch (error) {
        console.error("Error recording Sale:", error); // Log the full error object
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

export const getSalesBySeller = async(req,res)=> {
    const {sellerId} =req.params;

    if(!mongoose.Types.ObjectId.isValid(sellerId)) {
        return res.status(400).json({success:false, message:"Invalid SellerId"});
    }

    try{
        const sales= await Sale.find({sellerId}).populate("productId", "productName price");
        res.status(500).json({success:true , sales});
    }catch(error){
        console.error("Error fetching sales history:", error.message);
        res.status(500).json({success:false, message: "Server Error"});
    }
}


// Function to get weekly sales and revenue
export const getWeeklySalesRevenue = async (req, res) => {
    try {
        const { sellerId } = req.query;

        if (!sellerId) {
            return res.status(400).json({ message: "Seller ID is required" });
        }

        const sales = await Sale.aggregate([
            {
                $match: { sellerId: sellerId } // ✅ Filter by sellerId
            },
            {
                $lookup: {
                    from: "products",
                    localField: "productId",
                    foreignField: "_id",
                    as: "product"
                }
            },
            {
                $unwind: "$product"
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        week: { $week: "$createdAt" }
                    },
                    totalSales: { $sum: 1 }, // Count number of sales per week
                    totalRevenue: { $sum: "$product.price" } // Sum of product prices sold
                }
            },
            { $sort: { "_id.year": -1, "_id.week": -1 } } // Sort by latest weeks first
        ]);

        res.json(sales);
    } catch (error) {
        res.status(500).json({ message: "Error fetching weekly sales and revenue", error });
    }
};

