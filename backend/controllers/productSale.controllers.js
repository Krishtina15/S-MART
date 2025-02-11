import Product from "../models/product.model";
import Sale from "../models/product_sale.model";

export const recordSale = async (req,res)=>{
    const {sellerId, buyerId, productId} =req.body;

    if(!sellerId || !buyerId || !productId){
        return res.status(400).json({success: false, message:"All files are required"});

    }

    if (!mongoose.Types.ObjectId.isValid(productId))
    {
        return res.status(400).json({success:false, message:"Invalid Product ID"});

    }
    try{
        const product =await Product.findById(productId);
        if(!product){
            return res.status(400).json({sucess:false, message: "Product Not Found"});

        }
        const newSale= Sale({sellerId, buyerId, productId});
        await newSale.save();

        product.soldCount+=1;
        await product.save();

        res.status(201).json({success:true, message:"Sale recorded"})
    }
    catch(error){
        console.error("Error recording Sale:", error.message);
        res.status(500).json({success:false, message:"Server Error"});
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
        const sales = await Sale.aggregate([
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
