import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import productRoutes from "./routes/productRoutes.js";

import { db } from "./config/firebaseAdmin.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/products", productRoutes);

app.get("/", (req, res) => {
  res.send("Bloom & Bliss Backend Running!");
});

app.get("/test-firebase", async (req, res) => {
  try {
    await db.collection("test").limit(1).get();

    res.json({
      success: true,
      message: "Firebase Admin Connected Successfully!",
    });
  } catch (error) {
    console.error("Firebase error:", error);

    res.status(500).json({
      success: false,
      message: "Firebase connection failed",
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Bloom & Bliss server running on port ${PORT}`);
});