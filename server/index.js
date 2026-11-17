import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoute from "./routes/authRoute.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoute.js";
import addressRoute from './routes/addressRoute.js'
import orderRoute from './routes/orderRoute.js'

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoute);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes); 
app.use('/api/address', addressRoute );
app.use('/api/order', orderRoute)

app.get("/", (req, res) => {
  res.send("Server is running");
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});