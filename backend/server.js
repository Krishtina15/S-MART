import express from "express";
import dotenv from "dotenv";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./config/db.js";
import Product from "./models/product.model.js";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.route.js";
import offerRoutes from "./routes/offer.route.js";
import profileRoutes from "./routes/profile.route.js";
import notificationRoutes from "./routes/notification.route.js"
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

const __dirname = path.resolve();

app.use(express.json()); // allows us to accept JSON data in the req.body
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use('/uploads', express.static('uploads'));

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api",offerRoutes);
app.use("/api/user",profileRoutes);
app.use("/api", notificationRoutes);

if (process.env.NODE_ENV === "production") {
	app.use(express.static(path.join(__dirname, "/frontend")));
	app.get("*", (req, res) => {
		res.sendFile(path.resolve(__dirname, "frontend", "index.html"));
	});
}

app.listen(PORT, () => {
	connectDB().then(() => {
		Product.createIndexes(); })// Create indexes for the Product model
	console.log("Server started at http://localhost:" + PORT);
});
